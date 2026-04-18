import { create } from 'zustand';
import { FilterState } from '@/app/types';

interface FilterStore extends FilterState {
  setFilters: (filters: FilterState) => void;
  updateSearchTerm: (searchTerm: string) => void;
  updateSalaryRange: (salaryRange: [number, number]) => void;
  updateWorkSchedule: (workSchedule: string[]) => void;
  updateEmploymentType: (employmentType: string[]) => void;
  updateWorkStyle: (workStyle: string[]) => void;
  resetFilters: () => void;
  toggleWorkSchedule: (option: string) => void;
  toggleEmploymentType: (option: string) => void;
  toggleWorkStyle: (option: string) => void;
}

const initialFilters: FilterState = {
  workSchedule: [],
  salaryRange: [2500, 15000],
  employmentType: [],
  workStyle: [],
  searchTerm: '',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialFilters,

  setFilters: (filters) => set(filters),

  updateSearchTerm: (searchTerm) => set({ searchTerm }),

  updateSalaryRange: (salaryRange) => set({ salaryRange }),

  updateWorkSchedule: (workSchedule) => set({ workSchedule }),

  updateEmploymentType: (employmentType) => set({ employmentType }),

  updateWorkStyle: (workStyle) => set({ workStyle }),

  resetFilters: () => set(initialFilters),

  toggleWorkSchedule: (option) =>
    set((state) => ({
      workSchedule: state.workSchedule.includes(option)
        ? state.workSchedule.filter((item) => item !== option)
        : [...state.workSchedule, option],
    })),

  toggleEmploymentType: (option) =>
    set((state) => ({
      employmentType: state.employmentType.includes(option)
        ? state.employmentType.filter((item) => item !== option)
        : [...state.employmentType, option],
    })),

  toggleWorkStyle: (option) =>
    set((state) => ({
      workStyle: state.workStyle.includes(option)
        ? state.workStyle.filter((item) => item !== option)
        : [...state.workStyle, option],
    })),
}));

// Selector hooks for individual state values (primitives and arrays are memoized by Zustand)
export const useFilterSearchTerm = () => useFilterStore((state) => state.searchTerm);
export const useSalaryRange = () => useFilterStore((state) => state.salaryRange);
export const useWorkSchedule = () => useFilterStore((state) => state.workSchedule);
export const useEmploymentType = () => useFilterStore((state) => state.employmentType);
export const useWorkStyle = () => useFilterStore((state) => state.workStyle);

// Individual action selectors (functions are always stable references)
export const useUpdateSearchTerm = () => useFilterStore((state) => state.updateSearchTerm);
export const useUpdateSalaryRange = () => useFilterStore((state) => state.updateSalaryRange);
export const useToggleWorkSchedule = () => useFilterStore((state) => state.toggleWorkSchedule);
export const useToggleEmploymentType = () => useFilterStore((state) => state.toggleEmploymentType);
export const useToggleWorkStyle = () => useFilterStore((state) => state.toggleWorkStyle);
export const useResetFilters = () => useFilterStore((state) => state.resetFilters);

// Combined action hook - do not use in dependency arrays
export const useFilterActions = () => ({
  updateSearchTerm: useFilterStore((state) => state.updateSearchTerm),
  updateSalaryRange: useFilterStore((state) => state.updateSalaryRange),
  updateWorkSchedule: useFilterStore((state) => state.updateWorkSchedule),
  updateEmploymentType: useFilterStore((state) => state.updateEmploymentType),
  updateWorkStyle: useFilterStore((state) => state.updateWorkStyle),
  toggleWorkSchedule: useFilterStore((state) => state.toggleWorkSchedule),
  toggleEmploymentType: useFilterStore((state) => state.toggleEmploymentType),
  toggleWorkStyle: useFilterStore((state) => state.toggleWorkStyle),
  resetFilters: useFilterStore((state) => state.resetFilters),
});
