import { UserInfo } from "./info"

export const Sidebar = () => {
    return (
        <div className="h-full w-full justify-end hidden lg:flex">
            <div className="border-l px-2 w-64 h-full flex justify-end flex-col gap-4 py-4">
                <UserInfo />
            </div>
        </div>
    )
}