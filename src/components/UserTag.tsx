import { useAppSelector } from "../app/hooks";
import { StringHelper } from "../helpers/StringHelper";
import { StudioUser } from "../objects/StudioUser";

export function UserTag(props: { user: StudioUser | undefined }) {
  return (
    <div className="min-h-[2em] min-w-[2em] bg-blue rounded-[100%] flex flex-col items-center justify-center mt-2">
      <span className="font-semibold text-white text-sm">
        {StringHelper.userInitials(props.user)}
      </span>
    </div>
  );
}
