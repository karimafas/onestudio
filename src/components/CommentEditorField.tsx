import { useEffect, useRef, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createComment,
  getLastUserActivity,
  reloadStatus,
  updateComment,
} from "../features/data/dataSlice";
import { openSnack, SnackType } from "../features/data/uiSlice";
import { ImageHelper, Images } from "../helpers/ImageHelper";
import { Comment } from "../objects/Comment";
import { FileUpload } from "../objects/FileUpload";
import { InventoryItem } from "../objects/InventoryItem";
import classNames from "../styles/mentions.module.css";
import { AttachedFiles } from "./AttachedFiles";
import { PrimaryButton } from "./PrimaryButton";
import { UserTag } from "./UserTag";

export function CommentEditorField(props: {
  item: InventoryItem;
  viewing?: boolean;
  style?: string;
  comment?: Comment;
  deleteComment?: Function;
  isAuthor?: boolean;
}) {
  const { viewing, style, item, comment, deleteComment, isAuthor } = props;
  const dispatch = useAppDispatch();
  const [body, setBody] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  const marginLeft = viewing ? "" : "ml-4";
  const marginTop = "";

  const rawUsers = useAppSelector((state) => state.data.studioUsers);
  const users = rawUsers.map((u) => {
    return { id: u.id, display: `${u.firstName} ${u.lastName}` };
  });

  const inputFile = useRef<HTMLInputElement | null>(null);
  let [originalAttachments, setOriginalAttachments] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [deletedAttachments, setDeletedAttachments] = useState<FileUpload[]>(
    []
  );

  useEffect(() => {
    if (comment) setBody(comment.body);
    const attachments = comment?.attachments ?? [];
    setOriginalAttachments([...attachments]);
    setUploadedFiles(attachments);
  }, []);

  async function _comment() {
    if (viewing) {
      if (!comment?.id) return;

      const result = await dispatch(
        updateComment({
          itemId: item.id,
          commentId: comment.id,
          body: body,
          deletedAttachments: deletedAttachments,
          attachments: uploadedFiles,
        })
      ).unwrap();

      if (!result.success)
        return dispatch(
          openSnack({
            message: "There was an issue updating comment.",
            type: SnackType.error,
          })
        );
      setEditing(false);
      return;
    }

    const result = await dispatch(
      createComment({ itemId: item.id, body: body, attachments: uploadedFiles })
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

    setTimeout(() => {
      dispatch(reloadStatus(item.id));
    }, 1500);

    setBody("");
    setUploadedFiles([]);
  }

  function _addAttachmentClick() {
    if (!inputFile?.current) return;
    inputFile.current.click();
  }

  async function _handleFileChange(event: any) {
    const fileObject = event.target.files[0];
    if (!fileObject) return;
    setUploadedFiles([...uploadedFiles, fileObject]);
  }

  function _cancel() {
    if (!viewing) setBody("");
    setEditing(false);
    setUploadedFiles(originalAttachments);
  }

  return (
    <div className="flex flex-col">
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={_handleFileChange}
      />
      <div
        className={
          !editing && viewing
            ? "mt-1"
            : `rounded min-h-[3em] ${marginLeft} ${marginTop} grow border-[1.5px] border-light_grey flex flex-col justify-center outline-none p-2 ${
                style ?? ""
              }`
        }
      >
        <MentionsInput
          readOnly={!editing}
          singleLine={false}
          placeholder={viewing ? "Edit comment..." : "Add a comment..."}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onFocus={() => {
            if (!viewing || isAuthor) setEditing(true);
          }}
          className="mentions"
          classNames={classNames}
        >
          <Mention
            className={classNames.mentions__mention}
            trigger="@"
            data={users}
            displayTransform={(_, display) => ` @${display} `}
            renderSuggestion={(suggestion, search, highlightedDisplay) => (
              <div className="flex flex-row items-center px-2">
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
        <AttachedFiles
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          deleteId={(id: number) =>
            setDeletedAttachments([
              ...deletedAttachments,
              uploadedFiles.filter((a) => a.id === id)[0],
            ])
          }
          viewing={!editing && (viewing ?? false)}
        />
      </div>
      {viewing && isAuthor && !editing ? (
        <div className="flex flex-row mt-1">
          <span
            className="text-xs font-medium text-dark_blue cursor-pointer hover:underline"
            onClick={() => {
              setEditing(true);
            }}
          >
            Edit
          </span>
          <span className="text-xs font-medium text-dark_blue mx-2">•</span>
          <span
            className="text-xs font-medium text-dark_blue cursor-pointer hover:underline"
            onClick={() => {
              if (!deleteComment) return;
              deleteComment();
            }}
          >
            Delete
          </span>
        </div>
      ) : (
        <></>
      )}
      {editing ? (
        <div className="w-full flex flex-row justify-end mt-3">
          <PrimaryButton
            size="small"
            onClick={_cancel}
            text="Cancel"
            style="mr-3"
            icon={ImageHelper.image(Images.closePurple)}
            iconStyle="w-[10px]"
          />
          <PrimaryButton
            size="small"
            onClick={_addAttachmentClick}
            text="Attach a file"
            style="mr-3"
            icon={ImageHelper.image(Images.attachDark)}
            iconStyle="w-[10px]"
          />
          <PrimaryButton
            size="small"
            onClick={() => {
              console.log("here");
              _comment();
            }}
            text={viewing ? "Save" : "Comment"}
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
