import { useAuth } from "@/contexts/auth";

export const UserInfo = () => {
	const { isAuthenticated, user } = useAuth();
	if (!isAuthenticated) return;
	return (
		<div className="border rounded-md p-2 bg-secondary">
			<p className="text-sm">@{user?.username}</p>
		</div>
	);
};
