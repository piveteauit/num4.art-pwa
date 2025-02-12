"use client";

import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface MenuItem {
  label: string;
  onClick: () => void;
  className?: string;
}

interface MenuProps {
  items: MenuItem[];
}

export const Menu = ({ items }: MenuProps) => {
  return (
    <HeadlessMenu as="div" className="relative inline-block">
      <HeadlessMenu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10">
        <EllipsisVerticalIcon className="w-5 h-5" />
      </HeadlessMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute z-50 right-0 bottom-full mb-2 w-48 origin-bottom-right rounded-md bg-base shadow-lg focus:outline-none">
          <div className="px-1 py-1">
            {items.map((item, index) => (
              <HeadlessMenu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`${
                      active ? "bg-white/10" : ""
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm ${
                      item.className || ""
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </HeadlessMenu.Item>
            ))}
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};
