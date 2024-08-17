import { Step } from "@/entities/Step";
import { Driver } from "driver.js";

export const listenMouseDownForDrivenAction = (
  currentStep: Step,
  nextStep: Step & { index: number },
  driverInstance: Driver
) => {
  if (!currentStep.element) return;

  const elementInstance = document.querySelector(currentStep.element as string);
  if (!elementInstance) return;

  function moveNextWhenActionIsTriggered() {
    if (nextStep.element) {
      let retryCount = 0;
      const findNextElementInterval = setInterval(() => {
        const nextElementInstance = document.querySelector(
          nextStep.element! as string
        );
        retryCount += 1;
        if (retryCount > 10) {
          clearInterval(findNextElementInterval);
          driverInstance.moveNext();
        }

        if (nextElementInstance) {
          clearInterval(findNextElementInterval);
          driverInstance.moveTo(nextStep.index);
        }
      }, 200);
    } else {
      driverInstance.moveNext();
    }

    elementInstance!.removeEventListener(
      "mousedown",
      moveNextWhenActionIsTriggered
    );
  }

  elementInstance.addEventListener("mousedown", moveNextWhenActionIsTriggered);
};

export const listenKeyDownForDrivenAction = (
  currentStep: Step,
  driverInstance: Driver
) => {
  if (!currentStep.element) return;

  const elementInstance = document.querySelector(currentStep.element);
  if (!elementInstance) return;

  let debounce: number | null = null;

  function moveNextWhenActionIsTriggered() {
    if (debounce) {
      clearTimeout(debounce);
    }
    debounce = setTimeout(() => {
      driverInstance.moveNext();
      elementInstance!.removeEventListener(
        "keydown",
        moveNextWhenActionIsTriggered
      );
    }, 700);
  }

  elementInstance.addEventListener("keydown", moveNextWhenActionIsTriggered);
};
