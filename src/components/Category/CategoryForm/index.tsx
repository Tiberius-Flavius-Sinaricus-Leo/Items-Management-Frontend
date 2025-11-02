import { useEffect, useState, type FunctionComponent } from "react";
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Stack, 
  TextField, 
  useMediaQuery, 
  useTheme 
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

import type { CategoryFrontendEntry } from "../../../types/category";

interface CategoryFormProps {
  open: boolean;
  initial: CategoryFrontendEntry;
  onClose: () => void;
  onSave: (values: CategoryFrontendEntry) => Promise<void> | void;
  saving?: boolean;
  title: string;
}

const CategoryForm: FunctionComponent<CategoryFormProps> = ({
  open,
  initial,
  onClose,
  onSave,
  saving = false,
  title,
}: CategoryFormProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = useState<CategoryFrontendEntry>(initial);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initial);
      setTouched(false);
    }
  }, [open, initial]);

  const dirty =
    values.name !== initial.name ||
    (values.description ?? "") !== (initial.description ?? "") ||
    values.bgColor !== initial.bgColor;

  const nameError = values.name.trim() === "" ? "Name is required" : "";

  const handleSave = async () => {
    if (nameError) return;
    await onSave({
      name: values.name.trim(),
      description: (values.description ?? "").trim(),
      bgColor: values.bgColor,
      categoryId: values.categoryId,
    });
  };
  return (
    <Dialog
      open={open}
      onClose={() => (saving ? null : onClose())}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={values.name}
            onChange={(e) => {
              setValues((v) => ({ ...v, name: e.target.value }));
              setTouched(true);
            }}
            autoFocus
            error={!!nameError && touched}
            helperText={touched ? nameError : " "}
          />
          <TextField
            label="Description"
            value={values.description ?? ""}
            onChange={(e) => {
              setValues((v) => ({ ...v, description: e.target.value }));
              setTouched(true);
            }}
            multiline
            minRows={3}
          />
          <MuiColorInput
            label="Background Color"
            format="hex"
            value={values.bgColor}
            onChange={(color) => {
              setValues((v) => ({ ...v, bgColor: color }));
              setTouched(true);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !!nameError || !dirty}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;