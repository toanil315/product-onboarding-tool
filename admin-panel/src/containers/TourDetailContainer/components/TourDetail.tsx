import { useSaveTour, useTour } from "@/hooks/useTour";
import { useEffect, useRef, useState } from "react";
import { Tour } from "@/types/Tour";
import { Step } from "@/types/Step";
import { TourPanel } from "./TourPanel";
import { StepDetailPanel } from "./StepDetailPanel";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";

export const TourDetail = () => {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [isSettingUpFinished, setIsSettingUpFinished] = useState(false);
  const iframeElementRef = useRef<HTMLIFrameElement | null>(null);
  const { data } = useTour();
  const { mutateAsync } = useSaveTour();
  const tour = data?.data as Tour;
  const debounceHighlightElementRef = useRef<NodeJS.Timeout | null>(null);
  const credentialsRef = useRef<Record<string, any> | null>(null);

  const saveChanges = async () => {
    if (selectedStep) {
      const stepIndex = tour.steps?.findIndex(
        (step) => step.id === selectedStep.id
      );
      if (stepIndex === -1) {
        tour.steps?.push(selectedStep);
      } else {
        tour.steps = tour.steps?.map((prevStep: Step) => {
          if (prevStep.id === selectedStep.id) {
            return selectedStep;
          }

          return prevStep;
        });
      }

      await mutateAsync(tour);
    }
    iframeElementRef.current?.contentWindow?.postMessage(
      { type: MESSAGES_EVENT_ENUM.END_GETTING_ELEMENT },
      "*"
    );
    iframeElementRef.current?.contentWindow?.postMessage(
      { type: MESSAGES_EVENT_ENUM.CLEAN_UP },
      "*"
    );
    setSelectedStep(null);
  };

  const handleAddStep = async () => {
    iframeElementRef.current?.contentWindow?.postMessage(
      { type: MESSAGES_EVENT_ENUM.CLEAN_UP },
      "*"
    );
    const newStep = {
      id: String(Date.now()),
      element: null,
      url: "",
      title: "",
      description: [],
      stepType: "tooltip",
      methodToGetElement: "dom-hierarchy",
      domHierarchyString: "",
    } as Step;
    setSelectedStep(newStep);
  };

  const debounceHighlightElement = (step: Step) => {
    if (debounceHighlightElementRef.current) {
      clearTimeout(debounceHighlightElementRef.current);
    }
    debounceHighlightElementRef.current = setTimeout(() => {
      iframeElementRef.current?.contentWindow?.postMessage(
        {
          type: MESSAGES_EVENT_ENUM.HIGHLIGHT_ELEMENT,
          step,
        },
        "*"
      );
    }, 300);
  };

  const handleStepChange = (
    step: Step | null,
    option = { highlight: true, debounce: false }
  ) => {
    setSelectedStep(step);
    if (step && option.highlight) {
      const fullFilledStep = {
        ...step,
        title: step.title || "Popover Title",
        description: step.description || [],
      };
      if (!option.debounce) {
        return iframeElementRef.current?.contentWindow?.postMessage(
          {
            type: MESSAGES_EVENT_ENUM.HIGHLIGHT_ELEMENT,
            step: fullFilledStep,
          },
          "*"
        );
      }

      return debounceHighlightElement(fullFilledStep);
    } else {
      iframeElementRef.current?.contentWindow?.postMessage(
        {
          type: MESSAGES_EVENT_ENUM.CLEAN_UP,
        },
        "*"
      );
    }
  };

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.data.type === MESSAGES_EVENT_ENUM.ON_LOADED) {
        iframeElementRef.current?.contentWindow?.postMessage(
          {
            type: MESSAGES_EVENT_ENUM.HANDSHAKE,
            parentUrl: window.location.origin,
          },
          "*"
        );
        if (credentialsRef.current) {
          iframeElementRef.current?.contentWindow?.postMessage(
            {
              type: MESSAGES_EVENT_ENUM.CREDENTIALS_FROM_EDITOR,
              credentials: credentialsRef.current,
            },
            "*"
          );
          credentialsRef.current = null;
        }
      }
      if (e.data.type === MESSAGES_EVENT_ENUM.READY_FOR_TOURING) {
        setIsSettingUpFinished(true);
      }
      if (e.data.type === MESSAGES_EVENT_ENUM.CREDENTIALS_FROM_POPUP) {
        credentialsRef.current = e.data.credentials;
      }
    });
  }, []);

  useEffect(() => {
    if (tour?.url) {
      const url = new URL(tour.url);
      url.searchParams.append("tour_editor_action", "GET_CREDENTIALS_ACTION");

      window.open(
        url.toString(),
        "cognitoWindowIfAny",
        "location,toolbar,resizable,scrollbars,status,width=600,height=600"
      );
    }
  }, [tour]);

  const renderPanel = () => {
    if (!selectedStep && tour) {
      return (
        <TourPanel
          tour={tour}
          selectStep={setSelectedStep}
          iframeElement={iframeElementRef.current!}
          addStep={handleAddStep}
        />
      );
    }

    if (selectedStep) {
      return (
        <StepDetailPanel
          step={selectedStep}
          onStepChange={handleStepChange}
          saveChanges={saveChanges}
          iframeElement={iframeElementRef.current!}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-row">
      <div className="flex-grow h-screen relative">
        {!isSettingUpFinished && (
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-80 flex justify-center items-center">
            We are setting up the tour creator. Please wait...
          </div>
        )}
        {tour ? (
          <iframe
            className="w-full h-full"
            src={tour.url}
            ref={iframeElementRef}
          />
        ) : (
          <div className="w-full h-full"></div>
        )}
      </div>
      <div className="w-[300px] h-screen overflow-y-auto">{renderPanel()}</div>
    </div>
  );
};
