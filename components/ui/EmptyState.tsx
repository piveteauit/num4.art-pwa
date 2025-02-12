// components/ui/EmptyState.tsx
"use client";
import Button from "./Button/Button";
import { useRouter } from "@/navigation";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: {
    pathname: "/" | "/publish";
  };
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionLink
}: EmptyStateProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-white bg-opacity-10 rounded-lg p-4">
      <h3 className="text-2xl font-medium text-center">{title}</h3>
      <p className="text-center text-gray-400 max-w-md">{description}</p>

      {actionLabel && actionLink && (
        <Button onClick={() => router.push(actionLink)}>{actionLabel}</Button>
      )}
    </div>
  );
};
