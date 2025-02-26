import {
  Box,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GenerateReportInput } from "@/types/report";
import React from "react";

interface PreviewFormStepProps {
  formData: GenerateReportInput;
}

const PreviewFormStep = ({ formData }: PreviewFormStepProps) => {
  return (
    <Box p={6} m="auto" border={"1px solid"} borderColor={"gray.200"} borderRadius={12}>
      <Heading size="xl" mb={4}>
        Preview Laporan
      </Heading>

      <Box borderBottom="1px solid #ccc" mb={4} />

      <VStack justifyContent={"start"} alignItems={"start"} gap={6}>
        <Heading size="lg" fontWeight={"bold"}>
          Informasi Pelanggan
        </Heading>
        <SimpleGrid columns={3} gap={4} width="full">
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Nama:
            </Text>
            <Text>{formData.customer.name}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Alamat:
            </Text>
            <Text>{formData.customer.address}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Email:
            </Text>
            <Text>{formData.customer.email || "-"}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Telepon:
            </Text>
            <Text>{formData.customer.phone}</Text>
          </GridItem>
        </SimpleGrid>

        <Box borderBottom="1px solid #ccc" mb={4} />

        <Heading size="lg" fontWeight={"bold"}>
          Detail Layanan
        </Heading>
        <SimpleGrid columns={3} gap={4} width="full">
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Tanggal:
            </Text>
            <Text>{formData.service.date}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Tipe Layanan:
            </Text>
            <Text>{formData.service.type}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Durasi:
            </Text>
            <Text>{formData.service.duration} hari</Text>
          </GridItem>
        </SimpleGrid>

        <Box borderBottom="1px solid #ccc" my={2} />

        <Heading size="lg" fontWeight={"bold"}>
          Deskripsi Masalah & Resolusi
        </Heading>

        <SimpleGrid columns={2} gap={4} width="full">
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Masalah:
            </Text>
            <Text>{formData.problem.problem || "-"}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={14} fontWeight={"bold"}>
              Solusi:
            </Text>
            <Text>{formData.problem.resolution || "-"}</Text>
          </GridItem>
        </SimpleGrid>

        <GridItem colSpan={2}>
          <Box borderBottom="1px solid #ccc" my={2} />
        </GridItem>

        <Heading size="lg" fontWeight={"bold"}>
          Bagian yang Digunakan
        </Heading>

        {formData.partsUsed && formData.partsUsed.length > 0 ? (
          formData.partsUsed.map((part, index) => (
            <SimpleGrid columns={3} gap={4} width="full" key={index}>
              <GridItem>
                <Text fontSize={14} fontWeight={"bold"}>
                  Nama Part:
                </Text>
                <Text>{part.name}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize={14} fontWeight={"bold"}>
                  Jumlah:
                </Text>
                <Text>{part.quantity}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize={14} fontWeight={"bold"}>
                  Harga:
                </Text>
                <Text>{part.price ? `Rp ${part.price}` : "-"}</Text>
              </GridItem>
            </SimpleGrid>
          ))
        ) : (
          <GridItem colSpan={2}>
            <Text color={"red.500"}>Tidak ada part digunakan</Text>
          </GridItem>
        )}

        <GridItem colSpan={2}>
          <Box borderBottom="1px solid #ccc" my={2} />
        </GridItem>

        <GridItem colSpan={2}>
          <Heading size="lg">Tanda tangan</Heading>
        </GridItem>
        <GridItem colSpan={2} textAlign="center">
          {formData.signature ? (
            <Box border="1px solid #ccc" p={2} borderRadius="md">
              <img src={formData.signature} alt="Tanda Tangan" />
            </Box>
          ) : (
            <Text> Tidak ada tanda tangan</Text>
          )}
        </GridItem>
      </VStack>
    </Box>
  );
};

export default PreviewFormStep;
