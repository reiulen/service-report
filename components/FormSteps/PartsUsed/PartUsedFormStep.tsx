import { Field } from "@/components/ui/field";
import { NumberInputField } from "@/components/ui/number-input";
import { GenerateReportInput } from "@/types/report";
import {
  Box,
  Button,
  GridItem,
  Group,
  Heading,
  Icon,
  Input,
  NumberInputRoot,
  SimpleGrid,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { BiPlusCircle, BiTrash } from "react-icons/bi";

interface PartUsedFormStepProps {
  control: Control<GenerateReportInput>;
  register: UseFormRegister<GenerateReportInput>;
  errors: FieldErrors<GenerateReportInput>;
}

const PartUsedFormStep = ({
  control,
  register,
  errors,
}: PartUsedFormStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "partsUsed",
  });

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
        4. Bagian yang Digunakan
      </Heading>
      <VStack gap={3}>
        {fields.map((field, index) => (
          <SimpleGrid
            gap={6}
            columns={{ md: 4 }}
            alignItems={"top"}
            width={"full"}
          >
            <GridItem colSpan={1}>
              <Field
                label="Nama"
                invalid={!!errors.partsUsed?.[index]?.name}
                errorText={errors.partsUsed?.[index]?.name?.message}
                required
              >
                <Input
                  placeholder="Masukkan nama"
                  {...register(`partsUsed.${index}.name`, { required: "Nama harus diisi" })}
                />
              </Field>
            </GridItem>
            <GridItem colSpan={1}>
              <Field
                label="Jumlah"
                invalid={!!errors.partsUsed?.[index]?.quantity}
                errorText={errors.partsUsed?.[index]?.quantity?.message}
                required
              >
                <NumberInputRoot w={"full"}>
                  <NumberInputField
                    {...register(`partsUsed.${index}.quantity`, {
                      required: "Jumlah harus diisi",
                      valueAsNumber: true,
                    })}
                  />
                </NumberInputRoot>
              </Field>
            </GridItem>
            <GridItem colSpan={1}>
              <Field
                label="Harga"
                invalid={!!errors.partsUsed?.[index]?.price}
                errorText={errors.partsUsed?.[index]?.price?.message}
                required
              >
                <NumberInputRoot w={"full"}>
                  <NumberInputField
                    {...register(`partsUsed.${index}.price`, {
                      required: "Harga harus diisi",
                      valueAsNumber: true,
                    })}
                  />
                </NumberInputRoot>
              </Field>
            </GridItem>
            <GridItem colSpan={1}>
              <Button
                variant="outline"
                size="sm"
                mt={6}
                onClick={() => {
                  remove(index);
                }}
              >
                <Icon as={BiTrash} color={"red.500"} />
              </Button>
            </GridItem>
          </SimpleGrid>
        ))}
        {fields.length === 0 && (
          <Box width={"full"} textAlign="center">
            <Heading size="md" textAlign="center" color={"red.500"}>
              Ada bagian yang digunakan? Tambahkan disini
            </Heading>
            <Button
              onClick={() => {
                append({ name: "", quantity: 0, price: 0 });
              }}
              variant="outline"
              size="sm"
              mt={4}
            >
              <Icon as={BiPlusCircle} mr={2} />
              Tambah Bagian
            </Button>
          </Box>
        )}
      </VStack>
      {fields.length > 0 && (
        <Button
          onClick={() => {
            append({ name: "", quantity: 0, price: 0 });
          }}
          variant="outline"
          size="sm"
          mt={6}
        >
          <Icon as={BiPlusCircle} mr={2} />
          Tambah Bagian
        </Button>
      )}
    </Box>
  );
};

export default PartUsedFormStep;
