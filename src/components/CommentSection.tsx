import { useAppSelector } from "../app/hooks";
import { Comment } from "../objects/Comment";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentEditor } from "./CommentEditor";
import { CommentsList } from "./CommentsList";

export function CommentSection(props: { item: InventoryItem }) {
  const comments = useAppSelector(
    (state) =>
      state.data.items.filter((i) => i.id === props.item.id)[0].comments
  );

  return (
    <div>
      <CommentEditor item={props.item} />
      <CommentsList item={props.item} comments={comments} />
      <div className="h-[5rem]"></div>
    </div>
  );
}
