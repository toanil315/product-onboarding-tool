import { TOUR_STATUS_ENUM } from "@/constants/tour";
import { Step } from "./Step";

export interface BaseTour {
  name: string;
  description: string;
  steps?: Step[];
  url: string;
  nextTourId?: string;
  forRole: string;
  isActive?: boolean;
  status?: TOUR_STATUS_ENUM;
}

export interface Tour extends BaseTour {
  id: string;
}
