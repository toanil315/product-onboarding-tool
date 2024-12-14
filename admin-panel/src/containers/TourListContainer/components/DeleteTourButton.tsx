import { TrashIcon } from "@/components";
import { ConfirmDeleteTourModal } from "./ConfirmDeleteTourModal";
import { Tour } from "@/types/Tour";
import { useModal } from "@/hooks";

interface Props {
  tour: Tour;
}

export const DeleteTourButton = ({ tour }: Props) => {
  const modal = useModal();

  return (
    <>
      <div
        onClick={modal.show}
        className="p-1 pr-0 flex items-center justify-center rounded-full cursor-pointer"
      >
        <TrashIcon width={18} height={18} />
      </div>
      <ConfirmDeleteTourModal modal={modal} tour={tour} />
    </>
  );
};
