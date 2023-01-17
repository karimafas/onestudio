import { Tooltip } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadItemComments } from "../features/data/dataSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { Comment } from "../objects/Comment";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentRepository } from "../repositories/CommentRepository";
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
  async function _save() {
    const success = await CommentRepository.updateComment(comment.id, body);
    if (!success) return;
    setEditing(false);
    dispatch(loadItemComments(props.item));
  }

  return (
    <div className="w-[30rem]">
      <div
        className="flex flex-row w-full items-start"
        key={`${comment.id}-${comment.createdAt}`}
      >
        <UserTag user={user} />
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
              <span className="text-sm text-dark_blue text-xs break-words">
                {comment.body}
              </span>
              {isPoster ? (
                <div className="flex flex-row mt-1">
                  {" "}
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
                  onClick={_save}
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
