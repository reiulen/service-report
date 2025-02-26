import { Box, Button, Group, VStack } from "@chakra-ui/react";
import {
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { IoArrowBack, IoArrowForward, IoSaveSharp } from "react-icons/io5";
import { useFormStepStore } from "@/stores/formSteps/stores";
import CustomerInformationFormStep from "./CustomerInformation/CustomerInformationFormStep";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { debounce } from "lodash";
import { MutationValidateCustomer } from "@/services/useReportQuery";
import { GenerateReportInput } from "@/types/report";
import { useLoadingStore } from "@/stores/loading/store";

const stepInfo = [
  "Customer Information",
  "Service Details",
  "Problem Description & Resolution",
  "Parts Used",
  "Signatures",
];

const FormStep = () => {
  const { step, nextStep, prevStep, setData, isLoaded, data } = useFormStepStore();
  const { setLoading, isLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
    watch,
    setError
  } = useForm<GenerateReportInput>();

  useEffect(() => {
    const debouncedSave = debounce((value: any) => {
      const updatedValues = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== "" && v !== undefined)
      );
      if (Object.keys(updatedValues).length > 0) {
        setData(updatedValues);
      }
    }, 500);

    const subscription: ReturnType<typeof watch> = watch((value: any) => {
      debouncedSave(value);
    });

    return () => {
      subscription?.unsubscribe();
      debouncedSave.cancel();
    };
  }, [watch, setData, errors]);

  const onNextStep = handleSubmit(async () => {
    switch (step) {
      case 0:
        await handleNextStepCustomer();
        break;
      default:
        nextStep();
        break;
    }
  });

  const onSubmit = handleSubmit(() => {
    console.log("submit");
  });

  useEffect(() => {
    reset(data);
  }, [isLoaded, data, reset]);

  const {
    mutate: validateCustomer,
  } = MutationValidateCustomer({
    onError: (error: any) => {
      const errorsData = error.response?.data?.error;
      if (!errorsData) return;

      Object.entries(errorsData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          setError(`customer.${key}` as `customer.${keyof GenerateReportInput["customer"]}`, {
            type: "manual",
            message: messages[0],
          });
        }
      });
      setLoading(false);
    },
    onSuccess: (data) => {
      nextStep();
      setLoading(false);
    }
  });

  const handleNextStepCustomer = async () => {
    const data = watch();
    const { customer } = data;
    const { name, email, phone, address } = customer;

    setLoading(true);

    validateCustomer({
      name,
      email,
      phone,
      address
    });
  }

  return (
    <Box bg="white" borderRadius={12} border="1px solid" borderColor="gray.200">
      <StepsRoot step={step} count={stepInfo.length}>
        <StepsList
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
          px={8}
          py={6}
        >
          {stepInfo.map((title, index) => (
            <StepsItem key={index} index={index} title={title} />
          ))}
        </StepsList>

        <Group px={8}>
          {(() => {
            switch (step) {
              case 0:
                return <CustomerInformationFormStep
                  handleNextStep={onNextStep}
                  register={register}
                  errors={errors}
                />;
            }
          })()}
        </Group>

        <Group p={8} justifyContent="end">
          {
            step > 0 && (
              <StepsPrevTrigger asChild>
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <IoArrowBack />
                  Sebelumnya
                </Button>
              </StepsPrevTrigger>
            )
          }
          <StepsNextTrigger asChild>
            {
              step === stepInfo.length - 1 ? (
                <Button variant="solid" size="sm" onClick={onSubmit}>
                  <IoSaveSharp />
                  Simpan &amp; Selesai
                </Button>
              ) : (
                <Button variant="outline" size="sm" 
                loading={isLoading}
                onClick={() => {
                  if (isLoading) return;
                  onNextStep();
                }}>
                  Selanjutnya
                  <IoArrowForward />
                </Button>
              )
            }
          </StepsNextTrigger>
        </Group>
      </StepsRoot>
    </Box>
  );
};

export default FormStep;
