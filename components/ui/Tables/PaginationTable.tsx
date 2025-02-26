import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

type Pagination = {
  page: number;
  pageSize: number;
};

interface PaginationTableProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: Pagination) => void;
}

const PaginationTable: React.FC<PaginationTableProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}) => (
  <PaginationRoot
    count={totalItems}
    pageSize={pageSize}
    defaultPage={currentPage}
    onPageChange={onPageChange}
    variant="solid"
  >
    <HStack>
      <PaginationPrevTrigger />
      <PaginationItems />
      <PaginationNextTrigger />
    </HStack>
  </PaginationRoot>
);

export default PaginationTable;
