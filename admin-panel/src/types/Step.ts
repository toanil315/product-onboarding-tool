export type PopoverType = "tooltip" | "modal" | "driven action";
export type ActionType = "click" | "input";
export type MethodGetElement = "id" | "dom-hierarchy";

export interface DescriptionItem {
  type: "text" | "image" | "link" | "media";
  value: string;
  alt?: string;
  linkText?: string;
  mediaText?: string;
}

export interface Popover {
  title?: string;
  description?: DescriptionItem[];
  detailLink?: string;
  videoUrl?: string;
  stepType: PopoverType;
  action?: ActionType;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  showButtons?: ("next" | "previous" | "close")[];
  disableButtons?: ("next" | "previous" | "close")[];
  nextBtnText?: string;
  prevBtnText?: string;
  doneBtnText?: string;
  showProgress?: boolean;
  progressText?: string;
  popoverClass?: string;
  titleColor?: string;
  descriptionColor?: string;
  fontSize?: number;
  tooltipBgColor?: string;
}

export interface Step extends Popover {
  id: string;
  element: string | null;
  url: string;
  methodToGetElement: MethodGetElement;
  domHierarchyString: string;
}
