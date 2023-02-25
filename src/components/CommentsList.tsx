import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { Comment } from "../objects/Comment";
import { InventoryItem } from "../objects/InventoryItem";
import { deleteComment } from "../reducers/dataSlice";
import { openSnack, SnackType } from "../reducers/uiSlice";
import { CommentPosted } from "./CommentPosted";
import ConfirmDialog from "./ConfirmDialog";

export function CommentsList(props: {
  comments: Comment[];
  item: InventoryItem;
}) {
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  async function _delete() {
    if (!selectedId) return;
    const result = await dispatch(
      deleteComment({ commentId: selectedId, itemId: props.item.id })
    ).unwrap();

    if (!result.success)
      return dispatch(
        openSnack({
          message: "There was an issue deleting comment.",
          type: SnackType.error,
        })
      );
  }

  return (
    <div className="mt-5">
      <ConfirmDialog
        open={deleteConfirm}
        setOpen={setDeleteConfirm}
        title="Delete comment"
        body="Are you sure you want to delete this comment?"
        icon={<DeleteIcon className="mr-1" fontSize="small" />}
        onConfirm={_delete}
      />
      {props.comments.map((c) => (
        <CommentPosted
          key={`comment-${c.id}-${c.createdAt}`}
          comment={c}
          setSelectedId={setSelectedId}
          setDeleteConfirm={setDeleteConfirm}
          item={props.item}
        />
      ))}
    </div>
  );
}
