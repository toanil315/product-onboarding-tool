import { Step } from './Step.model';

export interface Tour {
  id: string;
  name: string;
  description: string;
  forRole: string;
  steps: Step[];
  url: string;
  nextTourId?: string;
}
