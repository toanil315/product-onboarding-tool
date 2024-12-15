import { Step } from "./Step.model";

export interface Tour {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  url: string;
  status: string;
  pathNamePattern: string;
}
