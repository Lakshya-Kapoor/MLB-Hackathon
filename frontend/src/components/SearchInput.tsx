import { ChangeEvent } from "react";

interface SearchProps {
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchProps) {
  return (
    <div className="flex flex-col items-start gap-6 justify-start">
      <label
        className="font-secular text-light1 text-6xl hover:cursor-pointer select-none"
        htmlFor="search"
      >
        Search
      </label>
      <input
        id="search"
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Seach something..."
        className="bg-transparent border-b-[1px] border-dark1 w-[400px] outline-none focus:border-light5 focus:border-opacity-65 text-light1 font-medium text-xl p-2"
      />
    </div>
  );
}
