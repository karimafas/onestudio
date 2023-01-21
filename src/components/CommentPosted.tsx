import { Tooltip } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateComment } from "../features/data/dataSlice";
import { openSnack, SnackType } from "../features/data/uiSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { Comment } from "../objects/Comment";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentEditorField } from "./CommentEditorField";
import { PrimaryButton } from "./PrimaryButton";
import { UserTag } from "./UserTag";

export function CommentPosted(props: {
  comment: Comment;
  setSelectedId: Function;
  setDeleteConfirm: Function;
  item: InventoryItem;
}) {
  const { comment, setSelectedId, setDeleteConfirm } = props;
  const dispatch = useAppDispatch();
  const user = useAppSelector(
    (state) =>
      state.data.studioUsers.filter((su) => su.id === comment.userId)[0]
  );
  const loggedInUser = useAppSelector((state) => state.data.user);
  const [editing, setEditing] = useState<boolean>(false);
  const [body, setBody] = useState<string>(comment.body);
  const isPoster = loggedInUser && loggedInUser.id === user.id;

  async function _update() {
    const result = await dispatch(
      updateComment({ commentId: comment.id, body: body })
    ).unwrap();

    if (!result.success)
      return dispatch(
        openSnack({
          message: "There was an issue updating comment.",
          type: SnackType.error,
        })
      );
    setEditing(false);
  }

  return (
    <div className="w-[30rem]">
      <div
        className="flex flex-row w-full items-start"
        key={`${comment.id}-${comment.createdAt}`}
      >
        <div className="h-[2em] min-w-[2em] mt-2">
          <UserTag user={user} />
        </div>
        <div className="rounded px-4 grow flex flex-col w-full">
          <span>
            <span className="text-[11px] font-medium text-dark_blue">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-[11px] font-medium text-light_blue">
              {" "}
              • {moment(comment.createdAt).format("D MMM yy, HH:mm")}
              <Tooltip
                title={`Last edited at ${moment(comment.updatedAt).format(
                  "D MMM yy, HH:mm"
                )}`}
              >
                <span className="cursor-pointer">
                  {comment.createdAt != comment.updatedAt ? " • edited" : ""}
                </span>
              </Tooltip>
            </span>
          </span>
          {!editing ? (
            <div>
              <CommentEditorField
                style="text-dark_blue text-xs break-words"
                body={comment.body}
                setBody={() => {}}
                setEditing={() => {}}
                editing={false}
                viewing
              />
              {isPoster ? (
                <div className="flex flex-row mt-1">
                  <span
                    className="text-xs font-medium text-dark_blue cursor-pointer hover:underline"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </span>
                  <span className="text-xs font-medium text-dark_blue mx-2">
                    •
                  </span>
                  <span
                    className="text-xs font-medium text-dark_blue cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedId(comment.id);
                      setDeleteConfirm(true);
                    }}
                  >
                    Delete
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="w-[27rem]">
              <CommentEditorField
                body={body}
                setBody={setBody}
                setEditing={() => {}}
                editing
              />
              <div className="w-full flex flex-row justify-end mt-3">
                <PrimaryButton
                  size="small"
                  onClick={() => setEditing(false)}
                  text="Cancel"
                  style="mr-3"
                  icon={ImageHelper.image(Images.closePurple)}
                  iconStyle="w-[10px]"
                />
                <PrimaryButton
                  size="small"
                  onClick={_update}
                  text="Save"
                  backgroundColor="bg-blue"
                  textColor="text-white"
                  disabled={body.trim() === ""}
                  icon={ImageHelper.image(Images.check)}
                  iconStyle="w-[13px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-[1em]"></div>
    </div>
  );
}
