import { type FunctionComponent, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CategoryCard from "../CategoryCard";
import CategoryForm from "../CategoryForm";
import ConfirmationDialog from "../../ConfirmationDialog";
import CreateCategoryCard from "../CreateCategoryCard"; 
import type { CategoryFormState, CategoryFrontendEntry } from "../../../types/category";

const BLANK_CATEGORY: CategoryFrontendEntry = {
  name: "",
  description: "",
  bgColor: "#ffffff",
  categoryId: "",
};

interface CategoryCardListProps {
  categories: CategoryFrontendEntry[];
  onCreate: (c: CategoryFrontendEntry) => Promise<void>;
  onEdit: (c: CategoryFrontendEntry) => Promise<void>;
  onDelete: (c: CategoryFrontendEntry) => Promise<void>;
}

const CategoryCardList: FunctionComponent<CategoryCardListProps> = ({
  categories,
  onCreate,
  onEdit,
  onDelete,
}: CategoryCardListProps) => {
  const [formState, setFormState] = useState<CategoryFormState>({
    open: false,
    current: BLANK_CATEGORY,
    title: "Create Category",
    isUpdate: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [openDelConf, setOpenDelConf] = useState(false);

  const navigate = useNavigate();

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

  return (
    <Box
      sx={{ p: 3 }}
    >
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
      <Typography variant="h6" component="div" sx={{ marginLeft: -2, marginBottom: 4 }}>Categories</Typography>
      <Grid container spacing={3} alignItems="flex-start">
        {categories.map((category) => (
          <Grid key={category.categoryId}>
            <CategoryCard
              category={category}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onClick={() => {
                navigate("/items?categoryName=" + encodeURIComponent(category.name));
              }}
            />
          </Grid>
        ))}

        {/* The final card for creating a new category */}
        <Grid key="create-category-card">
          <CreateCategoryCard onCreate={handleOpenCreate} />
        </Grid>
    </Grid>
    </Box>
  )
};

export default CategoryCardList;
