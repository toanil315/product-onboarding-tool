import { POPOVER_TYPE_ENUM } from "@/constants/step";
import { PopoverConfig, Step, StepResponse } from "@/entities/Step";
import { BASE_TOUR_CONFIG, toolDriverInstance } from "@/libs/driverJs";
import { closeButtonTemplate } from "@/templates/close-button";
import { modalTemplate } from "@/templates/modal";
import { tooltipDocumentTemplate } from "@/templates/tooltip-document";
import { UiUtils } from "@/utils/ui";
import {
  preventActionIfElementIsTooltip,
  preventDefaultWhenDrivenActionIsHighlighted,
  releaseActionWhenTooltipDeselected,
  removeBlurOverlayWhenHighlight,
  resetScrollTopOfScrollableElement,
  returnOldZIndexAfterHighlighting,
  scrollIfElementIsNotInViewport,
} from "./ui-handlers";
import { Config, State } from "driver.js";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";

export const buildPopoverContent = (popoverConfig: PopoverConfig) => {
  if (popoverConfig.stepType !== POPOVER_TYPE_ENUM.modal) {
    const hasMoreInfo = popoverConfig.detailLink || popoverConfig.videoUrl;
    return {
      ...popoverConfig,
      title: popoverConfig.title + closeButtonTemplate,
      description: hasMoreInfo
        ? popoverConfig.description +
          tooltipDocumentTemplate(
            popoverConfig.detailLink || "",
            popoverConfig.videoUrl || ""
          )
        : popoverConfig.description,
    };
  }

  return {
    ...popoverConfig,
    popoverClass: "introduction-linked-site",
    description: modalTemplate(popoverConfig),
  };
};

export const updateStyleOfTooltip = (step: Step) => {
  const popoverConfig = step.popover;
  const popoverElement = document.querySelector(
    ".driver-popover"
  ) as HTMLElement;
  const popoverDescription = document.querySelector(
    ".driver-popover > .driver-popover-description"
  ) as HTMLElement;
  const popoverTitle = document.querySelector(
    ".driver-popover > .driver-popover-title"
  ) as HTMLElement;

  if (popoverConfig.fontSize) {
    popoverDescription &&
      UiUtils.setStyle(
        popoverDescription,
        "fontSize",
        `${popoverConfig.fontSize}px`
      );
    popoverTitle &&
      UiUtils.setStyle(popoverTitle, "fontSize", `${popoverConfig.fontSize}px`);
  }

  if (popoverConfig.titleColor) {
    popoverTitle &&
      UiUtils.setStyle(popoverTitle, "color", popoverConfig.titleColor);
  }

  if (popoverConfig.descriptionColor) {
    popoverDescription &&
      UiUtils.setStyle(
        popoverDescription,
        "color",
        popoverConfig.descriptionColor
      );
  }

  if (popoverConfig.tooltipBgColor) {
    popoverElement &&
      UiUtils.setStyle(
        popoverElement,
        "backgroundColor",
        popoverConfig.tooltipBgColor
      );
  }
};

export const updateContentOfTooltip = (step: Step) => {
  const popoverDescription = document.querySelector(
    ".driver-popover > .driver-popover-description"
  );
  const popoverTitle = document.querySelector(
    ".driver-popover > .driver-popover-title"
  );
  const popoverConfig = step.popover;

  if (popoverTitle) {
    popoverTitle.innerHTML = popoverConfig.title;
  }

  if (popoverDescription) {
    popoverDescription.innerHTML =
      popoverConfig.detailLink || popoverConfig.videoUrl
        ? popoverConfig.description +
          tooltipDocumentTemplate(
            popoverConfig.detailLink || "",
            popoverConfig.videoUrl || ""
          )
        : popoverConfig.description;
  }
};

export const updateContentOfModal = (step: Step) => {
  const modalTitle = document.querySelector(
    ".introduction-linked-site .introduction-title"
  );
  const modalDescription = document.querySelector(
    ".introduction-linked-site .introduction-subtitle"
  );
  const modalVideoContainer = document.querySelector(
    ".introduction-linked-site .introduction-video-container iframe"
  ) as HTMLIFrameElement;
  const popoverConfig = step.popover;

  if (modalTitle) modalTitle.innerHTML = popoverConfig.title;
  if (modalDescription) modalDescription.innerHTML = popoverConfig.description;

  if (modalVideoContainer.src !== popoverConfig.videoUrl) {
    modalVideoContainer.src = popoverConfig.videoUrl as string;
  }
};

export const updateContentOfPopover = (step: Step) => {
  if (step.popover.stepType !== POPOVER_TYPE_ENUM.modal) {
    updateContentOfTooltip(step);
    updateStyleOfTooltip(step);
    return;
  }
  return updateContentOfModal(step);
};

export const convertFromDtoToDriverJsStep = (step: StepResponse): Step => {
  const { element, domHierarchyString, methodToGetElement, ...restStep } = step;
  return {
    id: Date.now(),
    element,
    domHierarchyString,
    methodToGetElement,
    popover: restStep,
  };
};

export const highlightELement = (event: MessageEvent) => {
  const step = convertFromDtoToDriverJsStep(event.data.step);
  const { element, popover } = step;
  let shouldShowPopover =
    popover.stepType === POPOVER_TYPE_ENUM.modal ? true : Boolean(element);
  const activeStep = toolDriverInstance.getActiveStep();

  if (activeStep && activeStep.element === element) {
    return updateContentOfPopover(step);
  }

  if (shouldShowPopover) {
    setTimeout(() => {
      return toolDriverInstance.highlight({
        element: element || undefined,
        popover: buildPopoverContent(popover),
      });
    }, 100);
  }

  return toolDriverInstance.destroy();
};

export const buildFullTour = (steps: StepResponse[]) => {
  return [
    ...steps.map((s) => {
      const step = convertFromDtoToDriverJsStep(s);
      return {
        ...step,
        popover: buildPopoverContent(step.popover),
      };
    }),
  ];
};

export const previewTour = (event: MessageEvent) => {
  toolDriverInstance.setConfig({
    ...BASE_TOUR_CONFIG,
    steps: buildFullTour(event.data.steps) as any,
    onHighlightStarted: ((_: HTMLElement, step: Step) => {
      resetScrollTopOfScrollableElement(step.domHierarchyString);
      if (step.popover.stepType === POPOVER_TYPE_ENUM.drivenAction) {
        preventDefaultWhenDrivenActionIsHighlighted(toolDriverInstance, step);
      }
    }) as unknown as Config["onHighlightStarted"],
    onHighlighted: ((
      element: HTMLElement,
      step: Step,
      options: {
        config: Config;
        state: State;
      }
    ) => {
      const { state } = options;
      window.parent.postMessage(
        {
          type: MESSAGES_EVENT_ENUM.CURRENT_STEP_INDEX,
          stepIndex: state.activeIndex,
        },
        "*"
      );
      scrollIfElementIsNotInViewport(element, toolDriverInstance);
      preventActionIfElementIsTooltip(element, step);
    }) as unknown as Config["onHighlighted"],
    onDeselected: ((element: HTMLElement, step: Step) => {
      window.parent.postMessage(
        {
          type: MESSAGES_EVENT_ENUM.CURRENT_STEP_INDEX,
          stepIndex: -1,
        },
        "*"
      );
      releaseActionWhenTooltipDeselected(element, step);
      removeBlurOverlayWhenHighlight();
      returnOldZIndexAfterHighlighting(element);
    }) as unknown as Config["onDeselected"],
  });
  toolDriverInstance.drive();
};
