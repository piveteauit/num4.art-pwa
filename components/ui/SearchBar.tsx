"use client";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex flex-1 mx-6 justify-center items-center ">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Artistes, titres, albums..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-4 py-2 pr-10 rounded-xl bg-secondary bg-opacity-50  focus:outline-none focus:ring-1 focus:ring-white text-white placeholder:text-white placeholder:text-opacity-70"
        />
        <Image
          src="/assets/images/icons/loupe.svg"
          alt="Search Icon"
          width={20}
          height={20}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default SearchBar;
