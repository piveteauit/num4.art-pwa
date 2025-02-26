import { ReactNode } from "react";
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh flex flex-col text-black bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Administration Num4</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
