import { Field } from "@/components/ui/field";
import { GenerateReportInput } from "@/types/report";
import {
  Box,
  GridItem,
  Group,
  Heading,
  Input,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface ProblemFormStepProps {
  register: UseFormRegister<GenerateReportInput>;
  errors: FieldErrors<GenerateReportInput>;
}

const ProblemFormStep = ({ register, errors }: ProblemFormStepProps) => {
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
        3. Deskripsi Masalah & Resolusi
      </Heading>
      <SimpleGrid gap={6} columns={{ md: 2 }} alignItems={"top"} width={"full"}>
        <GridItem>
          <Field
            label="Masalah"
            invalid={!!errors.problem?.problem}
            errorText={errors.problem?.problem?.message}
          >
            <Textarea
              placeholder="Masukkan masalah"
              {...register("problem.problem", {})}
            />
          </Field>
        </GridItem>
        <GridItem>
          <Field
            label="Resolusi"
            invalid={!!errors.problem?.resolution}
            errorText={errors.problem?.resolution?.message}
          >
            <Textarea
              placeholder="Masukkan resolusi"
              {...register("problem.resolution", {})}
            />
          </Field>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default ProblemFormStep;
