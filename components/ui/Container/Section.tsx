import { HTMLProps, ReactNode } from "react";

function Section({
  children,
  ...props
}: HTMLProps<HTMLElement> & { children?: ReactNode }) {
  return (
    <section className={"w-full"} {...props}>
      {children}
    </section>
  );
}

export default Section;
