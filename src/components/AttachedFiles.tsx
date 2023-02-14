import { ImageHelper, Images } from "../helpers/ImageHelper";
import { StringHelper } from "../helpers/StringHelper";

export function AttachedFiles(props: {
  uploadedFiles: any[];
  setUploadedFiles: Function;
  viewing: boolean;
  deleteId: Function;
}) {
  const { uploadedFiles, setUploadedFiles, deleteId, viewing } = props;

  function _delete(index: number) {
    const deletedAttachmentId = uploadedFiles[index].id;
    if (deletedAttachmentId) deleteId(deletedAttachmentId);
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  }

  function _openAttachment(file: any) {
    if (!file.url) return;

    const FileSaver = require("file-saver");
    FileSaver.saveAs(file.url, file.name || "onestudio-file");
  }

  const margin = !viewing ? "mt-2" : "mt-1";

  return (
    <div className={margin}>
      {uploadedFiles.map((f, idx) => (
        <div
          key={`file-${f.name}-${idx}`}
          className="bg-lightest_purple max-w-max px-2 rounded flex flex-row items-center justify-between mb-1 cursor-pointer"
        >
          <span className="text-[12px] text-dark_blue" onClick={() => _openAttachment(f)}>
            {StringHelper.collapseString(f.name)}
          </span>
          {!viewing ? (
            <div onClick={() => _delete(idx)}>
              <img
                className="h-[10px] ml-3 cursor-pointer"
                src={ImageHelper.image(Images.closePurple)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
}
