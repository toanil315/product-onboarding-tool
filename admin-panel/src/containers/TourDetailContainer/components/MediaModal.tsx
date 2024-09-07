import { Modal } from "@/components";
import Form from "@/components/Form";
import { ACTION_ENUM } from "@/constants";
import { useModal } from "@/hooks";
import { useEffect } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

interface MediaModalTriggerProps {
  children: React.ReactNode;
  mode: ACTION_ENUM;
  index?: number;
  onSubmit?: (data: { type: string; value: string; mediaText: string }) => void;
}

interface MediaModalProps extends Omit<MediaModalTriggerProps, "children"> {
  modal: ReturnType<typeof useModal>;
}

const MediaModalTrigger = ({
  children,
  mode = ACTION_ENUM.CREATE,
  index,
  onSubmit,
}: MediaModalTriggerProps) => {
  const mediaModal = useModal();

  return (
    <>
      <div onClick={mediaModal.show}>{children}</div>
      <MediaModal
        modal={mediaModal}
        mode={mode}
        index={index}
        onSubmit={onSubmit}
      />
    </>
  );
};

const MediaModal = ({ modal, mode, index, onSubmit }: MediaModalProps) => {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name: "description",
  });

  const mediaForm = useForm({
    defaultValues: {
      value: "",
      mediaText: "",
    },
  });

  const handleSubmit = (data: { value: string; mediaText: string }) => {
    onSubmit &&
      onSubmit({
        type: "media",
        ...data,
      });
    modal.hide();
  };

  useEffect(() => {
    if (mode === ACTION_ENUM.UPDATE && index && fields[index]) {
      const { value, mediaText } = fields[index!] as any;
      mediaForm.reset({ value, mediaText });
    }
  }, [fields, mode, index]);

  return (
    <Modal
      title="Media Modal"
      modal={modal}
      onOk={mediaForm.handleSubmit(handleSubmit)}
    >
      <FormProvider {...mediaForm}>
        <div className="flex flex-col gap-4">
          <Form.Input
            title="Media source"
            placeholder="Enter media url"
            name={"value"}
            required
          />
          <Form.Input
            title="Media text"
            placeholder="Enter media text"
            name={"mediaText"}
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default MediaModalTrigger;
