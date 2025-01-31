interface IconLibraryProps {
  isActive?: boolean;
  className?: string;
}

export const IconLibrary = ({
  isActive = false,
  className = ""
}: IconLibraryProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 7V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V7"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill={isActive ? "#FFFFFF" : "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4H16L17 7H7L8 4Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill={isActive ? "#FFFFFF" : "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11H17"
        stroke={isActive ? "#000000" : "#FFFFFF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 15H17"
        stroke={isActive ? "#000000" : "#FFFFFF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
