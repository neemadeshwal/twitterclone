import { TbCameraPlus } from "react-icons/tb";
import Image from "next/image";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Loading from "./loading";

interface ImageUploadProps {
  control: any;
  name: string;
  value?: string;
  loading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isCover?: boolean;
  firstName?: string;
}

export const ImageUpload = ({ 
  control, 
  name, 
  value, 
  loading, 
  onUpload, 
  isCover = false,
  firstName = ""
}: ImageUploadProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            {loading ? (
              <div className={`flex ${isCover?"":"rounded-full border border-gray-700 w-[130px] items-center h-[130px]"} justify-center items-center`}><Loading/></div>
            ) : (
              <div className={isCover ? "w-full h-[170px] flex items-center justify-center" : ""}>
                {value ? (
                  <div>
                    {value.startsWith("#") && !isCover ? (
                      <div
                        className="rounded-full text-[60px] border-4 border-black flex items-center justify-center capitalize"
                        style={{
                          backgroundColor: value,
                          width: "130px",
                          height: "130px",
                        }}
                      >
                        {firstName.slice(0, 1)}
                      </div>
                    ) : (
                      <Image
                        src={value}
                        alt=""
                        className={isCover ? "w-full h-[170px]" : "rounded-full w-[130px] h-[130px] border-black border-4 bg-contain"}
                        width={isCover ? 100 : 40}
                        height={isCover ? 100 : 40}
                      />
                    )}
                  </div>
                ) : (
                  !isCover && (
                    <div
                      className="rounded-full bg-purple-950 text-[60px] border-4 border-black flex items-center justify-center capitalize"
                      style={{
                        width: "130px",
                        height: "130px",
                      }}
                    >
                      {firstName.slice(0, 1)}
                    </div>
                  )
                )}
                <div className={`absolute top-0 left-0 w-full h-full ${isCover?"pb-10":""}  flex justify-center items-center`}>
                  <div className="cursor-pointer p-2 z-[100]">
                    <label htmlFor={name} className="cursor-pointer">
                      <TbCameraPlus className="w-7 h-7" />
                      <input
                        type="file"
                        id={name}
                        onChange={onUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
