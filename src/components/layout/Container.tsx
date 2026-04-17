import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
};

export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={`max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 ${className}`.trim()}>
      {children}
    </Tag>
  );
}
