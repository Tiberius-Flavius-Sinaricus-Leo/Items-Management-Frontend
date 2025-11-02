import { type FunctionComponent } from 'react';
import { Box, Grid } from '@mui/material';

const Explore: FunctionComponent = () => {
  return (
    <Box>
      <Grid 
        container 
        spacing={2} 
        sx={{
          backgroundColor: "#2c3335",
          boxSizing: "border-box",
          height: "calc(100vh - 5rem)",
          padding: "20px" 
        }}
      >
        <Grid 
          size={8}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            color: "#fff",
            display: "flex",
            flex: 0.7,
            flexDirection: "row",
            height: "100%",
            padding: "16px",
            justifyContent: "center",
          }}
        >
        </Grid>
        <Grid 
          size={4}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            color: "#fff",
            display: "flex",
            flex: 0.3,
            flexDirection: "column",
            height: "100%",
            padding: "16px",
          }}
        >
        </Grid>
      </Grid>
    </Box>
  );
}

export default Explore;