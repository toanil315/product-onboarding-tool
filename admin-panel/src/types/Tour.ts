import { TOUR_STATUS_ENUM } from "@/constants/tour";
import { Step } from "./Step";

export interface BaseTour {
  name: string;
  description: string;
  steps?: Step[];
  url: string;
  status?: TOUR_STATUS_ENUM;
  pathNamePattern: string;
}

export interface Tour extends BaseTour {
  id: string;
}
