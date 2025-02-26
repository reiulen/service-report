"use client";
import { FetchReportsAllQuery } from "@/services/useReportQuery";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import Table from "@/components/ui/Tables/Table";
import TableFooter from "../ui/Tables/TableFooter";
import { InputGroup } from "../ui/input-group";
import { LuSearch } from "react-icons/lu";
import { BiPlusCircle } from "react-icons/bi";
import { debounce } from "lodash";
import Link from "next/link";
import { FaFilePdf } from "react-icons/fa6";

type Pagination = {
  page: number;
  pageSize: number;
};

const ReportList = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
  });
  const { data: reports, isLoading } = FetchReportsAllQuery({
    page: pagination.page,
    limit: pagination.pageSize,
    keyword,
  });

  const columns = [
    { header: "Nama Customer", accessor: "name" },
    { header: "Alamat Customer", accessor: "address" },
    { header: "No Handphone Customer", accessor: "phone" },
    { header: "Tipe Servis", accessor: "service.type" },
    { header: "Dibuat Pada", accessor: "created_at" },
    {
      header: "Aksi",
      accessor: "actions",
      render: (row) => (
        <Button 
        size="xs" 
        colorScheme="red">
          <Icon
            as={FaFilePdf}
            color={"white"}
            mr={2}
            boxSize={4}
          />
          Download PDF
      </Button>
      ),
    },
  ];

  const onChangeKeyword = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(event.target.value);
    },
    300
  );

  return (
    <>
      <Flex justifyContent="space-between" mb={3} alignItems={"center"}>
        <InputGroup maxW={"xs"} flex="1" startElement={<LuSearch />} bg="white">
          <Input placeholder="Cari laporan" onChange={onChangeKeyword} />
        </InputGroup>
        <Button
          as={Link}
          href="/service-report-generator"
          bg="black"
          size="sm"
          borderRadius={8}
          boxShadow="xs"
        >
          <Icon as={BiPlusCircle} color={"white"} />
          Generate Report
        </Button>
      </Flex>
      <Box
        bg="white"
        borderRadius={12}
        border="1px solid"
        borderColor="gray.200"
      >
        <Table
          data={reports?.data ?? []}
          columns={columns}
          isLoading={isLoading}
        />
        <TableFooter
          isLoading={isLoading}
          totalDataShow={reports?.data.length}
          totalData={reports?.meta?.totalData}
          pageSize={pagination.pageSize}
          page={pagination.page}
          onPageChange={(page) => setPagination(page)}
        />
      </Box>
    </>
  );
};

export default ReportList;
