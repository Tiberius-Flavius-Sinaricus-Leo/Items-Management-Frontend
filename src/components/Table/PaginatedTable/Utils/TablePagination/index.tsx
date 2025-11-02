import type { FunctionComponent } from "react";

import { Pagination } from "@mui/material";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  onChange?: (page: number) => unknown;
  disabled?: boolean;
}
const TablePagination: FunctionComponent<TablePaginationProps> = (props) => {
  const valid = props.totalPages && props.totalPages >= 0;
  return valid ? (
    <Pagination
      count={props.totalPages}
      page={props.page}
      onChange={(_, val) => props.onChange?.(val)}
      color="primary"
      disabled={props.disabled}
      siblingCount={4}
      boundaryCount={2}
    />
  ) : (
    <></>
  );
};
export default TablePagination;
