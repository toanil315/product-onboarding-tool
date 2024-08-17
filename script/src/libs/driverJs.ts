import { POPOVER_TYPE_ENUM } from "@/constants/step";
import { PopoverConfig, Step } from "@/entities/Step";
import {
  createBlurOverlayWhenHighlight,
  increaseZIndexWhenHighlighting,
  preventActionIfElementIsTooltip,
  preventDefaultWhenDrivenActionIsHighlighted,
  releaseActionWhenTooltipDeselected,
  removeBlurOverlayWhenHighlight,
  resetScrollTopOfScrollableElement,
  returnOldZIndexAfterHighlighting,
  scrollIfElementIsNotInViewport,
} from "@/handlers/ui-handlers";
import { UiUtils } from "@/utils/ui";
import { driver, Config, Driver } from "driver.js";

export let toolDriverInstance: Driver;
export let webDriverInstance: Driver;

export const BASE_TOUR_CONFIG: Config = {
  showProgress: true,
  progressText: "<span class='bold'>{{current}}</span> of {{total}}",
  popoverClass: "driverjs-theme",
  allowClose: false,
  disableActiveInteraction: false,
  nextBtnText: "Next",
  prevBtnText: "Previous",
  onHighlightStarted: ((element: HTMLElement, step: Step) => {
    if (element) {
      resetScrollTopOfScrollableElement(step.domHierarchyString);
      if (step.popover.stepType === POPOVER_TYPE_ENUM.drivenAction) {
        preventDefaultWhenDrivenActionIsHighlighted(webDriverInstance, step);
      }
      preventActionIfElementIsTooltip(element, step);
      scrollIfElementIsNotInViewport(element, webDriverInstance);
    }
  }) as unknown as Config["onHighlightStarted"],
  onDeselected: ((element: HTMLElement, step: Step) => {
    releaseActionWhenTooltipDeselected(element, step);
    removeBlurOverlayWhenHighlight();
    returnOldZIndexAfterHighlighting(element);
  }) as unknown as Config["onDeselected"],
  onPopoverRender: (popover, { config, state }) => {
    if (!state.activeStep) return;

    if (state.activeElement) {
      createBlurOverlayWhenHighlight(state.activeElement as HTMLElement);
      increaseZIndexWhenHighlighting(state.activeElement as HTMLElement);
    }

    const popoverConfig = state.activeStep as unknown as PopoverConfig;
    const { title, description, wrapper } = popover;

    if (!(popoverConfig.stepType === POPOVER_TYPE_ENUM.modal)) return;

    if (popoverConfig.fontSize) {
      UiUtils.setStyle(description, "fontSize", `${popoverConfig.fontSize}px`);
      UiUtils.setStyle(title, "fontSize", `${popoverConfig.fontSize}px`);
    }

    if (popoverConfig.titleColor) {
      UiUtils.setStyle(title, "color", popoverConfig.titleColor);
    }

    if (popoverConfig.descriptionColor) {
      UiUtils.setStyle(description, "color", popoverConfig.descriptionColor);
    }

    if (popoverConfig.tooltipBgColor) {
      UiUtils.setStyle(
        wrapper,
        "backgroundColor",
        popoverConfig.tooltipBgColor
      );
    }
  },
};

export const initDriverJs = () => {
  toolDriverInstance = driver(BASE_TOUR_CONFIG);
  webDriverInstance = driver(BASE_TOUR_CONFIG);
};
