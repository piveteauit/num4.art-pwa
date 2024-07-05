import Button, { ButtonProps } from "./Button";

function ButtonFilter(props: ButtonProps) {
  const { className, active } = props;
  const bgClass = active ? "" : "bg-white border-white";
  return (
    <Button
      {...props}
      size={"xs"}
      className={`px-4 tracking-wider font-normal min-h-0 h-7 rounded-full ${bgClass + " " + className}`}
    />
  );
}

export default ButtonFilter;
