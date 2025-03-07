import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface FormInputProps {
  name: string;
  control: any;
  label: string;
  isTextArea?: boolean;
  rows?: number;
}

export const FormInput = ({
  name,
  control,
  label,
  isTextArea = false,
  rows = 3,
}: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative pt-[1rem] pb-1 border-gray-600 px-1 border rounded-[5px] focus-within:border-[#1d9bf0] focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)]">
          <FormControl>
            {isTextArea ? (
              <textarea
                id={name}
                rows={rows}
                className="block w-full px-4 pt-[1rem] text-[16px] border-0 focus:outline-none bg-transparent peer"
                placeholder=""
                {...field}
              />
            ) : (
              <Input
                id={name}
                className="block w-full px-4 text-[16px] border-0 focus:outline-none bg-transparent peer"
                placeholder=""
                {...field}
              />
            )}
          </FormControl>
          <label
            htmlFor={name}
            className={`absolute text-[16px] ${
              field.value
                ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                : `left-4 top-${isTextArea ? "4" : "2"} -translate-y-4`
            } left-4 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-${
              isTextArea ? "1/4" : "1/2"
            } peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0]`}
          >
            {label}
          </label>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
