import {
  Table as ChakraTable,
  Skeleton,
} from "@chakra-ui/react";

interface TableProps {
  isLoading: boolean;
  data: any[];
  columns: { 
    header: string; 
    accessor: string 
    render?: (row: any) => JSX.Element
  }[];
}

const Table: React.FC<TableProps> = ({ isLoading, data, columns }) => {
  return (
    <ChakraTable.Root variant="outline" w={"full"}>
      <ChakraTable.Header>
        <ChakraTable.Row>
          {columns.map((column) => (
            <ChakraTable.ColumnHeader key={column.accessor} p={4}>
              {column.header}
            </ChakraTable.ColumnHeader>
          ))}
        </ChakraTable.Row>
      </ChakraTable.Header>
      <ChakraTable.Body>
        {
          isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ChakraTable.Row key={index}>
                {columns.map((column) => (
                  <ChakraTable.Cell  key={column.accessor} p={4}>
                    <Skeleton height="20px" />
                  </ChakraTable.Cell >
                ))}
              </ChakraTable.Row>
            ))
          ) : data.length > 0 ? data.map((item, index) => (
            <ChakraTable.Row key={index}>
              {columns.map((column) => (
                <ChakraTable.Cell key={column.accessor} p={4}>
                  {column.render
                      ? column.render(item)
                      : column.accessor
                          .toString()
                          .split(".")
                          .reduce((acc: any, part) => acc?.[part], item)}
                </ChakraTable.Cell>
              ))}
            </ChakraTable.Row>
          )) : (
            <ChakraTable.Row>
              <ChakraTable.Cell colSpan={columns.length} p={4}>
                No data found
              </ChakraTable.Cell>
            </ChakraTable.Row>
          )
        }
      </ChakraTable.Body>
    </ChakraTable.Root>
  );
};

export default Table;
