import { GenerateReportInput } from "@/types/report";
import { Box, GridItem, Heading, SimpleGrid, Image } from "@chakra-ui/react";
import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import SignaturePad from "./SignaturePad";

interface SignatureFormStepProps {
  setValue: UseFormSetValue<GenerateReportInput>;
  errors: FieldErrors<GenerateReportInput>;
}

const SignatureFormStep = ({ setValue, errors }: SignatureFormStepProps) => {
  const [signature, setSignature] = useState<string | null>(null);
  return (
    <Box width={"full"}>
      <Heading
        _after={{
          content: '""',
          display: "block",
          width: "12%",
          height: "2px",
          bg: "black",
        }}
        as="h3"
        size="md"
        mb={6}
      >
        5. Tanda Tangan
      </Heading>
      <Box maxW="3xl" m="auto" p={8}>
        <SignaturePad
          onClear={() => {
        
          }}
          onSave={(result) => {
            setValue("signature", result);
          }}
        />
      </Box>
    </Box>
  );
};

export default SignatureFormStep;
