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

interface LinkModalTriggerProps {
  children: React.ReactNode;
  mode: ACTION_ENUM;
  index?: number;
  onSubmit?: (data: { type: string; value: string; linkText: string }) => void;
}

interface LinkModalProps extends Omit<LinkModalTriggerProps, "children"> {
  modal: ReturnType<typeof useModal>;
}

const LinkModalTrigger = ({
  children,
  mode = ACTION_ENUM.CREATE,
  index,
  onSubmit,
}: LinkModalTriggerProps) => {
  const linkModal = useModal();

  return (
    <>
      <div onClick={linkModal.show}>{children}</div>
      <LinkModal
        modal={linkModal}
        mode={mode}
        index={index}
        onSubmit={onSubmit}
      />
    </>
  );
};

const LinkModal = ({ modal, mode, index, onSubmit }: LinkModalProps) => {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name: "description",
  });

  const linkForm = useForm({
    defaultValues: {
      value: "",
      linkText: "",
    },
  });

  const handleSubmit = (data: { value: string; linkText: string }) => {
    onSubmit &&
      onSubmit({
        type: "link",
        ...data,
      });
    modal.hide();
  };

  useEffect(() => {
    if (mode === ACTION_ENUM.UPDATE && index && fields[index]) {
      const { value, linkText } = fields[index!] as any;
      linkForm.reset({ value, linkText });
    }
  }, [fields, mode, index]);

  return (
    <Modal
      title="Link Modal"
      modal={modal}
      onOk={linkForm.handleSubmit(handleSubmit)}
    >
      <FormProvider {...linkForm}>
        <div className="flex flex-col gap-4">
          <Form.Input
            title="Link url"
            placeholder="Enter link url"
            name={"value"}
            required
          />
          <Form.Input
            title="Link alt"
            placeholder="Enter link text"
            name={"linkText"}
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default LinkModalTrigger;
