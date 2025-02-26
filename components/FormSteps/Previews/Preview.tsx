import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { GenerateReportInput } from "@/types/report";
import React from "react";

interface PreviewFormStepProps {
  formData: GenerateReportInput;
}

const PreviewFormStep = ({ formData }: PreviewFormStepProps) => {
  return (
    <Box p={6} m="auto">
      <Heading size="xl" mb={4}>
        Preview Laporan
      </Heading>

      <Box borderBottom="1px solid #ccc" mb={4} />

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <Heading size="lg">Informasi Pelanggan</Heading>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Nama:</Text>
          <Text>{formData.customer.name}</Text>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Alamat:</Text>
          <Text>{formData.customer.address}</Text>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Email:</Text>
          <Text>{formData.customer.email || "-"}</Text>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Telepon:</Text>
          <Text>{formData.customer.phone}</Text>
        </GridItem>

        <GridItem colSpan={2}>
          <Box borderBottom="1px solid #ccc" my={2} />
        </GridItem>

        <GridItem colSpan={2}>
          <Heading size="lg">Detail Layanan</Heading>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Tanggal:</Text>
          <Text>{formData.service.date}</Text>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Tipe Layanan:</Text>
          <Text>{formData.service.type}</Text>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Durasi:</Text>
          <Text>{formData.service.duration} hari</Text>
        </GridItem>

        <GridItem colSpan={2}>
          <Box borderBottom="1px solid #ccc" my={2} />
        </GridItem>

        <GridItem colSpan={2}>
          <Heading size="lg">Deskripsi Masalah & Resolusi</Heading>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Masalah:</Text>
          <Text>{formData.problem.problem || "-"}</Text>
        </GridItem>
        <GridItem>
          <Text fontSize={14} fontWeight={"bold"}>Solusi:</Text>
          <Text>{formData.problem.resolution || "-"}</Text>
        </GridItem>

        <GridItem colSpan={2}>
          <Box borderBottom="1px solid #ccc" my={2} />
        </GridItem>

        <GridItem colSpan={2}>
          <Heading size="lg">Bagian yang Digunakan</Heading>
        </GridItem>
        {formData.partsUsed && formData.partsUsed.length > 0 ? (
          formData.partsUsed.map((part, index) => (
            <React.Fragment key={index}>
              <GridItem>
                <Text fontSize={14} fontWeight={"bold"}>Nama Part:</Text>
                <Text>{part.name}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize={14} fontWeight={"bold"}>Jumlah:</Text>
                <Text>{part.quantity}</Text>
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontSize={14} fontWeight={"bold"}>Harga:</Text>
                <Text>{part.price ? `Rp ${part.price}` : "-"}</Text>
              </GridItem>
            </React.Fragment>
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
      </Grid>
    </Box>
  );
};

export default PreviewFormStep;
