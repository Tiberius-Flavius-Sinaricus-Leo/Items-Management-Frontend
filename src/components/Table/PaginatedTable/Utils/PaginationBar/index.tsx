import { Grid, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, type FunctionComponent } from "react";
import TablePagination from "../TablePagination";
import PaginationDisplay from "../PaginationDisplay";

interface PaginationBarProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  disabled?: boolean;
  onCreate?: () => void;
}

const PaginationBar: FunctionComponent<PaginationBarProps> = ({ page, total, pageSize, onPageChange, disabled, onCreate }) => {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  return (
    <Grid container sx={{ px: 1, py: 1 }}>
      <Grid size={{ xs: 3 }}>
        {
          onCreate && (
            <Tooltip title="Create A New Entry">
              <IconButton onClick={onCreate} size="small" color="primary" disabled={disabled}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )
        }
      </Grid>
      <Grid size={{ xs: 6 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <TablePagination page={page} onChange={onPageChange} totalPages={totalPages} disabled={disabled} />
      </Grid>
      <Grid
        size={{ xs: 3 }}
        sx={{ px: 1, typography: "body2", color: "text.secondary", height: 1, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}
      >
        <PaginationDisplay currentPage={page} itemsPerPage={pageSize} totalItems={total} />
      </Grid>
    </Grid>
  );
};

export default PaginationBar;