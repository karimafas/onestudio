import { Button, Dialog, Typography } from "@mui/material";
import "./ConfirmDialog.css";

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
      <Typography
        sx={{
          marginLeft: "1.7em",
          marginRight: "2em",
          marginTop: "1.8em",
          fontWeight: "bold",
          fontSize: "1.2em",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{ marginLeft: "2em", marginRight: "2em", marginTop: "0.7em" }}
      >
        {body}
      </Typography>
      <div className="confirm-dialog__row">
        <Button
          onClick={() => setOpen(false)}
          color="error"
          sx={{ marginRight: "0.5em" }}
        >
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
    </Dialog>
  );
};
export default ConfirmDialog;
