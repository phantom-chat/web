import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import { useState } from "react";
import { CopyContentMessageInteraction } from "../interactions/copy-content";
import { CopyIdMessageInteraction } from "../interactions/copy-id";
import { DeleteMessageInteraction } from "../interactions/delete";
import { EditMessageInteraction } from "../interactions/edit";
import { ReplyMessageInteraction } from "../interactions/reply";
import type { MessageProps } from "../message";

export const DesktopMessage = ({
	content,
	createdAt,
	id,
	authorId,
}: MessageProps) => {
	const [contextOpen, setContextOpen] = useState(false);

	const { deleteMessage } = useChat();
	const { user } = useAuth();
	const isAuthor = user?.id === authorId;
	const handleCopyContent = () => {
		navigator.clipboard?.writeText(content);
	};

	const handleCopyId = () => {
		navigator.clipboard?.writeText(String(id));
	};

	const handleDelete = async (id: string) => {
		deleteMessage(id);
		setContextOpen(false);
	};
	return (
		<div className="hidden lg:block">
			<ContextMenu modal={false}>
				<ContextMenuTrigger>
					<div className="flex items-center border border-transparent justify-between py-0.5 px-2 w-full transition hover:text-muted-foreground">
						<p className="whitespace-pre-wrap break-words">{content}</p>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent className="min-w-[200px]">
					<EditMessageInteraction isAuthor={isAuthor} />
					<ReplyMessageInteraction />
					<ContextMenuSeparator />
					<CopyContentMessageInteraction onClick={() => handleCopyContent} />

					{isAuthor && <ContextMenuSeparator />}
					<DeleteMessageInteraction
						modalOpen={contextOpen}
						handleDelete={handleDelete}
						id={id}
						onClick={(e) => {
							e.preventDefault();
							if (e.shiftKey) {
								handleDelete(id);
							} else {
								setContextOpen(true);
							}
						}}
						setModalOpen={setContextOpen}
					/>
					<ContextMenuSeparator />
					<CopyIdMessageInteraction onClick={() => handleCopyId} />
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
};
