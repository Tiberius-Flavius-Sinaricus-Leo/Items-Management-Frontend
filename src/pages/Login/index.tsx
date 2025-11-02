import { type FunctionComponent, useEffect, useState } from "react";
import { 
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"

import type { AuthRequest } from "../../types/login";
import clsx from "clsx";
import useAuthStore from "../../store/AuthStore";

const EMPTY_ACCOUNT_INFORMATION: AuthRequest = {userEmail:"",password:""};

const AuthenticationComponent: FunctionComponent = () => {

  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [account, setAccount] = useState<AuthRequest>(EMPTY_ACCOUNT_INFORMATION);
  const navigation = useNavigate();
  const validLoginData = account.userEmail.trim().length > 0 && account.password.trim().length > 0;
  const { isAuthenticated, login, userEmail } = useAuthStore();

  useEffect(() => {
    console.log("isAuthenticated changed:", isAuthenticated, userEmail);
    if (isAuthenticated) {
      navigation("/");
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setAuthenticating(true);
    if (validLoginData) {
      login(account)
      .then(resp => {
        if (resp?.data) {
          toast.success("Login successful!");
          navigation("/");
        }
        else if (resp?.error) {
          toast.error("Login failed: " + resp.error);
        }
      })
      .catch(err => {
        toast.error("Login failed: " + err.message);
      })
      .finally(() => {
        setAccount(EMPTY_ACCOUNT_INFORMATION);
        setAuthenticating(false);
      });
    }
  }

  return (
    <Box
      className={clsx(styles['login-form'])}
      component="form"
      onSubmit={handleLogin}
      noValidate
    > 
      <Card 
        className='p-4 flex flex-col gap-4' 
        variant="outlined" 
        sx={{
          maxWidth: 680,
          width: {
            xs: '100%',  // Full width on extra-small screens
            sm: '75%',   // 75% width on small screens and up
            md: '50%',   // 50% width on medium screens and up
            lg: '25%',   // 25% width on large screens and up
          },
          bgcolor: 'background.paper',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h4 style={{ textAlign: 'center' }}>Log In</h4>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          <TextField
            required
            id="signin-email-input"
            label="Email"
            className="form-outline"
            placeholder='Enter your email'
            value={account.userEmail}
            onChange={(e) => setAccount({ ...account, userEmail: e.target.value })}
          />
          <TextField
            required
            id="signin-password-input"
            label="Password"
            type="password"
            className="form-outline"
            placeholder='Enter your password'
            value={account.password}
            onChange={(e) => setAccount({ ...account, password: e.target.value })}
          />
          <FormGroup sx={{ marginBottom: -2 }}>
            <FormControlLabel
              control={<Checkbox name="rememberMe" color="primary" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="Remember me"
            />
          </FormGroup>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={!validLoginData || authenticating}
            sx={{ width: '100%' }}
          >
            Sign In
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default AuthenticationComponent;