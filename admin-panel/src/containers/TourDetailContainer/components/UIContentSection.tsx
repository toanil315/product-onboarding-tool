import { Select } from "@/components";
import { DescriptionItem, Step } from "@/types/Step";
import { PopoverEditorTrigger } from "./PopoverEditorTrigger";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { ModalEditorTrigger } from "./ModalEditorTrigger";

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
  const form = useForm({
    defaultValues: {
      title: "",
      description: [] as DescriptionItem[],
    },
  });

  useEffect(() => {
    form.reset({
      title: step.title,
      description: step.description || [],
    });
  }, [JSON.stringify(step)]);

  const handlePopoverConfigChange =
    (key: string) => (value: string | number | undefined) => {
      onStepChange({
        ...step,
        [key]: value || null,
      });
    };

  const handlePublishPopoverUI = (
    newStepProps: Pick<Step, "title" | "description">
  ) => {
    onStepChange({
      ...step,
      ...newStepProps,
    });
  };

  return (
    <div className="flex flex-col gap-6">
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
      <FormProvider {...form}>
        {step.stepType !== "modal" ? (
          <PopoverEditorTrigger onPublish={handlePublishPopoverUI} />
        ) : (
          <ModalEditorTrigger onPublish={handlePublishPopoverUI} />
        )}
      </FormProvider>
    </div>
  );
};
