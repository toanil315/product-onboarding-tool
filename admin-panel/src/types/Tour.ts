import { Step } from "./Step";

export interface BaseTour {
  name: string;
  description: string;
  steps?: Step[];
  url: string;
  nextTourId?: string;
  forRole: string;
  isActive?: boolean;
}

export interface Tour extends BaseTour {
  id: string;
}
