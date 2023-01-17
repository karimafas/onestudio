import { TextareaAutosize } from "@mui/material";

export function CommentEditorField(props: {
  body: string;
  setBody: Function;
  setEditing: Function;
  editing?: boolean;
}) {
  const { body, setBody, setEditing, editing } = props;

  const marginLeft = editing ? "" : "ml-4";
  const marginTop = editing ? "mt-2" : "";

  return (
    <div
      className={`rounded min-h-[3em] ${marginLeft} ${marginTop} grow border-[1.5px] border-light_grey flex flex-row items-center`}
    >
      <TextareaAutosize
        minRows={2}
        value={body}
        onBlur={() => setEditing(false)}
        onFocus={() => setEditing(true)}
        className="outline-none bg-transparent resize-none w-full px-2 text-dark_blue text-xs my-2"
        placeholder={editing ? "Edit comment..." : "Add a comment..."}
        onChange={(e) => setBody(e.target.value)}
      ></TextareaAutosize>
    </div>
  );
}
