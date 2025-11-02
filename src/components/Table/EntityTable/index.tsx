import type { ReactNode } from "react";
import { Box, type SxProps } from "@mui/material";

export type Column<T extends Record<string, any> = Record<string, any>> = {
  id: string;
  header?: ReactNode;
  cell?: (row: T) => ReactNode;
  sx?: SxProps;
}

export interface EntityTableProps<T extends Record<string, any> = Record<string, any>> {
  rows: T[];
  columns: Column<T>[];
  highlight?: boolean;
  getRowId?: (row: T, index: number) => string | number;
  emptyLabel?: ReactNode;
  onRowClick?: (row: T) => void;
}

const EntityTable = <T extends Record<string, any>>({ rows, columns, getRowId, emptyLabel = "No Data", onRowClick }: EntityTableProps<T>) => {
  const cols = columns ?? [];
  const data = rows ?? [];

  return (
    <Box component="table" sx={{ width: 1, tableLayout: "fixed", maxWidth: 1, minWidth: 1 }} cellSpacing={0} cellPadding={0}>
      <Box component="thead">
        <Box component="tr" sx={{ mb: 2 }}>
          {cols.map((col) => (
            <Box
              component="td"
              key={col.id}
              sx={{ textAlign: "left", p: 1, fontWeight: "bold", width: "auto", ...col.sx }}
            >
              {col.header ?? col.id}
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="tbody" sx={{ borderTop: "solid 1px #eee", borderBottom: "solid 1px #eee" }}>
        {data.length === 0 ? (
          <tr>
            <Box component="td" sx={{ color: "text.secondary", textAlign: "center", p: 1, typography: "body2" }} colSpan={cols.length}>
              {emptyLabel}
            </Box>
          </tr>
        ) : (
          data.map((row, i) => {
            const key = getRowId ? getRowId(row, i) : i;
            return (
              <Box
                component="tr"
                key={key}
                sx={{
                  "&:hover": { bgcolor: "#fafafa" },
                  "&:not(:last-child):not(.noborder) td": { borderBottom: "solid 1px #eee" },
                }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {cols.map((col) => (
                  <Box component="td" key={col.id} sx={{ px: 1, py: "10px", ...col.sx }}>
                    {col.cell ? col.cell(row) : (row as Record<string, unknown>)[col.id] as ReactNode}
                  </Box>
                ))}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
export default EntityTable;
