import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createComment, getLastUserActivity } from "../features/data/dataSlice";
import { openSnack, SnackType } from "../features/data/uiSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentEditorField } from "./CommentEditorField";
import { PrimaryButton } from "./PrimaryButton";
import { UserTag } from "./UserTag";

export function CommentEditor(props: { item: InventoryItem }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.data.user);
  const [editing, setEditing] = useState<boolean>(false);
  const [body, setBody] = useState<string>("");

  async function _comment() {
    const result = await dispatch(
      createComment({ itemId: props.item.id, body: body })
    ).unwrap();

    if (!result.success) {
      return dispatch(
        openSnack({
          message: "There was an issue posting comment.",
          type: SnackType.error,
        })
      );
    }

    dispatch(getLastUserActivity());

    setBody("");
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full items-start mt-4">
        <div className="h-[2em] min-w-[2em]">
          <UserTag user={user} comment />
        </div>
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
