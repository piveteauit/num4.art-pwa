"use client";
import React, { useEffect, useState, ChangeEvent } from "react";

import ButtonFilter from "./Button/ButtonFilter";
interface LibraryFilterProps {
  options: any[];
  onSearch: (searchTerm: string) => void;
}

function LibraryFilter({ options }: { options: any[] }) {
  const [activeOptions, setActiveCategory] = useState<any>({});

  const onClick = (name: string) => {
    const allCat = options?.find((c) => c?.all);

    if (options?.find((c) => c.name === name)?.all) {
      return setActiveCategory(
        options.reduce(
          (acc, c) => ({
            ...acc,
            [c.name]: !activeOptions?.[name]
          }),
          {}
        )
      );
    }

    setActiveCategory({
      ...activeOptions,
      [name]: !activeOptions?.[name],
      [allCat?.name]: activeOptions?.[allCat?.name] && !activeOptions?.[name]
    });
  };

  return (
    <div className="flex gap-2 overflow-x-scroll scrollbar-hide">
      {options.map(({ name }, index) => (
        <ButtonFilter
          className={`${index === 0 ? "ml-6" : ""} 
                ${index === options.length - 1 ? "mr-6" : ""}`}
          active={!!activeOptions?.[name]}
          onClick={(evt) => onClick(name)}
          key={`LibraryFilter-${index}`}
        >
          {name}
        </ButtonFilter>
      ))}
    </div>
  );
}

export default LibraryFilter;
