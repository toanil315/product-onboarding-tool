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

interface ImageModalTriggerProps {
  children: React.ReactNode;
  mode: ACTION_ENUM;
  index?: number;
  onSubmit?: (data: { type: string; value: string; alt: string }) => void;
}

interface ImageModalProps extends Omit<ImageModalTriggerProps, "children"> {
  modal: ReturnType<typeof useModal>;
}

const ImageModalTrigger = ({
  children,
  mode = ACTION_ENUM.CREATE,
  index,
  onSubmit,
}: ImageModalTriggerProps) => {
  const imageModal = useModal();

  return (
    <>
      <div onClick={imageModal.show}>{children}</div>
      <ImageModal
        modal={imageModal}
        mode={mode}
        index={index}
        onSubmit={onSubmit}
      />
    </>
  );
};

const ImageModal = ({ modal, mode, index, onSubmit }: ImageModalProps) => {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name: "description",
  });

  const imageForm = useForm({
    defaultValues: {
      value: "",
      alt: "",
    },
  });

  const handleSubmit = (data: { value: string; alt: string }) => {
    onSubmit &&
      onSubmit({
        type: "image",
        ...data,
      });
    modal.hide();
  };

  useEffect(() => {
    if (mode === ACTION_ENUM.UPDATE && index && fields[index]) {
      const { value, alt } = fields[index!] as any;
      imageForm.reset({ value, alt });
    }
  }, [fields, mode, index]);

  return (
    <Modal
      title="Image Modal"
      modal={modal}
      onOk={imageForm.handleSubmit(handleSubmit)}
    >
      <FormProvider {...imageForm}>
        <div className="flex flex-col gap-4">
          <Form.Input
            title="Image url"
            placeholder="Enter image url"
            name={"value"}
            required
          />
          <Form.Input
            title="Image alt"
            placeholder="Enter image alt"
            name={"alt"}
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default ImageModalTrigger;
