import { ChangeEvent } from "react";

interface InputProps {
  placeHolder?: string;
  value: string;
  type?: "text" | "password" | "email";
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputElement({
  placeHolder,
  value,
  type = "text",
  onChange,
}: InputProps) {
  return (
    <input
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeHolder}
      className="outline-none bg-transparent p-2 text-light1 font-normal text-xl border-b-[1px] border-light5 border-opacity-50 focus:border-opacity-100"
      required
    />
  );
}
