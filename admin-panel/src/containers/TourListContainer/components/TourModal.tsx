import { Button } from "@/components";
import Form from "@/components/Form";
import { TOUR_STATUS_ENUM } from "@/constants/tour";
import { openNotification } from "@/contexts/NotificationContext";
import { useModal } from "@/hooks";
import { useCreateTour } from "@/hooks/useTour";
import { Tour } from "@/types/Tour";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

export const TourModal = ({
  modal,
}: {
  modal: ReturnType<typeof useModal>;
}) => {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      url: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required"),
        url: yup.string().required("Url is required"),
      })
    ),
  });
  const { mutateAsync, isPending } = useCreateTour();

  const onSubmit = async (data: Partial<Tour>) => {
    try {
      await mutateAsync({ ...data, steps: [], status: TOUR_STATUS_ENUM.draft });
      openNotification({
        type: "success",
        message: "Tour added successfully",
        description: "Tour has been added successfully",
      });
      modal.hide();
    } catch (error) {
      openNotification({
        type: "error",
        message: "Failed to add tour",
        description: "Please try again later",
      });
    }
  };

  return (
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
        <Form.Input
          name="url"
          label="Website Url"
          placeholder="Enter website url"
          required
        />
        <Button loading={isPending}>Submit</Button>
      </form>
    </FormProvider>
  );
};
