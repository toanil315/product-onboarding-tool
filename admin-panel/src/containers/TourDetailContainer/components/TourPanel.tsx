import { Accordion, Button, CloseIcon, Input } from "@/components";
import { Step } from "@/types/Step";
import { BaseTour, Tour } from "@/types/Tour";
import { Steps } from "./Steps";
import { PERSONA_OPTIONS } from "@/constants";
import Form from "@/components/Form";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useSaveTour } from "@/hooks/useTour";
import { openNotification } from "@/contexts/NotificationContext";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";

interface TourPanelProps {
  tour: Tour;
  selectStep: (step: Step) => void;
  addStep: () => void;
  iframeElement: HTMLIFrameElement;
}

export const TourPanel = (props: TourPanelProps) => {
  const { tour, iframeElement } = props;
  const steps = tour.steps || [];
  const { mutateAsync, isPending } = useSaveTour();

  const form = useForm<BaseTour>({
    defaultValues: {
      name: "",
      description: "",
      forRole: undefined,
      url: "",
      steps: [],
      isActive: false,
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("this field is required"),
        description: yup.string().required("this field is required"),
        forRole: yup.string().required("this field is required"),
        url: yup.string().required("this field is required"),
        isActive: yup.boolean(),
      })
    ),
  });

  useEffect(() => {
    form.reset(tour);
  }, [tour]);

  const handlePreviewTour = () => {
    iframeElement.contentWindow?.postMessage(
      {
        type: MESSAGES_EVENT_ENUM.PREVIEW_TOUR,
        steps,
      },
      "*"
    );
  };

  const onSubmit = async (value: BaseTour) => {
    await mutateAsync({
      ...tour,
      ...value,
    });
    openNotification({
      message: "Edit Tour Success.",
      type: "success",
    });
  };

  return (
    <div className="h-full py-4 px-2 flex flex-col items-center gap-6 justify-between">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full flex flex-row items-center justify-between">
          <h4 className="w-full">Tour</h4>
        </div>
        <Accordion
          defaultActiveKey={["tour-info"]}
          items={[
            {
              key: "tour-info",
              label: "Tour Information",
              children: (
                <div className="w-full flex flex-col gap-4">
                  <FormProvider {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-4"
                    >
                      <Form.Input
                        name="name"
                        label="Name"
                        placeholder="Enter tour name"
                        required
                      />
                      <Form.Input
                        name="description"
                        label="Description"
                        placeholder="Enter tour description"
                        required
                        type="textarea"
                      />
                      <Form.Select
                        label="Role"
                        name="forRole"
                        options={PERSONA_OPTIONS}
                        required
                        placeholder="Select role"
                      />
                      <Form.Input
                        name="url"
                        label="Website Url"
                        placeholder="Enter website url"
                        required
                      />
                    </form>
                  </FormProvider>
                </div>
              ),
            },
            {
              key: "steps",
              label: "Steps",
              children: <Steps {...props} />,
            },
          ]}
        />
      </div>
      <div className="flex-shrink w-full pt-4 border-t border-r-0 border-l-0 border-b-0 border-solid border-gray-300 flex flex-col gap-4">
        <Button
          _type="secondary"
          className="w-full"
          onClick={handlePreviewTour}
          disabled={steps.length === 0}
        >
          Preview Tour
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          loading={isPending}
          className="w-full"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
