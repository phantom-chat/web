'use client'

import { DesktopMessage } from "./responsive/desktop";
import { MobileMessage } from "./responsive/mobile";

export type MessageProps = {
  id: string;
  content: string;
  createdAt: number;
  authorId: string;
};

export const Message = ({ ...message }: MessageProps) => {
  return (
    <>
      <MobileMessage {...message} />
      <DesktopMessage {...message} />
    </>
  );
};
