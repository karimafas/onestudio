import { useAppSelector } from "../app/hooks";
import { InventoryItem } from "../objects/InventoryItem";
import { CommentEditorField } from "./CommentEditorField";
import { UserTag } from "./UserTag";

export function CommentEditor(props: { item: InventoryItem }) {
  const user = useAppSelector((state) => state.data.user);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full items-start mt-4">
        <div className="h-[2em] min-w-[2em]">
          <UserTag user={user} comment />
        </div>
        <CommentEditorField item={props.item} />
      </div>
    </div>
  );
}
