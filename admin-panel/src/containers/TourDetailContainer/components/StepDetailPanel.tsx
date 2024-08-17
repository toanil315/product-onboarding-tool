import { Accordion, Button, Select } from "@/components";
import { POPOVER_TYPES } from "@/constants";
import { Step } from "@/types/Step";
import { ElementSelectorSection } from "./ElementSelectorSection";
import { UIContentSection } from "./UIContentSection";
import { BoxStylesSection } from "./BoxStylesSection";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";

interface StepDetailPanelProps {
  step: Step;
  onStepChange: (
    step: Step | null,
    option?: { highlight: boolean; debounce: boolean }
  ) => void;
  saveChanges: () => void;
  iframeElement: HTMLIFrameElement;
}

export const StepDetailPanel = (props: StepDetailPanelProps) => {
  const { step, onStepChange, saveChanges, iframeElement } = props;

  const handlePreviewElement = () => {
    iframeElement.contentWindow?.postMessage(
      {
        type: MESSAGES_EVENT_ENUM.HIGHLIGHT_ELEMENT,
        step,
      },
      "*"
    );
  };

  const handleCleanUp = () => {
    iframeElement.contentWindow?.postMessage(
      { type: MESSAGES_EVENT_ENUM.CLEAN_UP },
      "*"
    );
  };

  return (
    <div className="py-4 flex flex-col justify-between min-h-screen gap-10">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full px-2 flex flex-col items-center gap-6">
          <h4 className="w-full">Step Detail</h4>
          <Select
            label="UI Pattern"
            name="ui-pattern"
            placeholder="Select UI Pattern"
            options={Object.keys(POPOVER_TYPES).map((key) => {
              const popoverConfig = POPOVER_TYPES[key as "modal"];
              return {
                label: (
                  <div className="flex flex-row items-center gap-3">
                    <popoverConfig.Icon />
                    <span className="capitalize font-medium">
                      {popoverConfig.type}
                    </span>
                  </div>
                ),
                value: popoverConfig.type,
              };
            })}
            value={step.stepType}
            onSelect={(value) => {
              handleCleanUp();
              onStepChange({
                ...step,
                element: value === "modal" ? null : step.element,
                stepType: value as "modal",
              });
            }}
          />
        </div>
        <div className="w-full">
          <Accordion
            defaultActiveKey={["element-selector"]}
            items={[
              ...(step.stepType !== "modal"
                ? [
                    {
                      key: "element-selector",
                      label: "Element Selector",
                      children: <ElementSelectorSection {...props} />,
                    },
                  ]
                : []),
              {
                key: "popover-config",
                label: "UI Content",
                children: <UIContentSection {...props} />,
              },
              ...(step.stepType !== "modal"
                ? [
                    {
                      key: "box-styles",
                      label: "Box Styles",
                      children: <BoxStylesSection {...props} />,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 px-2 mt-4 pt-4 border-t border-r-0 border-l-0 border-b-0 border-solid border-gray-300">
        <Button
          onClick={handlePreviewElement}
          _type="secondary"
          className="w-full"
        >
          Highlight Selected Element
        </Button>
        <Button className="w-full" onClick={saveChanges}>
          Save Changes
        </Button>
        <Button
          onClick={() => onStepChange(null)}
          _type="tertiary"
          className="w-full"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
