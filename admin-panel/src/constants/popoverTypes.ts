import { ActionIcon, ModalIcon, TooltipIcon } from "@/components";

export const POPOVER_TYPES = {
  tooltip: {
    type: "tooltip",
    Icon: TooltipIcon,
  },
  modal: {
    type: "modal",
    Icon: ModalIcon,
  },
  drivenAction: {
    type: "driven action",
    Icon: ActionIcon,
  },
};
