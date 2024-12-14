import { useTours } from "@/hooks/useTour";
import TourCard from "./TourCard";
import { Tour } from "@/types/Tour";
import { Banner } from "./Banner";
import { useModal } from "@/hooks";
import { Button, Modal, PlusIcon } from "@/components";
import { TourModal } from "./TourModal";

export const ListTour = () => {
  const { data } = useTours();
  const modal = useModal();

  const renderListTour = () => {
    if (!data?.data || !data.data.length)
      return <p className="text-center text-2xl py-10">Tours is empty!</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.data.map((tour: Tour) => {
          return <TourCard tour={tour} key={tour.id} />;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-4 mt-4 h-full">
      <Banner />
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl leading-6 font-normal">Onboarding Tours</h2>
        <Button className="flex items-center" onClick={modal.show}>
          <PlusIcon className="mr-2" fill="white" width={10} height={10} />
          Add Tour
        </Button>
      </div>
      <div className="flex flex-grow flex-col justify-between">
        {renderListTour()}
      </div>
      <Modal modal={modal} footer={null} destroyOnClose title="Add Tour">
        <TourModal modal={modal} />
      </Modal>
    </div>
  );
};
