import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { reloadItem } from "../features/data/dataSlice";
import { Comment } from "../objects/Comment";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentRepository } from "../repositories/CommentRepository";
import ConfirmDialog from "./ConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommentPosted } from "./CommentPosted";

export function CommentsList(props: {
  comments: Comment[];
  item: InventoryItem;
}) {
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  async function _delete() {
    if (!selectedId) return;
    const success = await CommentRepository.deleteComment(selectedId);
    if (!success) return;
    dispatch(reloadItem(props.item.id));
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
          comment={c}
          setSelectedId={setSelectedId}
          setDeleteConfirm={setDeleteConfirm}
          item={props.item}
        />
      ))}
    </div>
  );
}
