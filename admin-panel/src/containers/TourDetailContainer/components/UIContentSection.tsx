import { Input, Select } from "@/components";
import { Step } from "@/types/Step";
import { EditPopoverUiTrigger } from "./EditPopoverUiTrigger";

interface UIContentSectionProps {
  step: Step;
  onStepChange: (
    step: Step | null,
    option?: { highlight: boolean; debounce: boolean }
  ) => void;
  saveChanges: () => void;
  iframeElement: HTMLIFrameElement;
}

export const UIContentSection = ({
  step,
  onStepChange,
}: UIContentSectionProps) => {
  const handlePopoverConfigChange =
    (key: string) => (value: string | number | undefined) => {
      onStepChange({
        ...step,
        [key]: value || null,
      });
    };

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Popover Title"
        placeholder="Enter popover title"
        value={step.title}
        onChange={handlePopoverConfigChange("title")}
      />
      <Input
        label="Popover Description"
        type="textarea"
        placeholder="Enter popover description"
        value={step.description}
        onChange={handlePopoverConfigChange("description")}
      />
      {step.stepType !== "modal" && (
        <Input
          label="Detail Link"
          placeholder="Enter popover detail link"
          value={step.detailLink}
          onChange={handlePopoverConfigChange("detailLink")}
        />
      )}
      <Input
        label="Video Link"
        placeholder="Enter popover video link"
        value={step.videoUrl}
        onChange={handlePopoverConfigChange("videoUrl")}
      />
      {step.stepType === "driven action" && (
        <Select
          name="action"
          label="Action"
          placeholder="Select action"
          value={step.action}
          onChange={handlePopoverConfigChange("action")}
          options={[
            { label: "Click", value: "click" },
            { label: "Input", value: "input" },
          ]}
        />
      )}
      <EditPopoverUiTrigger />
    </div>
  );
};
