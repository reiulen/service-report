import { Field } from "@/components/ui/field";
import { GenerateReportInput } from "@/types/report";
import {
  GridItem,
  Group,
  Input,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface ProblemFormStepProps {
  register: UseFormRegister<GenerateReportInput>;
  errors: FieldErrors<GenerateReportInput>;
}

const ProblemFormStep = ({
  register,
  errors,
}: ProblemFormStepProps) => {
  return (
    <Group width={"full"}>
      <SimpleGrid gap={6} columns={{ md: 2 }} alignItems={"top"} width={"full"}>
        <GridItem>
          <Field
            label="Masalah"
            invalid={!!errors.problem?.problem}
            errorText={errors.problem?.problem?.message}
          >
            <Textarea
              placeholder="Masukkan masalah"
              {...register("problem.problem", { })}
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
    </Group>
  );
};

export default ProblemFormStep;
