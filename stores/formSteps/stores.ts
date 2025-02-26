
import { GenerateReportInput } from "@/types/report";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultState: GenerateReportInput = {
  customer: {
    name: "",
    address: "",
    email: "",
    phone: "",
  },
  service: {
    date: "",
    type: "",
    duration: 0,
  },
  problem: {
    problem: "",
    resolution: "",
  },
  partsUsed: [],
  signature: "",
};

interface FormStepState {
  step: number;
  completedSteps: Set<number>;
  data: GenerateReportInput;
  isLoaded: boolean;
  setLoading: (loading: boolean) => void;
  setData: (data: Partial<GenerateReportInput>) => void;
  resetData: () => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
}

export const useFormStepStore = create<FormStepState>()(
  persist(
    (set, get) => ({
      step: 0,
      completedSteps: new Set(),
      data: defaultState,
      isLoaded: false,
      setLoading: (loading) => set({ isLoaded: loading }),
      setData: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            ...data,
          },
        })),
      resetData: () => set({ data: defaultState }),
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
      resetStep: () => set({ step: 0 }),
    }),
    {
      name: "service-form-steps",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) state.setLoading(true);
      },
    }
  )
);
