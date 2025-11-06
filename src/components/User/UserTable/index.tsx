import { useCallback, useState, type FunctionComponent } from "react";
import { Box, Tooltip } from "@mui/material";
import dayjs from "dayjs";

import PaginatedTable from "../../Table/PaginatedTable";
import type { UserFrontendEntry, UserFormState } from "../../../types/user";
import type { Column } from "../../Table/EntityTable";
import UserForm from "../UserForm";
import ConfirmationDialog from "../../ConfirmationDialog";
import VerifyCredentialDialog from "../../VerifyCredentialDialog";

interface UserTableProps {
  users: UserFrontendEntry[];
  onCreate: (u: UserFrontendEntry) => Promise<void>;
  onEdit: (u: UserFrontendEntry) => Promise<void>;
  onDelete: (u: UserFrontendEntry) => Promise<void>;
}

const BLANK_USER: UserFrontendEntry = {
  userId: "",
  username: "",
  userEmail: "",
  password: "",
  role: "ROLE_USER",
  lastLoginAt: null,
};

const UserTable: FunctionComponent<UserTableProps> = ({ users, onCreate, onEdit, onDelete }) => {
  const [formState, setFormState] = useState<UserFormState>({
    open: false,
    current: BLANK_USER,
    title: "Create User",
    isUpdate: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [openDelConf, setOpenDelConf] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const [pendingAction, setPendingAction] = useState<{
    type: "edit" | "delete" | "create" | null;
    user: UserFrontendEntry | null;
  }>({
    type: null,
    user: null,
  });

  const convertTimestamp = (timestamp: string | null): string => timestamp ? dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss") : "Never";

  const columns: Column<UserFrontendEntry>[] = [
    {
      id: "username",
      header: "Username",
      cell: (row) => (
        <Tooltip title={row.username}>
          <Box>{row.username}</Box>
        </Tooltip>
      ),
      sx: { width: "150px", textAlign: "center" },
    },
    {
      id: "userEmail",
      header: "User Email",
      cell: (row) => (
        <Tooltip title={row.userEmail}>
          <Box>{row.userEmail}</Box>
        </Tooltip>
      ),
      sx: { width: "150px", textAlign: "center" },
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <Tooltip title={row.role}>
          <Box>{row.role.replace("ROLE_", "")}</Box>
        </Tooltip>
      ),
      sx: { width: "150px", textAlign: "center" },
    },
    {
      id: "lastLoginAt",
      header: "Last Login",
      cell: (row) => (
        <Tooltip title={convertTimestamp(row.lastLoginAt)}>
          <Box>{convertTimestamp(row.lastLoginAt)}</Box>
        </Tooltip>
      ),
      sx: { width: "150px", textAlign: "center" },
    },
  ];

  const handleVerificationSuccess = useCallback(() => {
    setOpenVerifyDialog(false);
    if (pendingAction.type === "create") {
      setFormState({
        open: true,
        current: BLANK_USER,
        title: "Create New User",
        isUpdate: false,
      });
    }
    else if (pendingAction.type === "edit" && pendingAction.user !== null) {
      setFormState({
        open: true,
        current: pendingAction.user,
        title: "Edit User",
        isUpdate: true,
      });
    } 
    else if (pendingAction.type === "delete" && pendingAction.user !== null) {
      const current = pendingAction.user;
      setFormState((s) => ({ ...s, current: current }));
      setOpenDelConf(true);
    }
    setPendingAction({ type: null, user: null });
  }, [pendingAction]);

  const handleOpenCreate = () => {
    setPendingAction({ type: "create", user: null });
    setVerificationResult(null);
    setOpenVerifyDialog(true);
  };

  const handleOpenEdit = (user: UserFrontendEntry) => {
    setPendingAction({ type: "edit", user });
    setVerificationResult(null);
    setOpenVerifyDialog(true);
  };

  const handleCloseForm = () => {
    setFormState((s) => ({ ...s, open: false }));
  };

  const handleSave = async (values: UserFrontendEntry) => {
    setIsSaving(true);
    try {
      if (formState.isUpdate) {
        await onEdit(values);
      } else {
        await onCreate(values);
      }
      handleCloseForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (item: UserFrontendEntry) => {
    setPendingAction({ type: "delete", user: item });
    setVerificationResult(null);
    setOpenVerifyDialog(true);
  };

  const handleCloseVerifyDialog = () => {
    setOpenVerifyDialog(false);
    setPendingAction({ type: null, user: null });
    setVerificationResult(null);
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
      <VerifyCredentialDialog
        open={openVerifyDialog}
        onClose={handleCloseVerifyDialog}
        onSuccess={handleVerificationSuccess}
        verificationResult={verificationResult}
        setVerificationResult={setVerificationResult}
        title="Verify Credentials"
      />
      <UserForm
        open={formState.open}
        initial={formState.current}
        onClose={handleCloseForm}
        onSave={handleSave}
        saving={isSaving}
        title={formState.title}
        isUpdate={formState.isUpdate}
      />
      <PaginatedTable<UserFrontendEntry>
        rows={users}
        columns={columns}
        title="Users"
        defaultPageSize={20}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default UserTable;
