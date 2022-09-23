import { atom } from "recoil";
import type { ColumnFiltersState } from "@tanstack/react-table";

// setContest
export const submissionsListColumnFiltersState = atom<ColumnFiltersState>({
  key: "submissionsListColumnFilters",
  default: [],
});
