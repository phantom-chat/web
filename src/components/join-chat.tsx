import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
				안녕! 이름이 뭐에요?
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
		</div>
	);
};
