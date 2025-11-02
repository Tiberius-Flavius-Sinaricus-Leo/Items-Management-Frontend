import type { FunctionComponent } from "react";

export interface PaginationDisplayProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
const PaginationDisplay: FunctionComponent<PaginationDisplayProps> = (
  props
) => {
  if (!props.totalItems || props.totalItems < 0) return <></>;

  const pageIndex = props.currentPage - 1;

  const bot = (pageIndex * props.itemsPerPage + 1).toString().padStart(2, "0");
  const top = Math.min(props.totalItems, (pageIndex + 1) * props.itemsPerPage)
    .toString()
    .padStart(2, "0");

  return (
    <>
      Entries {bot}-{top} / {props.totalItems.toString().padStart(2, "0")}
    </>
  );
};
export default PaginationDisplay;