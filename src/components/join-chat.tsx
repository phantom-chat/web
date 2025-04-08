import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { type Dispatch, type SetStateAction, useState } from "react";
import logoBlack from "../../public/logo-letter-black.svg";
import logoWhite from "../../public/logo-letter-white.svg";
import Link from "next/link";

type JoinChatCardProps = {
  setUsername: Dispatch<SetStateAction<string | undefined>>;
};

export const JoinChatCard = ({ setUsername }: JoinChatCardProps) => {
  const [name, setName] = useState<string | null>();

  return (
    <div className="items-center justify-center flex-col flex h-screen font-mono">
      <div className="inline-flex items-center gap-2">
        <Image
          src={logoWhite}
          className="hidden dark:block"
          alt="Logo"
          width={360}
          height={120}
        />
        <Image
          src={logoBlack}
          className="block dark:hidden"
          alt="Logo"
          width={360}
          height={120}
        />
      </div>
      <form
        className="w-full max-w-[320px] flex flex-col p-4 border gap-2 rounded-lg"
        onSubmit={(e) => {
          e.preventDefault();
          setUsername(name as string);
        }}
      >
        <Input
          placeholder="place your username"
          minLength={3}
          maxLength={16}
          onChange={(e) => setName(e.currentTarget.value?.trim())}
        />

        <Button type="submit" disabled={!name}>
          join chat
        </Button>
      </form>
      <p className="max-w-xs text-sm text-center mt-4  text-muted-foreground">made with 🖤 by <Link target="_blank" href="https://github.com/upenha" className="hover:text-primary underline transition underline-offset-2">upenha</Link>, <Link target="_blank" href="https://github.com/joaotonaco" className="hover:text-primary underline transition underline-offset-2">joaotonaco</Link> & <Link target="_blank" href="https://github.com/lyricalsoul" className="hover:text-primary underline transition underline-offset-2">lyricalsoul</Link></p>
    </div>
  );
};
