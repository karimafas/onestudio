import { StringHelper } from "../helpers/StringHelper";
import { StudioUser } from "../objects/StudioUser";

export function UserTag(props: {
  user: StudioUser | undefined;
  comment?: boolean;
}) {
  return (
    <div
      className={`h-full w-full bg-blue rounded-[100%] flex flex-col items-center justify-center ${
        props.comment ? "mt-2" : ""
      } cursor-default`}
    >
      <span className="font-semibold text-white text-sm">
        {StringHelper.userInitials(props.user)}
      </span>
    </div>
  );
}
