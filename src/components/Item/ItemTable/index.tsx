import { useState, type FunctionComponent } from "react";
import { Box, Tooltip } from "@mui/material";

import PaginatedTable from "../../Table/PaginatedTable";
import type { ItemFrontendEntry, ItemFormState } from "../../../types/item";
import type { Column } from "../../Table/EntityTable";
import ItemForm from "../ItemForm";
import ConfirmationDialog from "../../ConfirmationDialog";

interface ItemTableProps {
  items: ItemFrontendEntry[];
  onCreate: (i: ItemFrontendEntry) => Promise<void>;
  onEdit: (i: ItemFrontendEntry) => Promise<void>;
  onDelete: (i: ItemFrontendEntry) => Promise<void>;
  availableCategories: { categoryId: string; categoryName: string }[];
}

const BLANK_ITEM: ItemFrontendEntry = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  categoryName: "",
  itemId: "",
};

const ItemTable: FunctionComponent<ItemTableProps> = ({ items, onCreate, onEdit, onDelete, availableCategories }) => {
  const [formState, setFormState] = useState<ItemFormState>({
    open: false,
    current: BLANK_ITEM,
    title: "",
    isUpdate: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [openDelConf, setOpenDelConf] = useState(false);

  const columns: Column<ItemFrontendEntry>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <Tooltip title={row.name}>
          <Box>{row.name}</Box>
        </Tooltip>
      ),
      sx: { width: "200px", textAlign: "center" },
    },
    {
      id: "category",
      header: "Category",
      cell: (row) => (
        <Tooltip title={row.categoryName}>
          <Box>{row.categoryName}</Box>
        </Tooltip>
      ),
      sx: { width: "200px", textAlign: "center" },
    },
    {
      id: "desc",
      header: "Description",
      cell: (row) => (
        <Tooltip title={row.description}>
          <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "inherit" }}>{row.description}</Box>
        </Tooltip>
      ),
      sx: {
        minWidth: "300px",
        whiteSpace: "nowrap",
        overflowX: "hidden",
      },
    },
    {
      id: "price",
      header: "Price",
      cell: (row) => (
        <Tooltip title={row.price.toString()}>
          <Box>{row.price.toString()}</Box>
        </Tooltip>
      ),
      sx: { width: "200px", textAlign: "center" },
    },
  ];

  const handleOpenCreate = () => {
    setFormState({
      open: true,
      current: BLANK_ITEM,
      title: "Create New Item",
      isUpdate: false,
    });
  };

  const handleOpenEdit = (item: ItemFrontendEntry) => {
    setFormState({
      open: true,
      current: item,
      title: "Edit Item",
      isUpdate: true,
    });
  };

  const handleCloseForm = () => {
    setFormState((s) => ({ ...s, open: false }));
  };

  const handleSave = async (values: ItemFrontendEntry) => {
    setIsSaving(true);
    if (formState.isUpdate) onEdit(values);
    else onCreate(values);
    handleCloseForm();
    setIsSaving(false);
  };

  const handleDelete = (item: ItemFrontendEntry) => {
    setOpenDelConf(_ => {
      setFormState((s) => ({ ...s, current: item }));
      return true;
    });
  };

  return (
    <Box>
      <ConfirmationDialog
        open={openDelConf}
        title="Confirm Deletion"
        content="Are you sure you want to delete this item?"
        onClose={() => setOpenDelConf(false)}
        onConfirm={async () => {
          await onDelete(formState.current);
          setOpenDelConf(false);
        }}
      />
      <ItemForm
        open={formState.open}
        initial={formState.current}
        onClose={handleCloseForm}
        onSave={handleSave}
        saving={isSaving}
        title={formState.title}
        avalilableCategories={availableCategories}
      />
      <PaginatedTable<ItemFrontendEntry>
        rows={items}
        columns={columns}
        title="Items"
        defaultPageSize={20}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default ItemTable;
