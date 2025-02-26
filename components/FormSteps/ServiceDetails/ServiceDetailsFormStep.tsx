import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { GenerateReportInput } from "@/types/report";
import {
  Box,
  createListCollection,
  GridItem,
  Group,
  Heading,
  Input,
  InputAddon,
  NumberInputRoot,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  Controller,
} from "react-hook-form";
import { BiCalendar } from "react-icons/bi";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { NumberInputField } from "@/components/ui/number-input";

interface ServiceDetailsFormStepProps {
  control: Control<GenerateReportInput>;
  register: UseFormRegister<GenerateReportInput>;
  errors: FieldErrors<GenerateReportInput>;
}

type ValueServiceType = {
    items: {
        label: string;
        value: string;
    }[]
    value: string[];
}

type ServiceType = {
  items: {
    label: string;
    value: string;
  };
};

const serviceType = createListCollection<ServiceType>({
  items: [
    { label: "Pemeliharaan", value: "pemeliharaan" },
    { label: "Perbaikan", value: "perbaikan" },
    { label: "Instalasi", value: "instalasi" },
    { label: "Inspeksi", value: "inspeksi" },
  ],
});

const ServiceDetailsFormStep = ({
  control,
  register,
  errors,
}: ServiceDetailsFormStepProps) => {
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
        2. Detail Layanan
      </Heading>
      <SimpleGrid gap={6} columns={{ md: 3 }} alignItems={"top"} width={"full"}>
        <GridItem colSpan={1}>
          <Field
            label="Tanggal"
            invalid={!!errors.service?.date}
            errorText={errors.service?.date?.message}
            required
          >
            <InputGroup flex="1" startElement={<BiCalendar />} w={"full"}>
              <Input
                type="date"
                {...register("service.date", {
                  required: "Tanggal harus diisi",
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: "Format tanggal salah",
                  },
                })}
                placeholder="Masukkan tanggal"
              />
            </InputGroup>
          </Field>
        </GridItem>
        <GridItem colSpan={1}>
          <Controller
            name="service.type"
            control={control}
            rules={{ required: "Jenis layanan harus dipilih" }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { error },
            }) => (
              <Field
                label="Jenis Layanan"
                invalid={!!error}
                errorText={error?.message}
                required
              >
                <SelectRoot
                  collection={serviceType}
                  value={[`${value}`]}
                  onValueChange={(value: ValueServiceType) => {
                    onChange(value.value[0]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceType.items.map((item: ServiceType['items']) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>
            )}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Field
            label="Durasi"
            invalid={!!errors.service?.duration}
            errorText={errors.service?.duration?.message}
            required
          >
            <Group attached w={"full"}>
              <NumberInputRoot w={"full"}>
                <NumberInputField
                  {...register("service.duration", {
                    required: "Durasi harus diisi",
                    valueAsNumber: true,
                  })}
                />
              </NumberInputRoot>
              <InputAddon>Hari</InputAddon>
            </Group>
          </Field>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default ServiceDetailsFormStep;
