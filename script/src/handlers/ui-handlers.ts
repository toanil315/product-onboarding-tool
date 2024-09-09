import { PopoverConfig, Step } from "@/entities/Step";
import { DriveStep, Driver, driver } from "driver.js";
import {
  listenKeyDownForDrivenAction,
  listenMouseDownForDrivenAction,
} from "./event-handler";
import { POPOVER_TYPE_ENUM } from "@/constants/step";
import { UiUtils } from "@/utils/ui";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";
import {
  BASE_TOUR_CONFIG,
  toolDriverInstance,
  webDriverInstance,
} from "@/libs/driverJs";
import { modalTemplate } from "@/templates/modal";
import { ExecutionFrequency } from "@/utils/frequency";
import { isInEditor } from "..";

const highlightingElementOldConfigs = {
  pointerEvents: "auto",
  zIndex: "0",
  position: "unset",
};

let highlightBoxConfigs = {
  id: "highlight-box",
  boundingRect: {
    top: -99999,
    left: -99999,
    width: 0,
    height: 0,
  },
  target: null as HTMLElement | null,
};

export const resetScrollTopOfScrollableElement = (
  domHierarchyString: string
) => {
  if (domHierarchyString) {
    const splittedDomHierarchy = domHierarchyString.split(">");
    const domHierarchyLength = splittedDomHierarchy.length;

    let max = 0;
    let scrolledElement: Element | null = null;
    for (let i = 1; i < domHierarchyLength - 1; i++) {
      const element = document.querySelector(
        splittedDomHierarchy.slice(0, i).join(">")
      );
      if (element && max < element.scrollHeight) {
        max = element.scrollHeight;
        scrolledElement = element;
      }
    }

    if (scrolledElement) {
      scrolledElement.scrollTop = 0;
    }
  }
};

export const preventDefaultWhenDrivenActionIsHighlighted = async (
  driverInstance: Driver,
  step: Step
) => {
  const steps = (driverInstance.getConfig().steps || []) as Array<
    DriveStep & { id: number }
  >;
  const currentIndex = steps.findIndex((s) => s.id === step.id);
  const nextStep =
    currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  if (nextStep) {
    await new Promise<void>((resolve) => {
      const findBtnNextInterval = setInterval(() => {
        const btnNext = document.querySelector(
          ".driver-popover-navigation-btns .driver-popover-next-btn"
        );
        if (btnNext) {
          btnNext.classList.add("driver-popover-next-btn-disabled");
          clearInterval(findBtnNextInterval);
          resolve();
        }
      }, 300);
    });
  }

  if (step.popover.action === "click") {
    listenMouseDownForDrivenAction(
      step,
      { ...nextStep, index: currentIndex + 1 } as unknown as Step & {
        index: number;
      },
      driverInstance
    );
  } else {
    listenKeyDownForDrivenAction(step, driverInstance);
  }
};

export const preventActionIfElementIsTooltip = (
  element: HTMLElement,
  step: Step
) => {
  if (!element) return;

  if (step.popover.stepType === POPOVER_TYPE_ENUM.tooltip) {
    highlightingElementOldConfigs.pointerEvents = element.style.pointerEvents;
    element.style.pointerEvents = "none";
  }
};

export const releaseActionWhenTooltipDeselected = (
  element: HTMLElement,
  step: Step
) => {
  if (!element) return;

  if (step.popover.stepType === POPOVER_TYPE_ENUM.tooltip) {
    element.style.pointerEvents = highlightingElementOldConfigs.pointerEvents;
  }
};

export const removeBlurOverlayWhenHighlight = () => {
  const blurOverlay = document.getElementById("driverjs-blur-overlay");
  if (blurOverlay) {
    blurOverlay.remove();
  }
};

export const returnOldZIndexAfterHighlighting = (element: HTMLElement) => {
  if (!element) return;

  element.style.zIndex = String(highlightingElementOldConfigs.zIndex);
  element.style.position = highlightingElementOldConfigs.position;
};

function ifParentElementHasZIndex(element: HTMLElement) {
  if (!element) return false;

  let parentElement = element.parentElement;
  while (parentElement && parentElement !== document.body) {
    const style = window.getComputedStyle(parentElement);
    const zIndex = style.getPropertyValue("z-index");
    if (zIndex) {
      return true;
    }
    parentElement = parentElement.parentElement;
  }

  return false;
}

export const createBlurOverlayWhenHighlight = (element: HTMLElement) => {
  let div = document.createElement("div");

  div.id = "driverjs-blur-overlay";
  div.style.position = "fixed";
  div.style.top = "0";
  div.style.left = "0";
  div.style.width = "100vw";
  div.style.height = "100vh";
  div.style.zIndex = "9000";
  div.style.backdropFilter = "blur(2px)";

  document.body.appendChild(div);

  if (!element || !ifParentElementHasZIndex(element)) {
    document.body.appendChild(div);
  } else {
    element.parentElement!.appendChild(div);
  }
};

export const increaseZIndexWhenHighlighting = (element: HTMLElement) => {
  if (!element) return;

  highlightingElementOldConfigs.zIndex = element.style.zIndex;
  highlightingElementOldConfigs.position = element.style.position;

  if (!element.style.position) {
    element.style.position = "relative";
  }

  element.style.zIndex = "9999";
};

export const scrollIfElementIsNotInViewport = async (
  element: HTMLElement | null,
  driverInstance: Driver
) => {
  if (!element) return;

  const isInViewport = await UiUtils.checkIsInViewport(element);
  if (!isInViewport) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const checkIsElementInViewportInterval = setInterval(async () => {
      const isInViewport = await UiUtils.checkIsInViewport(element);
      if (isInViewport) {
        clearInterval(checkIsElementInViewportInterval);
        driverInstance.refresh();
      }
    }, 200);
  }
};

window.openVideoPopup = (videoUrl: string) => {
  const mainDriverInstance = isInEditor
    ? toolDriverInstance
    : webDriverInstance;
  const oldConfig = mainDriverInstance.getConfig();
  const activeIndex = mainDriverInstance.getActiveIndex();

  const config = {
    element: undefined,
    popover: {
      popoverClass: "introduction-linked-site",
      description: modalTemplate(
        {
          description: [{ type: "iframe", value: videoUrl }],
        } as PopoverConfig,
        {
          allowClose: true,
        }
      ),
    },
  };
  mainDriverInstance.destroy();
  let driverInstance: Driver | null = driver(BASE_TOUR_CONFIG);

  function closeVideoPopup() {
    mainDriverInstance.setConfig(oldConfig);
    mainDriverInstance.drive(activeIndex);

    driverInstance = null;
    window.removeEventListener("close-video-popup", closeVideoPopup);
  }

  window.addEventListener("close-video-popup", closeVideoPopup);

  driverInstance.highlight({
    ...config,
  });
};

window.onCloseVideoPopup = () => {
  window.dispatchEvent(new CustomEvent(MESSAGES_EVENT_ENUM.CLOSE_VIDEO_POPUP));
};

window.onDestroyClick = () => {
  webDriverInstance.destroy();
};

window.onClickSkip = () => {
  webDriverInstance.moveNext();
};

export const preventContextMenu = (e: Event) => {
  e.preventDefault();
};

export const checkPositionIsChanged = ({ top, left }: DOMRect) => {
  return (
    top !== highlightBoxConfigs.boundingRect.top ||
    left !== highlightBoxConfigs.boundingRect.left
  );
};

export const removeElement = (id: string) => {
  var element = document.getElementById(id);
  if (element) {
    element.remove();
  }
};

export const highlightElementWhenHover = (e: MouseEvent) => {
  ExecutionFrequency.throttle(() => {
    const boundingClientRect =
      (e.target as HTMLElement)!.getBoundingClientRect();

    if (checkPositionIsChanged(boundingClientRect)) {
      removeElement(highlightBoxConfigs.id);

      highlightBoxConfigs.boundingRect = boundingClientRect;
      highlightBoxConfigs.target = e.target as HTMLElement;
      const div = document.createElement("div");
      div.id = highlightBoxConfigs.id;
      div.style.position = "fixed";
      div.style.top = `${highlightBoxConfigs.boundingRect.top}px`;
      div.style.left = `${highlightBoxConfigs.boundingRect.left}px`;
      div.style.width = `${highlightBoxConfigs.boundingRect.width}px`;
      div.style.height = `${highlightBoxConfigs.boundingRect.height}px`;
      div.style.border = "2px solid #D00B05";
      div.style.background = "rgba(30, 118, 110, 0.1)";
      div.style.pointerEvents = "none";
      div.style.zIndex = "999999999";
      document.body.appendChild(div);
    }
  })();
};

const getElementFromHighlightBox = (highlightBoxTarget: HTMLElement) => {
  if (highlightBoxTarget.id) {
    return {
      element: `#${highlightBoxTarget.id}`,
      methodToGetElement: "id",
      domHierarchyString: UiUtils.getDomHierarchy(highlightBoxTarget),
    };
  }

  return {
    element: UiUtils.getDomHierarchy(highlightBoxTarget),
    methodToGetElement: "dom-hierarchy",
    domHierarchyString: UiUtils.getDomHierarchy(highlightBoxTarget),
  };
};

export const selectElementToHighlight = (event: MouseEvent) => {
  if (event.button === 2) {
    // right click
    try {
      window.parent.postMessage(
        {
          type: MESSAGES_EVENT_ENUM.SELECT_ELEMENT,
          ...getElementFromHighlightBox(
            highlightBoxConfigs.target as HTMLElement
          ),
        },
        "*"
      );
    } catch (error) {
      console.log("parent.postMessage error", error);
    }
  }
};

export const enableSelectElement = () => {
  const scrollable = document;
  scrollable.body.style.cursor = "grab";
  scrollable.addEventListener("mousedown", selectElementToHighlight);
  scrollable.addEventListener("mouseover", highlightElementWhenHover);
  window.addEventListener("contextmenu", preventContextMenu);
};

export const disableSelectElement = () => {
  const scrollable = document;
  scrollable.body.style.cursor = "default";
  removeElement(highlightBoxConfigs.id);
  scrollable.removeEventListener("mousedown", selectElementToHighlight);
  scrollable.removeEventListener("mouseover", highlightElementWhenHover);
  window.removeEventListener("contextmenu", preventContextMenu);
};
