import { Tooltip } from "@mui/material";
import { ReactElement } from "react";
import { StringHelper } from "../helpers/StringHelper";
import { StudioUser } from "../objects/StudioUser";

function tag(
  user?: StudioUser,
  comment?: boolean,
  pointer?: boolean
): ReactElement {
  return (
    <div
      className={`h-full w-full bg-blue rounded-[100%] flex flex-col items-center justify-center ${
        comment ? "mt-2" : ""
      } ${pointer ? "cursor-pointer" : "cursor-default"}`}
    >
      <span className="font-semibold text-white text-sm">
        {StringHelper.userInitials(user)}
      </span>
    </div>
  );
}

export function UserTag(props: {
  user: StudioUser | undefined;
  comment?: boolean;
  pointer?: boolean;
  tooltip?: boolean;
}) {
  const userTag = tag(props.user, props.comment, props.pointer);

  if (props.tooltip)
    return <Tooltip title={props.user?.fullName ?? ""}>{userTag}</Tooltip>;

  return userTag;
}
