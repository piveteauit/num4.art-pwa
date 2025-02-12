import { Link } from "@/navigation";
import React from "react";

// type AppRoutes =
//   | "/see-all"
//   | "/see-all-artists"
//   | "/player"
//   | "/artist"
//   | "/library";

interface CategoryTitleProps {
  title: string;
  href?: any;
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ title, href }) =>
  href ? (
    <Link href={href} className="text-white-500 hover:underline">
      <div className="flex justify-between gap-4 items-end mb-4 mx-6">
        <h3 className="font-semibold text-xl">{title}</h3>
        <span>Voir tout</span>
      </div>
    </Link>
  ) : (
    <div className="flex justify-between items-center mb-4 mx-6">
      <h3 className="font-semibold text-xl">{title}</h3>
    </div>
  );

export default CategoryTitle;
