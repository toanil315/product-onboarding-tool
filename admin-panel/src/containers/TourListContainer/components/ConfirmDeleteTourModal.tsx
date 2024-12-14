import { Button, Modal } from "@/components";
import { openNotification } from "@/contexts/NotificationContext";
import { useModal } from "@/hooks";
import { useDeleteTour } from "@/hooks/useTour";
import { Tour } from "@/types/Tour";

interface Props {
  modal: ReturnType<typeof useModal>;
  tour: Tour;
}

export const ConfirmDeleteTourModal = ({ modal, tour }: Props) => {
  const { mutateAsync, isPending } = useDeleteTour(tour.id);

  const handleDelete = async () => {
    if (!tour.id) return;
    await mutateAsync();
    openNotification({
      type: "success",
      message: "Delete tour success",
    });
    modal.hide();
  };

  return (
    <Modal
      width={500}
      title={null}
      modal={modal}
      closeIcon={null}
      footer={null}
    >
      <h2 className="font-normal">
        Are you sure you want to delete this tour?
      </h2>
      <div className="flex flex-row justify-end gap-4 items-center mt-4">
        <Button className="w-[100px]" _type="secondary" onClick={modal.hide}>
          Cancel
        </Button>
        <Button
          className="w-[100px]"
          loading={isPending}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
