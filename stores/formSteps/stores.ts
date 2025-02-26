
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
  isLoading: boolean;
  isLoadedStorage: boolean;
  setLoading: (loading: boolean) => void;
  setLoadedStorage: (loading: boolean) => void;
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
      isLoading: false,
      isLoadedStorage: false,
      setLoading: (loading) => set({ isLoading: loading }),
      setLoadedStorage: (loading) => set({ isLoadedStorage: loading }),
      setData: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            ...data,
          },
        })),
      resetData: () => set({ data: defaultState, step: 0 }),
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
      resetStep: () => set({ step: 0 }),
    }),
    {
      name: "service-form-steps",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) state.setLoadedStorage(true);
      },
    }
  )
);
