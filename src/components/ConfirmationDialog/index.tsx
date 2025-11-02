import type { FunctionComponent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content ?? "Are you sure you want to proceed? This action cannot be undone."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
