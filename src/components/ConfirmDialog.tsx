import { Button, Dialog, Typography } from "@mui/material";
import "./ConfirmDialog.css";
import DeleteIcon from "@mui/icons-material/Delete";

const ConfirmDialog = (props: {
  title: string;
  body: string;
  open: boolean;
  setOpen: Function;
  onConfirm: Function;
}) => {
  const { title, body, open, setOpen, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <div style={{ padding: "1.2em" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "1em",
          }}
        >
          <DeleteIcon sx={{ marginRight: "0.2em" }} fontSize="small" />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1.2em",
            }}
          >
            {title}
          </Typography>
        </div>

        <Typography sx={{ marginBottom: "0.5em" }}>{body}</Typography>
        <div className="confirm-dialog__row">
          <Button onClick={() => setOpen(false)} color="error">
            No
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            color="primary"
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
export default ConfirmDialog;
