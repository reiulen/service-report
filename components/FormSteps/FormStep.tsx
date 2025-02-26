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
import ServiceDetailsFormStep from "./ServiceDetails/ServiceDetailsFormStep";
import ProblemFormStep from "./Problem/ProblemFormStep";
import PartUsedFormStep from "./PartsUsed/PartUsedFormStep";
import SignatureFormStep from "./Signatures/SiganatureFormStep";
import PreviewFormStep from "./Previews/Preview";

const stepInfo = [
  "Customer Information",
  "Service Details",
  "Problem Description & Resolution",
  "Parts Used",
  "Signatures",
  "Preview",
];

const FormStep = () => {
  const { step, nextStep, prevStep, setData, isLoaded, data } =
    useFormStepStore();
  const { setLoading, isLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
    setError,
    control,
  } = useForm<GenerateReportInput>({
    defaultValues: {
      partsUsed: [
        { 
          name: "",
          quantity: 0, 
          price: 0
        }
      ],
    },
  });

  useEffect(() => {
    const debouncedSave = debounce((value: any) => {
      console.log(value);
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
      case 4:
        handleNextStepSignature();
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
    reset({
      ...data,
      service: {
        ...data?.service,
        type:
          (data?.service?.type as unknown as { value: string })?.value ?? "",
      },
    });
  }, [isLoaded, data, reset]);

  const { mutate: validateCustomer } = MutationValidateCustomer({
    onError: (error: any) => {
      const errorsData = error.response?.data?.error;
      if (!errorsData) return;

      Object.entries(errorsData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          setError(
            `customer.${key}` as `customer.${keyof GenerateReportInput["customer"]}`,
            {
              type: "manual",
              message: messages[0],
            }
          );
        }
      });
      setLoading(false);
    },
    onSuccess: (data) => {
      nextStep();
      setLoading(false);
    },
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
      address,
    });
  };

  const handleNextStepSignature = () => {
    if (!data?.signature) {
      setError("signature", {
        type: "manual",
        message: "Tanda tangan tidak boleh kosong",
      });
      return;
    }
    nextStep();
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
                return (
                  <CustomerInformationFormStep
                    register={register}
                    errors={errors}
                  />
                );
              case 1:
                return (
                  <ServiceDetailsFormStep
                    control={control}
                    register={register}
                    errors={errors}
                  />
                );
              case 2:
                return <ProblemFormStep register={register} errors={errors} />;
              case 3:
                return (
                  <PartUsedFormStep
                    control={control}
                    register={register}
                    errors={errors}
                  />
                );
              case 4:
                return <SignatureFormStep setValue={setValue} errors={errors} />;
              case 5:
                return <PreviewFormStep formData={data} />;
              default:
                return <VStack>Step {step} not found</VStack>;
            }
          })()}
        </Group>

        <Group p={8} justifyContent="end">
          {step > 0 && (
            <StepsPrevTrigger asChild>
              <Button variant="outline" size="sm" onClick={prevStep}>
                <IoArrowBack />
                Sebelumnya
              </Button>
            </StepsPrevTrigger>
          )}
          <StepsNextTrigger asChild>
            {step === stepInfo.length - 1 ? (
              <Button variant="solid" size="sm" onClick={onSubmit}>
                <IoSaveSharp />
                Simpan &amp; Selesai
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                loading={isLoading}
                onClick={() => {
                  if (isLoading) return;
                  onNextStep();
                }}
              >
                Selanjutnya
                <IoArrowForward />
              </Button>
            )}
          </StepsNextTrigger>
        </Group>
      </StepsRoot>
    </Box>
  );
};

export default FormStep;
