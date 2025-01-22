import { ChangeEvent, useState } from "react";

export default function Search() {
  const [text, setText] = useState("");

  return (
    <div className=" flex flex-col xl:w-[1200px] w-full pt-10">
      <SearchInput value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

interface SearchProps {
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function SearchInput({ value, onChange }: SearchProps) {
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
        className="bg-transparent border-b-2 border-dark1 w-[400px] outline-none focus:border-light5 focus:border-opacity-65 text-light1 font-medium text-xl px-2 py-1"
      />
    </div>
  );
}
