import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownCardProps {
  title: string;
  children: React.ReactNode;
}

export function DropdownCard({ title, children }: DropdownCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-dark1 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out text-light1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-dark1/40 hover:bg-dark1/70 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          isOpen ? "bg-dark1/70" : ""
        }`}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
