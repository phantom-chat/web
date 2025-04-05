import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { type Dispatch, type SetStateAction, useState } from "react";

type teste = {
  daoskdsao: (this: any) => void;
}

type JoinChatCardProps = {
  setUsername: Dispatch<SetStateAction<string | undefined>>;
};

export const JoinChatCard = ({ setUsername }: JoinChatCardProps) => {
  const [name, setName] = useState<string | null>();

  return (
    <div className="items-center justify-center flex h-screen font-mono">
      <form
        className="w-full max-w-[320px] flex flex-col p-4 border gap-2 rounded-lg"
        onSubmit={(e) => {
          e.preventDefault();
          setUsername(name as string);
        }}
      >
        {/* Пивет! Как тебя зовут? */}
        {/* 안녕! 이름이 뭐에요? */}
        <Input
          placeholder="place your username"
          minLength={3}
          maxLength={16}
          onChange={(e) => setName(e.currentTarget.value?.trim())}
        />
        <div className="inline-flex items-center justify-end text-xs gap-2">

          <Checkbox />
          Admin?
        </div>

        <Button type="submit" disabled={!name}>
          join chat
        </Button>
      </form>
    </div>
  );
};
