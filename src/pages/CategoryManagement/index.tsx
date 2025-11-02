import { useMemo, useState, type FunctionComponent } from 'react';
import { Box, IconButton, InputAdornment, Paper, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { toast } from 'react-toastify';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import type { CategoryFrontendEntry } from '../../types/category';
import { useAddCategory, useDeleteCategory, useGetAllCategories, useUpdateCategory } from '../../queries/CategoryQueries';
import { Close, Search } from '@mui/icons-material';
import CategoryCardList from '../../components/Category/CategoryCardList';
import CategoryTable from '../../components/Category/CategoryTable';

const CategoryManagement: FunctionComponent = () => {

  const [viewMode, setViewMode] = useState<"CardList" | "Table">("CardList");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const getAllCategories = useGetAllCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories: CategoryFrontendEntry[] = getAllCategories.data ?? [];

  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return categories;
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(lowercasedTerm) || (c.description?.toLowerCase().includes(lowercasedTerm) ?? false));
  }, [categories, debouncedSearchTerm]);

  const onCreateCategory = async (newCategory: CategoryFrontendEntry) => {
    try {
      await addCategory.mutateAsync(newCategory);
      toast.success("Category created successfully");
    } catch (e) {
      toast.error("Failed to create category. Error: " + (e as Error).message);
    }
  };

  const onDeleteCategory = async (categoryToDelete: CategoryFrontendEntry) => {
    if (categoryToDelete.itemsCount && categoryToDelete.itemsCount > 0) {
      toast.error("Cannot delete category with items.");
      return;
    }
    else {
      try {
        await deleteCategory.mutateAsync(categoryToDelete.categoryId);
        toast.success("Category deleted successfully");
      } catch (e) {
        toast.error("Failed to delete category. Error: " + (e as Error).message);
      }
    }
  };

  const onEditCategory = async (updatedCategory: CategoryFrontendEntry) => {
    try {
      await updateCategory.mutateAsync({ id: updatedCategory.categoryId, dto: updatedCategory });
      toast.success("Category updated successfully");
    } catch (e) {
      toast.error("Failed to update category. Error: " + (e as Error).message);
    }
  };

  const CategoriesView = useMemo(() => (
    <Box>
      {
        viewMode === "CardList" && (
          <CategoryCardList 
            categories={filteredCategories}
            onCreate={onCreateCategory}
            onDelete={onDeleteCategory}
            onEdit={onEditCategory}
          />
        ) || (
          <CategoryTable 
            categories={filteredCategories}
            onCreate={onCreateCategory}
            onDelete={onDeleteCategory}
            onEdit={onEditCategory}
            onRowClick={(c: CategoryFrontendEntry) => {
              window.location.href = "/items?categoryName=" + encodeURIComponent(c.name);
            }}
          />
        )
      }
    </Box>
  ), [filteredCategories, viewMode]);

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <TextField
          placeholder="Search"
          label="Search Categories"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && setSearchTerm('')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><Search /></InputAdornment>
              ),
              endAdornment: !!searchTerm && (
                <InputAdornment position="end">
                  <IconButton aria-label="Clear search" onClick={() => setSearchTerm('')}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'auto',
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newAlignment) => {
            if (newAlignment !== null) {
              setViewMode(newAlignment);
            }
          }}
        >
          <ToggleButton value="CardList">List</ToggleButton>
          <ToggleButton value="Table">Table</ToggleButton>
        </ToggleButtonGroup>
        {CategoriesView}
      </Paper>
    </Box>
  );
}

export default CategoryManagement;