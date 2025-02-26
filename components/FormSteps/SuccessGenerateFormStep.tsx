import { useFormStepStore } from "@/stores/formSteps/stores";
import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ElementType } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";

const SuccessGenerateFormStep = () => {
  const {resetData} = useFormStepStore();
  const router = useRouter();
  return (
    <Box w="full">
      <Box p={20} borderRadius="md" m={"auto"}>
        <Flex
          textAlign="center"
          direction="column"
          alignItems="center"
          justifyContent={"center"}
        >
          <Icon
            as={IoMdCheckmarkCircleOutline}
            color="green.500"
            fontSize="8xl"
            mb={2}
          />
          <Box fontSize="xl" fontWeight="bold">
            Laporan Berhasil Dibuat
          </Box>
          <Box fontSize="lg" color={"gray.500"}>
            Laporan telah berhasil dibuat dan siap untuk diunduh.
          </Box>
          <Flex mt={6}>
            <Button
              onClick={() => {
                resetData()
                router.push("/");
              }}
              variant="outline"
              size="lg"
            >
              <Icon as={IoHomeOutline as ElementType} fontSize="xl" color="black" />
              Kembali ke Beranda
            </Button>
            <Button
              onClick={() => {
                resetData()
              }}
              size="lg"
              ml={4}
            >
              <Icon as={BiPlusCircle as ElementType} fontSize="xl" color="white" />
              Buat Laporan Baru
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default SuccessGenerateFormStep;
