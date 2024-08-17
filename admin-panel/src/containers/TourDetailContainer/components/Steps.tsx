import {
  ActionIcon,
  Button,
  ModalIcon,
  OpenDoorIcon,
  PencilIcon,
  PlusIcon,
  TooltipIcon,
  TrashIcon,
} from "@/components";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";
import { PopoverType, Step } from "@/types/Step";
import { Tour } from "@/types/Tour";
import { Badge, Tooltip } from "antd";
import { useEffect, useState } from "react";

interface StepsProps {
  tour: Tour;
  selectStep: (step: Step) => void;
  addStep: () => void;
  iframeElement: HTMLIFrameElement;
}

export const Steps = ({
  iframeElement,
  tour,
  selectStep,
  addStep,
}: StepsProps) => {
  const steps = tour.steps || [];
  const [currentActiveStepIndex, setCurrentActiveStepIndex] = useState(-1);

  useEffect(() => {
    const handleActiveIndexChange = (e: MessageEvent<any>) => {
      if (e.data.type === MESSAGES_EVENT_ENUM.CURRENT_STEP_INDEX) {
        setCurrentActiveStepIndex(e.data.stepIndex);
      }
    };

    window.addEventListener("message", handleActiveIndexChange);

    return () => {
      window.removeEventListener("message", handleActiveIndexChange);
    };
  }, []);

  const handlePreviewStep = (step: Step) => {
    iframeElement.contentWindow?.postMessage(
      {
        type: MESSAGES_EVENT_ENUM.HIGHLIGHT_ELEMENT,
        step,
      },
      "*"
    );
  };

  const renderStepIcon = (type: PopoverType) => {
    switch (type) {
      case "tooltip": {
        return <TooltipIcon width={20} height={20} fill="white" />;
      }
      case "modal": {
        return <ModalIcon width={20} height={20} fill="white" />;
      }
      case "driven action": {
        return <ActionIcon width={20} height={20} fill="white" />;
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-10">
        {steps.map((step, index) => {
          const isTitleExceeding = (step.title?.length || 0) > 20;

          return (
            <div className="flex flex-row items-center gap-2" key={step.id}>
              <div
                onClick={() => handlePreviewStep(step)}
                className="flex flex-row items-center gap-2 cursor-pointer"
              >
                <Badge
                  count={
                    step.methodToGetElement === "dom-hierarchy" ? "!" : null
                  }
                  offset={[-2, 5]}
                  showZero
                  color="#faad14"
                >
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                      currentActiveStepIndex === index
                        ? "bg-green-700"
                        : "bg-green-600"
                    }`}
                  >
                    {index !== 0 && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1.5px] h-10 bg-gray-100" />
                    )}
                    {renderStepIcon(step.stepType)}
                  </div>
                </Badge>
                <Tooltip
                  placement="bottom"
                  title={isTitleExceeding ? step.title : null}
                >
                  <div className="flex flex-col gap-[2px]">
                    <p
                      className={`text-sm ${
                        currentActiveStepIndex === index
                          ? "text-green-700 font-bold "
                          : "text-gray-700 font-semibold "
                      }`}
                    >
                      Step {index + 1}
                    </p>

                    <span
                      className={`text-xs ${
                        currentActiveStepIndex === index
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {isTitleExceeding
                        ? step.title?.slice(0, 20) + "..."
                        : step.title || ""}
                    </span>
                  </div>
                </Tooltip>
              </div>
              <div className="flex items-center flex-1 justify-end gap-2">
                <Tooltip title="Edit Tour">
                  <PencilIcon
                    onClick={() => selectStep(step)}
                    className="cursor-pointer"
                    width={20}
                    height={20}
                  />
                </Tooltip>
                <Tooltip title="Delete Tour (Not Available)">
                  <TrashIcon
                    className="cursor-pointer"
                    width={20}
                    height={20}
                  />
                </Tooltip>
              </div>
            </div>
          );
        })}
        <Button className="w-[max-content]" onClick={addStep}>
          <PlusIcon className="mr-2" fill="white" width={10} height={10} />
          Add Step
        </Button>
      </div>
    </div>
  );
};
