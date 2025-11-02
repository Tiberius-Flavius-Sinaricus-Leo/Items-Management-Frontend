import { type FunctionComponent } from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface CreateCategoryCardProps {
  onCreate: () => void;
}

// Reuse the same dimensions for consistency
const CARD_DIMENSIONS = {
  width: 300,
  height: 200,
};

const CreateCategoryCard: FunctionComponent<CreateCategoryCardProps> = ({
  onCreate,
}) => {
  return (
    <Card
      sx={{
        ...CARD_DIMENSIONS,
        border: "2px dashed",
        borderColor: "divider",
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <CardActionArea
        onClick={onCreate}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AddIcon sx={{ fontSize: 40, color: "text.secondary" }} />
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary">
            Create New Category
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CreateCategoryCard;