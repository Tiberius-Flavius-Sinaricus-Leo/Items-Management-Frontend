import { type FunctionComponent } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import {
  Delete,
  Edit,
} from "@mui/icons-material";

import type { CategoryFrontendEntry } from "../../../types/category";

interface CategoryCardProps {
  category: CategoryFrontendEntry;
  onEdit: (c: CategoryFrontendEntry) => void;
  onDelete: (c: CategoryFrontendEntry) => void;
  onClick?: () => void;
}

const CARD_DIMENSIONS = {
  width: 300,
  height: 200,
};

const CategoryCard: FunctionComponent<CategoryCardProps> = ({ category, onEdit, onDelete, onClick }) => {
  const theme = useTheme();
  // const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const fg = theme.palette.getContrastText(category.bgColor);
  return (
    <Card
      sx={{
        ...CARD_DIMENSIONS,
        backgroundColor: category.bgColor,
        color: fg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <CardContent 
        sx={{ flexGrow: 1, overflow: "hidden" }}
        onClick={() => onClick && onClick()}
      >
        <Typography variant="h5" component="div" gutterBottom sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}>
          {category.name}
        </Typography>
        <Box sx={{
            maxHeight: 'calc(100% - 32px)',
            overflow: 'hidden',
        }}>
          <Typography variant="body2">
            {category.description || 'No description provided.'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          startIcon={<Edit />}
          onClick={() => onEdit(category)}
          sx={{ color: fg }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<Delete />}
          onClick={() => onDelete(category)}
          sx={{ color: fg }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default CategoryCard;