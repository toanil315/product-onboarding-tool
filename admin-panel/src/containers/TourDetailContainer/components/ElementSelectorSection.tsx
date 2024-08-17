import { Button, Input } from "@/components";
import { Step } from "@/types/Step";
import { useEffect, useState } from "react";
import { DomHierarchyPresenter } from "./DomHierarchyPresenter";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";

interface ElementSelectorSectionProps {
  step: Step;
  onStepChange: (
    step: Step | null,
    option?: { highlight: boolean; debounce: boolean }
  ) => void;
  saveChanges: () => void;
  iframeElement: HTMLIFrameElement;
}

export const ElementSelectorSection = (props: ElementSelectorSectionProps) => {
  const { step, onStepChange, iframeElement } = props;
  const [isGettingElement, setIsGettingElement] = useState(false);

  useEffect(() => {
    return () => {
      iframeElement.contentWindow?.postMessage(
        { type: MESSAGES_EVENT_ENUM.END_GETTING_ELEMENT },
        "*"
      );
      iframeElement.contentWindow?.postMessage(
        { type: MESSAGES_EVENT_ENUM.CLEAN_UP },
        "*"
      );
    };
  }, []);

  useEffect(() => {
    const handleIframeMessages = (e: MessageEvent<any>) => {
      if (e.data.type === MESSAGES_EVENT_ENUM.SELECT_ELEMENT) {
        delete e.data.type;
        onStepChange({
          ...step,
          ...e.data,
        });
        handleCancelChangeElement();
      }
    };

    window.addEventListener("message", handleIframeMessages);
    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, [step]);

  const handleChangeElement = () => {
    setIsGettingElement(true);
    iframeElement.contentWindow?.postMessage(
      { type: MESSAGES_EVENT_ENUM.START_GETTING_ELEMENT },
      "*"
    );
  };

  const handleCancelChangeElement = () => {
    setIsGettingElement(false);
    iframeElement.contentWindow?.postMessage(
      { type: MESSAGES_EVENT_ENUM.END_GETTING_ELEMENT },
      "*"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {step.methodToGetElement === "dom-hierarchy" && (
        <div className="text-xs font-medium p-2 rounded-md bg-yellow-100 leading-5">
          <b>Warning</b>: Getting element by <b>DOM HIERARCHY</b> is not
          recommended for production. It may break if the website structure
          changes. Please request developers to add an id to the element you
          want and then reselect again.
        </div>
      )}
      <Input
        label="Selected Element"
        value={step.element?.split(" > ").at(-1) || "No element selected"}
        readOnly
      />
      {step.methodToGetElement === "dom-hierarchy" && (
        <DomHierarchyPresenter {...props} />
      )}
      {isGettingElement && (
        <div className="text-xs font-medium text-center p-2 rounded-md bg-gray-100 leading-5">
          You are in selecting element mode. Right click on the element you want
          to select
        </div>
      )}
      <Button
        onClick={handleChangeElement}
        _type="secondary"
        className="w-full"
      >
        Select Element
      </Button>
    </div>
  );
};
