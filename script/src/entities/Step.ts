import {
  ACTION_TYPE_ENUM,
  DESCRIPTION_ITEM_TYPE_ENUM,
  METHOD_GET_ELEMENT_ENUM,
  POPOVER_TYPE_ENUM,
} from "@/constants/step";
import { z } from "zod";

export const DescriptionItemSchema = z.object({
  type: z.nativeEnum(DESCRIPTION_ITEM_TYPE_ENUM),
  value: z.string(),
  alt: z.string().optional(),
  linkText: z.string().optional(),
  mediaText: z.string().optional(),
});

export const StepResponseSchema = z
  .object({
    id: z.number().optional(),
    stepType: z.nativeEnum(POPOVER_TYPE_ENUM),
    title: z.string().min(1, { message: "This field is required" }),
    description: z
      .array(DescriptionItemSchema)
      .min(1, { message: "This field is required" }),
    element: z.string().nullable(),
    methodToGetElement: z.nativeEnum(METHOD_GET_ELEMENT_ENUM),
    domHierarchyString: z.string(),
    videoUrl: z.string().optional().nullish(),
    detailLink: z.string().optional().nullish(),
    fontSize: z.number().optional().nullish(),
    titleColor: z.string().optional().nullish(),
    descriptionColor: z.string().optional().nullish(),
    tooltipBgColor: z.string().optional().nullish(),
    action: z.nativeEnum(ACTION_TYPE_ENUM).optional().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.stepType !== POPOVER_TYPE_ENUM.modal && !data.element) {
      ctx.addIssue({
        message: "This field is required",
        code: "custom",
        path: ["element"],
      });
    }
  });

export type StepResponse = z.infer<typeof StepResponseSchema>;

export type PopoverConfig = Omit<
  StepResponse,
  "id" | "methodToGetElement" | "domHierarchyString" | "element"
>;

export type Step = {
  id: number;
  element: string | null;
  domHierarchyString: string;
  methodToGetElement: METHOD_GET_ELEMENT_ENUM;
  popover: PopoverConfig;
};

export type DescriptionItem = z.infer<typeof DescriptionItemSchema>;
