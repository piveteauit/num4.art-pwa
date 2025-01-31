interface IconPublishProps {
  isActive?: boolean;
  className?: string;
}

export const IconPublish = ({
  isActive = false,
  className = ""
}: IconPublishProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill={isActive ? "#FFFFFF" : "none"}
      />
      <path
        d="M12 8V16M8 12H16"
        stroke={isActive ? "#000000" : "#FFFFFF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
