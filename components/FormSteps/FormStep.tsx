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
import { FormStepData } from "@/types/formStep";
import { useEffect } from "react";
import LoadingDialog from "../Loadings/LoadingDialog";
import { debounce } from "lodash";

const stepInfo = [
  "Customer Information",
  "Service Details",
  "Problem Description & Resolution",
  "Parts Used",
  "Signatures",
];

const FormStep = () => {
  const { step, nextStep, prevStep, setData, isLoaded, data } = useFormStepStore();

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormStepData>();

  useEffect(() => {
    const debouncedSave = debounce((value: Partial<FormStepData>) => {
      const updatedValues = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== "" && v !== undefined)
      );
      if (Object.keys(updatedValues).length > 0) {
        setData(updatedValues);
      }
    }, 500);

    const subscription = watch((value) => {
      debouncedSave(value as Partial<FormStepData>);
    });

    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    };
  }, [watch, setData, errors]);

  const onNextStep = handleSubmit(() => {
    nextStep();
  });

  useEffect(() => {
    reset(data);
  }, [isLoaded, data, reset]);

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
                <Button variant="solid" size="sm" onClick={nextStep}>
                  <IoSaveSharp />
                  Simpan &amp; Selesai
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={onNextStep}>
                  Selanjutnya
                  <IoArrowForward />
                </Button>
              )
            }
          </StepsNextTrigger>
        </Group>
      </StepsRoot>
      {
        !isLoaded && <LoadingDialog />
      }
    </Box>
  );
};

export default FormStep;
