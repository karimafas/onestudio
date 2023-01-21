import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { useAppSelector } from "../app/hooks";
import classNames from "../styles/mentions.module.css";
import { UserTag } from "./UserTag";

export function CommentEditorField(props: {
  body: string;
  setBody: Function;
  setEditing: Function;
  editing?: boolean;
  viewing?: boolean;
  style?: string;
}) {
  const { body, setBody, setEditing, editing, viewing, style } = props;

  const marginLeft = viewing ? "" : editing ? "" : "ml-4";
  const marginTop = viewing || editing ? "mt-2" : "";

  const rawUsers = useAppSelector((state) => state.data.studioUsers);
  const users = rawUsers.map((u) => {
    return { id: u.id, display: `${u.firstName} ${u.lastName}` };
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);

  return (
    <div
      className={
        viewing
          ? "mt-1"
          : `rounded min-h-[3em] ${marginLeft} ${marginTop} grow border-[1.5px] border-light_grey flex flex-row items-center outline-none p-2 ${
              style ?? ""
            }`
      }
    >
      <MentionsInput
        readOnly={viewing}
        singleLine={false}
        placeholder={editing ? "Edit comment..." : "Add a comment..."}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => setEditing(false)}
        onFocus={() => setEditing(true)}
        className="mentions"
        classNames={classNames}
      >
        <Mention
          className={classNames.mentions__mention}
          trigger="@"
          data={users}
          displayTransform={(_, display) => ` @${display} `}
          renderSuggestion={(suggestion, search, highlightedDisplay) => (
            <div
              className="flex flex-row items-center px-2"
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
            >
              <div className="h-[2em] w-[2em] mr-2">
                <UserTag
                  user={rawUsers.filter((u) => u.id === suggestion.id)[0]}
                />
              </div>
              <span>{highlightedDisplay}</span>
            </div>
          )}
          appendSpaceOnAdd
        />
      </MentionsInput>
    </div>
  );
}
