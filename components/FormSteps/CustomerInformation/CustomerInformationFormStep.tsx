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

interface CustomerInformationFormStepProps {
  register: UseFormRegister<GenerateReportInput>;
  errors: FieldErrors<GenerateReportInput>;
}

const CustomerInformationFormStep = ({
  register,
  errors,
}: CustomerInformationFormStepProps) => {
  return (
    <Group width={"full"}>
      <SimpleGrid gap={6} columns={{ md: 3 }} alignItems={"top"} width={"full"}>
        <GridItem colSpan={1}>
          <Field
            label="Nama"
            invalid={!!errors.customer?.name}
            errorText={errors.customer?.name?.message}
            required
          >
            <Input
              placeholder="Masukkan nama"
              {...register("customer.name", { required: true })}
            />
          </Field>
        </GridItem>
        <GridItem colSpan={2}>
          <Field
            label="Alamat"
            invalid={!!errors.customer?.address}
            errorText={errors.customer?.address?.message}
            required
          >
            <Textarea
              placeholder="Masukkan alamat"
              {...register("customer.address", { required: true })}
            />
          </Field>
        </GridItem>
        <GridItem colSpan={1}>
          <Field
            label="Email"
            invalid={!!errors.customer?.email}
            errorText={errors.customer?.email?.message}
            required
          >
            <Input
              type="email"
              placeholder="Masukkan email"
              {...register("customer.email", {
                required: "Email tidak boleh kosong",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email tidak valid",
                },
              })}
            />
          </Field>
        </GridItem>
        <GridItem colSpan={1}>
          <Field
            label="No Handphone"
            errorText={errors.customer?.phone?.message}
            invalid={!!errors.customer?.phone}
            required
          >
            <Input
              placeholder="Masukkan nomor telepon"
              {...register("customer.phone", {
                required: "No Handphone tidak boleh kosong",
                pattern: {
                  value: /^((\+62|62)|0)[8]{1}[0-9]{7,11}$/,
                  message: "No Handphone tidak valid, contoh: 081234567890",
                },
              })}
            />
          </Field>
        </GridItem>
      </SimpleGrid>
    </Group>
  );
};

export default CustomerInformationFormStep;
