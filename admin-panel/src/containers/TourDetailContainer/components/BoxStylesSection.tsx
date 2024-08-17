import { ColorPicker, Input } from "@/components";
import { Step } from "@/types/Step";

interface BoxStylesSectionProps {
  step: Step;
  onStepChange: (
    step: Step | null,
    option?: { highlight: boolean; debounce: boolean }
  ) => void;
  saveChanges: () => void;
  iframeElement: HTMLIFrameElement;
}

export const BoxStylesSection = ({
  step,
  onStepChange,
}: BoxStylesSectionProps) => {
  const handlePopoverConfigChange =
    (key: string) => (value: string | number | undefined) => {
      onStepChange(
        {
          ...step,
          [key]: value || "",
        },
        {
          highlight: true,
          debounce: true,
        }
      );
    };

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Text Size (px)"
        placeholder="Enter text size"
        value={step.fontSize || 16}
        type="number"
        onChange={handlePopoverConfigChange("fontSize")}
      />
      <ColorPicker
        label="Title Color"
        value={step.titleColor || "#ffffff"}
        onChange={handlePopoverConfigChange("titleColor")}
        showText
        presets={[
          {
            label: "Default",
            colors: ["#ffffff"],
            defaultOpen: true,
          },
        ]}
      />
      <ColorPicker
        label="Description Color"
        value={step.descriptionColor || "#a6aab5"}
        onChange={handlePopoverConfigChange("descriptionColor")}
        showText
        presets={[
          {
            label: "Default",
            colors: ["#a6aab5"],
            defaultOpen: true,
          },
        ]}
      />
      <ColorPicker
        label="Tooltip Background Color"
        value={step.tooltipBgColor || "#000000"}
        onChange={handlePopoverConfigChange("tooltipBgColor")}
        showText
        presets={[
          {
            label: "Default",
            colors: ["#000000"],
            defaultOpen: true,
          },
        ]}
      />
    </div>
  );
};
