import { Box, Button, Group, Icon, VStack } from "@chakra-ui/react";
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
import { ElementType, useEffect } from "react";
import { debounce } from "lodash";
import {
  MutationGenerateReport,
  MutationValidateCustomer,
} from "@/services/useReportQuery";
import { GenerateReportInput } from "@/types/report";
import { useLoadingStore } from "@/stores/loading/store";
import ServiceDetailsFormStep from "./ServiceDetails/ServiceDetailsFormStep";
import ProblemFormStep from "./Problem/ProblemFormStep";
import PartUsedFormStep from "./PartsUsed/PartUsedFormStep";
import SignatureFormStep from "./Signatures/SiganatureFormStep";
import PreviewFormStep from "./Previews/Preview";
import { Toaster, toaster } from "../ui/toaster";
import { useRouter } from "next/navigation";
import SuccessGenerateFormStep from "./SuccessGenerateFormStep";
import LoadingDialog from "../Loadings/LoadingDialog";

const stepInfo = [
  "Customer Information",
  "Service Details",
  "Problem Description & Resolution",
  "Parts Used",
  "Signatures",
  "Preview",
];

const FormStep = () => {
  const router = useRouter();
  const {
    step,
    nextStep,
    prevStep,
    setData,
    data,
    resetData,
    isLoadedStorage: isLoadingFormStep,
  } = useFormStepStore();
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
          price: 0,
        },
      ],
    },
  });

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
      case 4:
        handleNextStepSignature();
        break;
      default:
        nextStep();
        break;
    }
  });

  const { mutate: geenrateReport } = MutationGenerateReport({
    onError: (error: any) => {
      const errorsData = error.response?.data?.error;
      if (!errorsData) return;
      setLoading(false);
    },
    onSuccess: (data) => {
      setLoading(false);
      toaster.create({
        title: "Success",
        description:
          "Data Laporan berhasil disimpan, silahkan cek di daftar laporan",
        type: "success",
        duration: 6000,
      });
      reset();
      nextStep();
    },
  });

  const onSubmit = handleSubmit(() => {
    setLoading(true);
    geenrateReport(data);
  });

  useEffect(() => {
    reset(data);
  }, [isLoading, data, reset]);

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
  };

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
                return (
                  <SignatureFormStep setValue={setValue} errors={errors} />
                );
              case 5:
                return <PreviewFormStep formData={data} />;
              case 6:
                return <SuccessGenerateFormStep />;
              default:
                return <VStack>Step {step} not found</VStack>;
            }
          })()}
        </Group>
        {(step <= stepInfo.length - 1) && (
          <Group p={8} justifyContent="end">
            {step > 0 && (
              <StepsPrevTrigger asChild>
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <Icon as={IoArrowBack as ElementType} />
                  Sebelumnya
                </Button>
              </StepsPrevTrigger>
            )}
            <StepsNextTrigger asChild>
              {step === stepInfo.length - 1 ? (
                <Button
                  variant="solid"
                  size="sm"
                  loading={isLoading}
                  onClick={onSubmit}
                >
                  <Icon as={IoSaveSharp as ElementType} />
                  Simpan Laporan
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
                  <Icon as={IoArrowForward as ElementType} />
                </Button>
              )}
            </StepsNextTrigger>
          </Group>
        )}
      </StepsRoot>
      <Toaster />
      {!isLoadingFormStep && <LoadingDialog />}
    </Box>
  );
};

export default FormStep;
