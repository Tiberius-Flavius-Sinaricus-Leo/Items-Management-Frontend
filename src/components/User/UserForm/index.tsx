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

import type { UserFrontendEntry } from "../../../types/user";
import useAuthStore from "../../../store/AuthStore";

interface UserFormProps {
  open: boolean;
  initial: UserFrontendEntry;
  onClose: () => void;
  onSave: (values: UserFrontendEntry) => Promise<void> | void;
  saving?: boolean;
  title: string;
  isUpdate: boolean;
}

const UserForm: FunctionComponent<UserFormProps> = ({
  open,
  initial,
  onClose,
  onSave,
  saving = false,
  title,
  isUpdate,
}: UserFormProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = useState<UserFrontendEntry>(initial);
  const [touched, setTouched] = useState({
    username: false,
    userEmail: false,
    password: false,
  });

  const { role } = useAuthStore();

  const validate = {
    username: (v: string) => (v.trim() === "" ? "Username is required" : ""),
    userEmail: (v: string) => {
      if (v.trim() === "") return "Email cannot be empty";
      if (!/\S+@\S+\.\S+/.test(v)) return "Invalid email address";
      return "";
    },
    password: (v: string) => {
      if (v.trim() === "") return "Password cannot be empty";
      if (v.length < 6) return "Password must be at least 6 characters";
      return "";
    },
  };

  useEffect(() => {
    if (open) {
      setValues(initial);
      setTouched({
        username: false,
        userEmail: false,
        password: false,
      });
    }
  }, [open, initial]);

  const dirty =
    values.username !== initial.username ||
    (values.password ?? "") !== (initial.password ?? "") ||
    values.userEmail !== initial.userEmail ||
    (values.role ?? "") !== (initial.role ?? "");

  const UserRoleMenuItems = [
    /** Disable this option if the zustand state could not return a valid role
     *  Otherwise, both ROLE_ADMIN and ROLE_ROOT could assign ROLE_USER
     */
    <MenuItem key="USER" value="ROLE_USER" disabled={!role || (
      role !== "ROLE_ADMIN" && role !== "ROLE_ROOT"
    )}>User</MenuItem>,
    // Only allow ROLE_ROOT to assign ROLE_ADMIN
    <MenuItem key="ADMIN" value="ROLE_ADMIN" disabled={role !== "ROLE_ROOT"}>Admin</MenuItem>,
  ];

  const handleSave = async () => {
    await onSave({
      userId: values.userId,
      username: values.username.trim(),
      password: (values.password ?? "").trim(),
      userEmail: values.userEmail.trim(),
      role: values.role,
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
          <TextField
            label="Username"
            value={values.username}
            onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, username: true }))}
            error={!isUpdate && touched.username && !!validate.username(values.username)}
            helperText={!isUpdate && touched.username ? validate.username(values.username) : ""}
          />
          <TextField
            label="User Email"
            value={values.userEmail ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, userEmail: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, userEmail: true }))}
            error={!isUpdate && touched.userEmail && !!validate.userEmail(values.userEmail)}
            helperText={!isUpdate && touched.userEmail ? validate.userEmail(values.userEmail) : ""}
          />
          <TextField
            label="Password"
            type="password"
            value={values.password ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={!isUpdate && touched.password && !!validate.password(values.password)}
            helperText={!isUpdate && touched.password ? validate.password(values.password) : ""}
          />
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="userrole-selection-label">Role</InputLabel>
            <Select
              labelId="userrole-selection-label"
              id="userrole-selection"
              value={values.role}
              onChange={(e) => setValues((v) => ({ ...v, role: e.target.value }))}
              label="Role"
            >
              {UserRoleMenuItems}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;


