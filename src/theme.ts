import { createTheme } from "@mui/material";

const IS_DEV = process.env.NODE_ENV === 'development';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#E62442",
    },
    secondary: {
      main: IS_DEV ? "#17cfa4" : "#116F99",
    },
  },
  components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& label.Mui-focused": {
              color: "#42a5f5"
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#42a5f5',
              },
            },
          }
        }
      }
    }
  });

export default appTheme;
