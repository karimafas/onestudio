import { TextareaAutosize } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadItemComments } from "../features/data/dataSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentRepository } from "../repositories/CommentRepository";
import { CommentEditorField } from "./CommentEditorField";
import { PrimaryButton } from "./PrimaryButton";
import { UserTag } from "./UserTag";

export function CommentEditor(props: { item: InventoryItem }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.data.user);
  const [editing, setEditing] = useState<boolean>(false);
  const [body, setBody] = useState<string>("");

  async function _comment() {
    const success = await CommentRepository.createComment(props.item.id, body);
    if (!success) return;
    dispatch(loadItemComments(props.item));
    setBody("");
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full items-start mt-4">
        <UserTag user={user} />
        <CommentEditorField
          body={body}
          setBody={setBody}
          setEditing={setEditing}
        />
      </div>
      {editing || body.trim() !== "" ? (
        <div className="w-full flex flex-row justify-end mt-3">
          <PrimaryButton
            size="small"
            onClick={() => setBody("")}
            text="Cancel"
            style="mr-3"
            icon={ImageHelper.image(Images.closePurple)}
            iconStyle="w-[10px]"
          />
          <PrimaryButton
            size="small"
            onClick={_comment}
            text="Comment"
            backgroundColor="bg-blue"
            textColor="text-white"
            disabled={body.trim() === ""}
            icon={ImageHelper.image(Images.check)}
            iconStyle="w-[13px]"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
