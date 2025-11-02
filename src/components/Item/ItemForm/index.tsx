import { useEffect, useState, type FunctionComponent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";

import type { ItemFrontendEntry } from "../../../types/item";

interface ItemFormProps {
  open: boolean;
  initial: ItemFrontendEntry;
  onClose: () => void;
  onSave: (values: ItemFrontendEntry) => Promise<void> | void;
  saving?: boolean;
  title: string;
  avalilableCategories: { categoryId: string; categoryName: string }[];
}

const ItemForm: FunctionComponent<ItemFormProps> = ({ open, initial, onClose, onSave, saving, title, avalilableCategories }) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = useState<ItemFrontendEntry>(initial);
  const [touched, setTouched] = useState(false);

  const CategoryMenuItems = avalilableCategories.map(category => (
    <MenuItem key={`itemform-category-menuitem-${category.categoryId}`} value={category.categoryId}>
      {category.categoryName}
    </MenuItem>
  ));

  useEffect(() => {
    if (open) {
      setValues(initial);
      setTouched(false);
    }
  }, [open, initial]);

  const dirty =
    values.name !== initial.name ||
    (values.description ?? "") !== (initial.description ?? "") ||
    (values.price !== initial.price) ||
    values.categoryId !== undefined;

  const nameError = values.name.trim() === "" ? "Name is required" : "";
  const priceError = values.price <= 0 ? "Price must be greater than zero" : "";
  const categoryError = !values.categoryId ? "Category is required" : "";

  const handleSave = async () => {
    if (nameError || priceError || categoryError) return;
    await onSave({
      name: values.name.trim(),
      description: (values.description ?? "").trim(),
      price: values.price,
      categoryId: values.categoryId,
      itemId: values.itemId,
      categoryName: values.categoryName
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
        <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="itemform-category-selection-label">Category</InputLabel>
            <Select
              labelId="itemform-category-selection-label"
              id="itemform-category-selection"
              value={values.categoryId}
              onChange={(e) => setValues({ ...values, categoryId: e.target.value, categoryName: avalilableCategories.find(c => c.categoryId === e.target.value)?.categoryName || "" })}
              label="Category"
            >
              {CategoryMenuItems}
            </Select>
          </FormControl>
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
          <TextField
            label="Price"
            type="number"
            value={values.price}
            onChange={(e) => {
              setValues((v) => ({ ...v, price: Number(e.target.value) }));
              setTouched(true);
            }}
            error={!!priceError && touched}
            helperText={touched ? priceError : " "}
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
}

export default ItemForm;