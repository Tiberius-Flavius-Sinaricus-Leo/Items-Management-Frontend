import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Box, Card, Grid, IconButton, LinearProgress, Tooltip, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import { PaginationBar } from "./Utils";
import EntityTable, { type EntityTableProps, type Column } from "../EntityTable";

export interface PaginatedTableProps<
  T extends Record<string, any> = Record<string, any>
> {
  rows: T[];
  columns: Column<T>[];
  title?: ReactNode;
  defaultPageSize?: number;
  loading?: boolean;
  highlight?: boolean;
  needsElevation?: boolean;
  getRowId?: EntityTableProps<T>["getRowId"];
  onEdit?: (row: T) => void;
  onCreate?: () => void;
  onDelete?: (row: T) => void;
  onRowClick?: (row: T) => void;
}

function PaginatedTable<T extends Record<string, any>>({
  rows,
  columns,
  title,
  defaultPageSize = 20,
  loading = false,
  highlight,
  needsElevation = false,
  getRowId,
  onCreate,
  onEdit,
  onDelete,
  onRowClick,
}: PaginatedTableProps<T>) {
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [page, setPage] = useState<number>(1);

  columns = useMemo(() => {
    const newColumns = [...columns];
    if (onEdit || onDelete) {
      newColumns.push({
        id: "actions",
        header: "Actions",
        sx: { width: "150px", textAlign: "center" },
        cell: (row: T) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {onEdit && (
              <Tooltip title="Edit this entry">
                <IconButton onClick={() => onEdit(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete this entry">
                <IconButton onClick={() => onDelete(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      });
    }
    return newColumns;
  }, [columns, onEdit, onDelete]);

  useEffect(() => {
    setPageSize(defaultPageSize);
    setPage(1);
  }, [defaultPageSize]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageRows = useMemo(() => rows.slice(start, end), [rows, start, end]);

  const handlePageChange = useCallback((next: number) => setPage(next), []);

  const Container = ({ children }: { children: ReactNode }) => needsElevation ? (
    <Card square elevation={1} sx={{ m: 0, p: 0, "*": { boxSizing: "border-box" }, pb: 2 }}>{children}</Card>
  ) : (
    <div>{children}</div>
  );

  return (
    <Container>
      {loading ? <LinearProgress sx={{ mt: 0, mb: 2 }} /> : <Box sx={{ height: 4, mb: 2 }} />}

      {title ? (
        <Grid container sx={{ px: 1, pb: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" component="div">{title}</Typography>
          </Grid>
        </Grid>
      ) : null}

      <PaginationBar
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        disabled={loading}
        onCreate={onCreate}
      />

      <Box sx={{ p: 1 }}>
        <EntityTable
          rows={pageRows}
          columns={columns}
          highlight={highlight}
          getRowId={getRowId}
          onRowClick={onRowClick}
        />
      </Box>

      <PaginationBar
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        disabled={loading}
      />
    </Container>
  );
}

export default PaginatedTable;
