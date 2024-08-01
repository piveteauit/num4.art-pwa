"use client";
import React, { useEffect, useState,ChangeEvent } from "react";


interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="my-16 w-full flex justify-center items-center text-white">
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-2 py-0 border rounded-full bg-gray-300 bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-white"
        />
        <img
          src="/assets/images/icons/loupe.svg"
          alt="Search Icon"
          width="15"
          height="15"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default SearchBar;