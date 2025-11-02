import { useState, type FunctionComponent } from "react";
import { Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PaginatedTable from "../../Table/PaginatedTable";
import type { CategoryFrontendEntry, CategoryFormState } from "../../../types/category";
import type { Column } from "../../Table/EntityTable";
import CategoryForm from "../CategoryForm";
import ConfirmationDialog from "../../ConfirmationDialog";

interface CategoryTableProps {
  categories: CategoryFrontendEntry[];
  onCreate: (c: CategoryFrontendEntry) => Promise<void>;
  onEdit: (c: CategoryFrontendEntry) => Promise<void>;
  onDelete: (c: CategoryFrontendEntry) => Promise<void>;
  onRowClick?: (c: CategoryFrontendEntry) => void;
}

const BLANK_CATEGORY: CategoryFrontendEntry = {
  name: "",
  description: "",
  bgColor: "#ffffff",
  categoryId: "",
};

const CategoryTable: FunctionComponent<CategoryTableProps> = ({ categories, onCreate, onEdit, onDelete }) => {
  const [formState, setFormState] = useState<CategoryFormState>({
    open: false,
    current: BLANK_CATEGORY,
    title: "Create Category",
    isUpdate: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [openDelConf, setOpenDelConf] = useState(false);
  const navigate = useNavigate();

  const columns: Column<CategoryFrontendEntry>[] = [
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
      id: "No of Products",
      header: "No of Products",
      cell: (row) => row.itemsCount ?? "N/A",
      sx: { width: "150px", textAlign: "center" },
    },
  ];

  const handleOpenCreate = () => {
    setFormState({
      open: true,
      current: BLANK_CATEGORY,
      title: "Create New Category",
      isUpdate: false,
    });
  };

  const handleOpenEdit = (category: CategoryFrontendEntry) => {
    setFormState({
      open: true,
      current: category,
      title: "Edit Category",
      isUpdate: true,
    });
  };

  const handleCloseForm = () => {
    setFormState((s) => ({ ...s, open: false }));
  };

  const handleSave = async (values: CategoryFrontendEntry) => {
    setIsSaving(true);
    if (formState.isUpdate) onEdit(values);
    else onCreate(values);
    handleCloseForm();
    setIsSaving(false);
  };

  const handleDelete = (category: CategoryFrontendEntry) => {
    setOpenDelConf(_ => {
      setFormState((s) => ({ ...s, current: category }));
      return true;
    });
  };

  const handleRowClick = (category: CategoryFrontendEntry) => {
    navigate("/items?categoryName=" + encodeURIComponent(category.name));
  };

  return (
    <Box>
      <ConfirmationDialog
        open={openDelConf}
        title="Confirm Deletion"
        content="Are you sure you want to delete this category?"
        onClose={() => setOpenDelConf(false)}
        onConfirm={async () => {
          await onDelete(formState.current);
          setOpenDelConf(false);
        }}
      />
      <CategoryForm
        open={formState.open}
        initial={formState.current}
        onClose={handleCloseForm}
        onSave={handleSave}
        saving={isSaving}
        title={formState.title}
      />
      <PaginatedTable<CategoryFrontendEntry>
        rows={categories}
        columns={columns}
        title="Categories"
        defaultPageSize={20}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}

export default CategoryTable;