import { getCurrentUser } from "@/graphql/types";
import { Icons } from "@/utils/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { previewFile } from "@/lib/uploadFile";
import { useEffect, useRef, useState } from "react";
import { FormInput } from "./FormInput";
import { ImageUpload } from "./EditProfileImgUpload";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import ScrollLock from "./ScrollLock";

const formSchema = z.object({
  firstName: z.string().min(2, "firstname should be at least 2 characters."),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  coverImgUrl: z.string().optional(),
  profileImgUrl: z.string(),
});

const EditProfileContainer = ({
  setEditProfileDialog,
  user,
  editProfileDialog,
}: {
  setEditProfileDialog: (value: boolean) => void;
  user: getCurrentUser;
  editProfileDialog: boolean;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      location: "",
      bio: "",
      profileImgUrl: "",
      coverImgUrl: "",
    },
  });

  const postRef = useRef<HTMLDivElement>(null);
  const [profileImgLoading, setProfileImgLoading] = useState(false);
  const [coverImgLoading, setCoverImgLoading] = useState(false);

  const { editUser } = userUserMutation({});

  const handleImgUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;

    const isProfile = event.target.id === "profileImgUrl";
    isProfile ? setProfileImgLoading(true) : setCoverImgLoading(true);

    try {
      const fileUrl = await previewFile(event.target.files);
      if (fileUrl?.length) {
        form.setValue(isProfile ? "profileImgUrl" : "coverImgUrl", fileUrl[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      isProfile ? setProfileImgLoading(false) : setCoverImgLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const fields = [
        "firstName",
        "lastName",
        "bio",
        "coverImgUrl",
        "profileImgUrl",
      ] as const;
      fields.forEach((field) => {
        if (user[field]) {
          form.setValue(field, user[field]);
        }
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await editUser(values);
      setEditProfileDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="absolute text-white md:py-8 left-0 dimBg top-0 z-[100] w-full h-full flex items-center justify-center"
      style={{ boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)" }}
    >
      <ScrollLock isOpen={editProfileDialog} />
      <div
        ref={postRef}
        className="w-full md:w-[60%] lg:w-[45%] h-full overflow-auto bg-black md:rounded-[20px] py-2 md:py-3"
      >
        <div className="h-[90%]">
          <div className="sticky top-0 z-[100000] px-1 md:px-4">
            <div className="flex justify-between items-center backdrop-blur-sm z-[1000]">
              <div className="flex items-center gap-6">
                <div
                  onClick={() => setEditProfileDialog(false)}
                  className="cursor-pointer hover:bg-[#5656563e] rounded-full p-2"
                >
                  <Icons.XIcon className="w-6 hidden md:block h-6" />
                  <Icons.ArrowLeft className="w-6 md:hidden" />
                </div>
                <p className="text-[18px] font-[600]">Edit profile</p>
              </div>
              <button
                onClick={() => form.handleSubmit(onSubmit)()}
                className="py-1 font-[600] px-4 mr-1 sm:mr-0 rounded-full bg-white text-black capitalize"
              >
                save
              </button>
            </div>
          </div>

          <div className="w-full h-full py-4 px-1">
            <Form {...form}>
              <form id="editprofile" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="h-full">
                  <div
                    style={{ height: "250px" }}
                    className="relative h-[300px]"
                  >
                    <ImageUpload
                      control={form.control}
                      name="coverImgUrl"
                      value={form.getValues("coverImgUrl")}
                      loading={coverImgLoading}
                      onUpload={handleImgUpload}
                      isCover
                    />
                    <div className="absolute bottom-0 left-4">
                      <div className="relative">
                        <ImageUpload
                          control={form.control}
                          name="profileImgUrl"
                          value={form.getValues("profileImgUrl")}
                          loading={profileImgLoading}
                          onUpload={handleImgUpload}
                          firstName={user?.firstName}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-6">
                    <div className="flex flex-col gap-6">
                      <FormInput
                        name="firstName"
                        control={form.control}
                        label="Firstname"
                      />
                      <FormInput
                        name="lastName"
                        control={form.control}
                        label="Lastname"
                      />
                      <FormInput
                        name="bio"
                        control={form.control}
                        label="Bio"
                        isTextArea
                      />
                      <FormInput
                        name="location"
                        control={form.control}
                        label="Location"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileContainer;
