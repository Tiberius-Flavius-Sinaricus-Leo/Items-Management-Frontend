import { useEffect, useMemo, useState, type FunctionComponent } from "react";
import { Autocomplete, Box, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import {useSearchParams} from "react-router-dom";

import { useDebouncedValue } from "../../utils/useDebouncedValue";
import { useGetAllCategories } from "../../queries/CategoryQueries";
import { useAddItem, useDeleteItem, useGetAllItems, useUpdateItem } from "../../queries/ItemQueries";
import { toast } from "react-toastify";
import type { ItemFrontendEntry } from "../../types/item";
import ItemTable from "../../components/Item/ItemTable";

const ItemManagement: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const initialCategoryName = searchParams.get("categoryName") ?? "";
  const [categoryFilter, setCategoryFilter] = useState<{ categoryId: string; name: string } | null>(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const getAllCategories = useGetAllCategories();
  const getAllItems = useGetAllItems();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const categories = getAllCategories.data ?? [];
  const items = getAllItems.data ?? [];

  useEffect(() => {
    if (initialCategoryName && categories.length > 0) {
      const matchedCategory = categories.find(c => c.name === initialCategoryName);
      if (matchedCategory) setCategoryFilter(matchedCategory);
    }
  }, [initialCategoryName, categories]);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim() && (!categoryFilter || categoryFilter.categoryId === "")) return items;
    else {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      return items
        .filter(i => i.name.toLowerCase().includes(lowercasedTerm) || (i.description?.toLowerCase().includes(lowercasedTerm) ?? false))
        .filter(i => !categoryFilter || i.categoryId === categoryFilter.categoryId);
      }
  }, [items, debouncedSearchTerm, categoryFilter]);

  const onCreateItem = async (newItem: ItemFrontendEntry) => {
    try {
      await addItem.mutateAsync(newItem);
      toast.success("Item created successfully");
    } catch (e) {
      toast.error("Failed to create item. Error: " + (e as Error).message);
    }
  };

  const onDeleteItem = async (itemToDelete: ItemFrontendEntry) => {
    try {
      await deleteItem.mutateAsync(itemToDelete.itemId);
      toast.success("Item deleted successfully");
    } catch (e) {
      toast.error("Failed to delete item. Error: " + (e as Error).message);
    }
  };

  const onEditItem = async (updatedItem: ItemFrontendEntry) => {
    try {
      await updateItem.mutateAsync({ id: updatedItem.itemId, dto: updatedItem });
      toast.success("Item updated successfully");
    } catch (e) {
      toast.error("Failed to update item. Error: " + (e as Error).message);
    }
  };

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
          overflow: 'auto',
        }}
      >
        <Autocomplete
          options={categories}
          value={categoryFilter}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Category" variant="outlined" size="small" />
          )}
          onChange={(_, value) => {
            setCategoryFilter(value);
          }}
          sx={{ mb: 2, width: 300 }}
        />
        <ItemTable
          items={filteredItems}
          onCreate={onCreateItem}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          availableCategories={categories.map(c => ({ categoryId: c.categoryId, categoryName: c.name }))}
        />
      </Paper>
    </Box>
  );
}

export default ItemManagement;