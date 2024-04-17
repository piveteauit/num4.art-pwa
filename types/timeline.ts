import { ReactNode } from "react";

export interface TimelineItemProps {
  marker?: string;
  title?: string;
  description?: string;
  url?: string;
  element?: ReactNode | string | null;
  image?: {
    src: string;
    name: string;
  };
}

declare type TimelineProps = TimelineItemProps[];

export default TimelineProps;
