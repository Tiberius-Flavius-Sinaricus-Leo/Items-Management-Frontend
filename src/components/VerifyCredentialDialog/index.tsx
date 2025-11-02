import { useEffect, useState, type FunctionComponent } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";

import type { AuthRequest } from "../../types/login";
import useAuthStore from "../../store/AuthStore";

interface VerifyCredentialDialogProps {
  open: boolean;
  title?: string;
  verificationResult: boolean | null;
  setVerificationResult: (result: boolean | null) => void;
  onClose: () => void;
  onSuccess: () => void;
}

const VerifyCredentialDialog: FunctionComponent<VerifyCredentialDialogProps> = ({ open, title, onClose, onSuccess, verificationResult, setVerificationResult }) => {

  const { isAuthenticated, userEmail, verifyCredentials } = useAuthStore();
  const [account, setAccount] = useState<AuthRequest>({ userEmail: "", password: "" });
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  // Reset form when dialog opens and user is authenticated
  useEffect(() => {
    if (open && isAuthenticated && userEmail) {
      setAccount({ userEmail, password: "" });
      setVerificationResult(null);
    }
  }, [open, isAuthenticated, userEmail, setVerificationResult]);

  if (!isAuthenticated || !userEmail) {
    return null; 
  }

  const validLoginData = account.userEmail.trim().length > 0 && account.password.trim().length > 0;

  const handleVerify = async () => {
    setAuthenticating(true);
    if (validLoginData) {
      verifyCredentials(account)
        .then((resp) => {
          setVerificationResult(resp);
        })
        .catch((err) => {
          console.error("Credential verification failed:", err);
          setVerificationResult(false);
        })
        .finally(() => {
          setAuthenticating(false);
        });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && validLoginData && !authenticating) {
      event.preventDefault();
      handleVerify();
    }
  };

  useEffect(() => {
    if (verificationResult === true) {
      onSuccess();
      setVerificationResult(null);
    }
  }, [verificationResult, onSuccess, setVerificationResult]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title ?? "Verify Credentials"}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Please enter your password to verify your identity for {userEmail}
        </DialogContentText>
        <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }} direction={"column"}>
          <TextField
            required
            id="verification-password-input"
            label="Password"
            type="password"
            className="form-outline"
            placeholder='Enter your password'
            value={account.password}
            error={verificationResult === false}
            helperText={verificationResult === false ? "Invalid password" : ""}
            onChange={(e) => setAccount({ ...account, password: e.target.value })}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disabled={!validLoginData || authenticating}
          onClick={handleVerify}
        >
          {authenticating ? "Verifying..." : "Authenticate"}
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VerifyCredentialDialog;