import { Table as ChakraTable, Flex, Skeleton, Text } from "@chakra-ui/react";
import PaginationTable from "./PaginationTable";

type Pagination = {
  page: number;
  pageSize: number;
};

interface TableProps {
  isLoading: boolean;
  totalDataShow: number;
  totalData: number;
  pageSize: number;
  page: number;
  onPageChange: (page: Pagination) => void;
}

const TableFooter: React.FC<TableProps> = ({
  isLoading,
  totalDataShow,
  totalData,
  pageSize,
  page,
  onPageChange,
}) => {
  return (
    <Flex px={6} py={4} justifyContent="space-between" alignItems="center">
      {isLoading ? (
        <>
          <Skeleton height="20px" width="100px" />
          <Skeleton height="20px" width="100px" />
        </>
      ) : (
        <>
          <Text>
            Menampilkan {totalDataShow} dari {totalData ?? 0} data
          </Text>
          <PaginationTable
            totalItems={totalData ?? 0}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Flex>
  );
};

export default TableFooter;
