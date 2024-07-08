"use client";
import { useEffect, useState } from "react";
import ButtonFilter from "./Button/ButtonFilter";
import { usePlayer } from "@/context/PlayerContext";

function CategoryFilter({ categories, songs }: { categories: any[]; songs: any[] }) {
  const [activeCategories, setActiveCategory] = useState<any>({});
  const { setCurrentList } = usePlayer();

  useEffect(() => {
    console.log("----", songs)
    setCurrentList(songs)
  }, [songs])

  const onClick = (name: string) => {
    const allCat = categories?.find((c) => c?.all);

    if (categories?.find((c) => c.name === name)?.all) {
      return setActiveCategory(
        categories.reduce(
          (acc, c) => ({
            ...acc,
            [c.name]: !activeCategories?.[name]
          }),
          {}
        )
      );
    }

    setActiveCategory({
      ...activeCategories,
      [name]: !activeCategories?.[name],
      [allCat?.name]:
        activeCategories?.[allCat?.name] && !activeCategories?.[name]
    });
  };

  return (
    <div className="flex gap-2">
      {categories.map(({ name }, index) => (
        <ButtonFilter
          active={!!activeCategories?.[name]}
          onClick={(evt) => onClick(name)}
          key={`CategoryFilter-${index}`}
        >
          {name}
        </ButtonFilter>
      ))}
    </div>
  );
}

export default CategoryFilter;
