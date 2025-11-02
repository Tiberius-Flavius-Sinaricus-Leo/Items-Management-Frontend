import { useMemo, useState, type FunctionComponent } from "react";
import { Autocomplete, Box, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";

import { useDebouncedValue } from "../../utils/useDebouncedValue";
import UserTable from "../../components/User/UserTable";
import type { UserFrontendEntry, UserResponse } from "../../types/user";
import { useGetAllUsers, useRegisterUser, useEditUser, useDeleteUser } from "../../queries/UserQueries";
import type { Role } from "../../types/role";


const UserManagement: FunctionComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [roleFilter, setRoleFilter] = useState<Role | null>(null);
  const getAllUsers = useGetAllUsers();
  const registerUser = useRegisterUser();
  const editUser = useEditUser();
  const deleteUser = useDeleteUser();
  const isNotRootUser = (user: UserResponse) => user.role !== "ROLE_ROOT";
  const users = (getAllUsers.data ?? []).filter(isNotRootUser);
  const roles: Role[] = ["ROLE_USER", "ROLE_ADMIN"];

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm.trim() && (!roleFilter)) return users;
    else {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      return users
        .filter(i => i.username.toLowerCase().includes(lowercasedTerm) || (i.userEmail?.toLowerCase().includes(lowercasedTerm) ?? false))
        .filter(i => !roleFilter || i.role === roleFilter);
    }
  }, [users, debouncedSearchTerm, roleFilter]);

  const onCreateUser = async (newUser: UserFrontendEntry) => {
    try {
      await registerUser.mutateAsync(newUser);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const onEditUser = async (userToEdit: UserFrontendEntry) => {
    try {
      await editUser.mutateAsync({ email: userToEdit.userEmail, dto: userToEdit });
    } catch (error) {
      console.error("Failed to edit user:", error);
    }
  };

  const onDeleteUser = async (userToDelete: UserFrontendEntry) => {
    try {
      await deleteUser.mutateAsync(userToDelete.userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <TextField
          placeholder="Search"
          label="Search Users"
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
          options={roles}
          value={roleFilter}
          renderOption={({ key, ...props }, option: Role) => (
            <li key={key} {...props}>{option.replace("ROLE_", "")}</li>
          )}
          getOptionLabel={(option) => String(option)}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Role" variant="outlined" size="small" />
          )}
          onChange={(_, value) => {
            setRoleFilter(value);
          }}
          sx={{ mb: 2, width: 300 }}
        />
        <UserTable
          users={filteredUsers.map(u => ({ ...u, password: "" }))}
          onCreate={onCreateUser}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
        />
      </Paper>
    </Box>
  );
};

export default UserManagement;
