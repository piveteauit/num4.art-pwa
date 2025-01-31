import Button from "@/components/ui/Button/Button";
import React from "react";

const Submit = ({
  onPrevious,
  onNext,
  canProgress = true
}: {
  onPrevious?: () => void;
  onNext: () => void;
  canProgress?: boolean;
}) => {
  return (
    <div className="flex justify-between mb-6 gap-4 w-full px-6">
      {onPrevious && (
        <Button color="base" className="flex-1 opacity-60" onClick={onPrevious}>
          Précédent
        </Button>
      )}
      <Button
        color="primary"
        className="flex-1"
        onClick={onNext}
        disabled={!canProgress}
      >
        Suivant
      </Button>
    </div>
  );
};

export default function LayoutPublishStep({
  children,
  onPrevious,
  onNext,
  title,
  description,
  canProgress = true
}: {
  children: React.ReactNode;
  onPrevious?: () => void;
  onNext: () => void;
  title: string;
  description?: string;
  canProgress?: boolean;
}) {
  return (
    <>
      <h2 className="ml-6 text-2xl font-bold">{title}</h2>
      {description && <p className="ml-6 text-gray-300">{description}</p>}
      <div className="flex flex-col justify-between items-center flex-1">
        {children}
        <Submit
          onPrevious={onPrevious}
          onNext={onNext}
          canProgress={canProgress}
        />
      </div>
    </>
  );
}
