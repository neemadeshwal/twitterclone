"use client";
import { deleteTweetMutate } from "@/graphql/mutation/tweet";
import { getCurrentUser, Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BiX } from "react-icons/bi";
import { BsEmojiFrown } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { PiSpeakerSimpleSlash } from "react-icons/pi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { previewFile } from "@/lib/uploadFile";
import { Button } from "@/components/ui/button";
import { editProfile } from "@/graphql/mutation/user";
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
  setEditProfileDialog: any;
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const postRef = useRef<HTMLDivElement>(null);
  const [isUserPost, setIsUserPost] = useState(false);
  const [profileImgLoading, setProfileImgLoading] = useState(false);
  const [coverImgLoading, setCoverImgLoading] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: editProfile,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setEditProfileDialog(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("hey inside onsucnmittt");
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const handlePostDialog = (event: MouseEvent) => {
      if (postRef.current && !postRef.current.contains(event.target as Node)) {
        setEditProfileDialog(false);
      }
    };
    document.addEventListener("mousedown", handlePostDialog);

    return () => {
      document.removeEventListener("mousedown", handlePostDialog);
    };
  }, [setEditProfileDialog]);
  async function handleImgUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (event.target.id === "profileImgUrl") {
      setProfileImgLoading(true);
    } else {
      setCoverImgLoading(true);
    }

    try {
      const fileUrl = await previewFile(event.target.files);
      console.log(fileUrl, "fileUrl");
      if (fileUrl && fileUrl.length !== 0) {
        if (event.target.id === "profileImgUrl") {
          form.setValue("profileImgUrl", fileUrl[0]);
        } else {
          form.setValue("coverImgUrl", fileUrl[0]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (event.target.id === "profileImgUrl") {
        setProfileImgLoading(false);
      } else {
        setCoverImgLoading(false);
      }
    }
  }
  useEffect(() => {
    if (editProfileDialog) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [editProfileDialog]);

  useEffect(() => {
    if (user) {
      if (user?.firstName) {
        form.setValue("firstName", user?.firstName);
      }
      if (user?.lastName) {
        form.setValue("lastName", user?.lastName);
      }
      if (user?.bio) {
        form.setValue("bio", user?.bio);
      }
      if (user?.coverImgUrl) {
        form.setValue("coverImgUrl", user?.coverImgUrl);
      }
      if (user?.profileImgUrl) {
        console.log(form.getValues("profileImgUrl"));
        form.setValue("profileImgUrl", user?.profileImgUrl);
      }
    }
  }, [user]);
  const handleSubmitForm = () => {
    form.handleSubmit(onSubmit)();
  };
  return (
    <div
      ref={postRef}
      style={{
        boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
      }}
      className="absolute text-white py-8 left-0 dimBg top-0 z-[100] w-full h-full flex items-center justify-center "
    >
      <div className="w-[45%] h-full overflow-auto bg-black rounded-[20px]  py-3 ">
        <div className="h-screen">
          <div className="sticky top-0 z-[100000] px-4 ">
            <div className="flex justify-between items-center backdrop-blur-sm z-[1000]   ">
              <div className="flex items-center gap-6">
                <div
                  onClick={() => setEditProfileDialog(false)}
                  className="cursor-pointer"
                >
                  <BiX className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[18px] font-[600]">Edit profile</p>
                </div>
              </div>
              <div className="">
                <button
                  onClick={handleSubmitForm}
                  className="py-1 font-[600] px-4 rounded-full bg-white text-black capitalize"
                >
                  save
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-full py-4 px-1 ">
            <Form {...form}>
              <form id="editprofile" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="h-full">
                  <div
                    style={{ height: "250px" }}
                    className="relative h-[300px]"
                  >
                    {form.getValues("coverImgUrl") !== "" ? (
                      <div className="">
                        <Image
                          src={
                            form.getValues("coverImgUrl") ?? "/defaultvalue.png"
                          }
                          alt=""
                          className="w-full h-[170px] bg-contain"
                          width={100}
                          height={100}
                        />
                      </div>
                    ) : (
                      <div
                        style={{ height: "170px" }}
                        className="w-full  flex items-center justify-center relative "
                      >
                        <FormField
                          control={form.control}
                          name="coverImgUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {coverImgLoading ? (
                                  <div>loading......</div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="cursor-pointer p-2">
                                      <label
                                        htmlFor="coverImgUrl"
                                        className="cursor-pointer"
                                      >
                                        <TbCameraPlus className="w-7 h-7 cursor-pointer " />
                                        <input
                                          type="file"
                                          name="coverImgUrl"
                                          id="coverImgUrl"
                                          onChange={handleImgUpload}
                                          className="hidden cursor-pointer"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-4">
                      <div className="relative ">
                        {form.getValues("profileImgUrl") !== "" ? (
                          <div>
                            {form.getValues("profileImgUrl") &&
                            form.getValues("profileImgUrl").startsWith("#") ? (
                              <div
                                className="rounded-full  w-[100px] text-[60px] border-4 border-black h-[100px] flex items-center justify-center capitalize"
                                style={{
                                  backgroundColor:
                                    form.getValues("profileImgUrl") ?? "red",
                                  width: "130px",
                                  height: "130px",
                                }}
                              >
                                {user?.firstName.slice(0, 1)}
                              </div>
                            ) : (
                              <Image
                                className="rounded-full w-[100px] h-[100px] border-black border-4 bg-contain"
                                src={
                                  form.getValues("profileImgUrl") ??
                                  "/defaultvalue.png"
                                }
                                alt=""
                                width={40}
                                height={40}
                              />
                            )}
                          </div>
                        ) : (
                          <div
                            className="rounded-full bg-purple-950  w-[100px] text-[60px] border-4 border-black h-[100px] flex items-center justify-center capitalize"
                            style={{
                              width: "130px",
                              height: "130px",
                            }}
                          >
                            {user?.firstName.slice(0, 1)}
                          </div>
                        )}
                        <div className="absolute top-[30%] left-[30%]">
                          <FormField
                            control={form.control}
                            name="profileImgUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  {profileImgLoading ? (
                                    <div>loading.....</div>
                                  ) : (
                                    <div>
                                      <div className="cursor-pointer p-2">
                                        <label htmlFor="profileImgUrl">
                                          <TbCameraPlus className="w-7 h-7 cursor-pointer " />
                                          <input
                                            type="file"
                                            id="profileImgUrl"
                                            onChange={handleImgUpload}
                                            className="hidden cursor-pointer"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                              <FormControl>
                                <Input
                                  id="firstName"
                                  className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>

                              <label
                                htmlFor="firstName"
                                className={`absolute text-[16px] ${
                                  form.getValues("firstName")
                                    ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                                    : "left-4 top-2 -translate-y-4"
                                } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                              >
                                Firstname
                              </label>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                              <FormControl>
                                <Input
                                  id="lastName"
                                  className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>

                              <label
                                htmlFor="lastName"
                                className={`absolute text-[16px] ${
                                  form.getValues("lastName")
                                    ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                                    : "left-4 top-2 -translate-y-4"
                                } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                              >
                                Lastname
                              </label>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                              <FormControl>
                                <textarea
                                  id="bio"
                                  rows={3}
                                  className="block w-full px-4 pt-[1rem] text-[16px] border-0 focus:outline-none  bg-transparent peer "
                                  placeholder=""
                                  {...field}
                                ></textarea>
                              </FormControl>

                              <label
                                htmlFor="bio"
                                className={`absolute text-[16px] ${
                                  form.getValues("bio")
                                    ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                                    : "left-4 top-4 -translate-y-4"
                                } left-4 top-0 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                              >
                                Bio
                              </label>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                              <FormControl>
                                <Input
                                  id="location"
                                  className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>

                              <label
                                htmlFor="location"
                                className={`absolute text-[16px] ${
                                  form.getValues("firstName")
                                    ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                                    : "left-4 top-2 -translate-y-4"
                                } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                              >
                                Location
                              </label>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
