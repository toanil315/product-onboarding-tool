import { ArrowLeftIcon, Switch } from "@/components";
import { openNotification } from "@/contexts/NotificationContext";
import theme from "@/styles/theme";
import { DeleteTourButton } from "./DeleteTourButton";
import { Tour } from "@/types/Tour";
import { useSaveTour } from "@/hooks/useTour";
import { TOUR_STATUS_ENUM } from "@/constants/tour";
import { Link } from "react-router-dom";

interface Props {
  tour: Tour;
}

const TourCard = ({ tour }: Props) => {
  const { mutateAsync, isPending } = useSaveTour();

  const handleToggleTourStatus = async (isActive: boolean) => {
    console.log(tour.steps);

    if (!tour.steps || tour.steps.length === 0) {
      return openNotification({
        message: `Change tour status failed.`,
        description: "Please add at least one step to publish the tour.",
        type: "error",
      });
    }

    await mutateAsync({
      ...tour,
      status: isActive ? TOUR_STATUS_ENUM.published : TOUR_STATUS_ENUM.draft,
    });
    openNotification({
      message: `Change tour status success.`,
      description: `Tour is now ${isActive ? "published" : "drafted"}!`,
      type: "success",
    });
  };

  return (
    <div
      key={tour.id}
      className="relative rounded-md shadow-lg flex flex-col gap-4 border border-solid border-gray-200"
    >
      <div className="flex items-center gap-4 relative py-6 px-4 bg-gray-50 rounded-md">
        <div>
          <h4 className="font-semibold mb-1">{tour.name}</h4>
        </div>
        <div className="absolute right-2 top-6 rounded-full border border-solid border-gray-400 text-xs px-2 py-1">
          <span className="font-semibold">{tour.steps?.length}</span> steps
        </div>
      </div>
      <div className="px-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm flex gap-2">
            Website Url:{" "}
            <Link className="text-[#1E766E] font-medium" to={tour.url}>
              {tour.url}
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between pb-4 py-2 px-4">
        <Link
          className=" text-[#1E766E] text-sm font-semibold no-underline"
          to={`/${tour.id}`}
        >
          Edit tour{" "}
          <ArrowLeftIcon
            width={10}
            height={10}
            fill={theme.colors.primary_6}
            className="rotate-180"
          />
        </Link>
        <div className="flex flex-row items-center">
          <div className="flex items-center -mr-2 gap-1">
            <span className="text-sm">Published:</span>
            <Switch
              value={tour.status === TOUR_STATUS_ENUM.published}
              onChange={handleToggleTourStatus}
              disabled={isPending}
              className="capitalize gap-0"
            />
          </div>
          <span className="block w-[1px] h-[20px] mx-1 bg-gray-200"></span>
          <DeleteTourButton tour={tour} />
        </div>
      </div>
    </div>
  );
};

export default TourCard;
