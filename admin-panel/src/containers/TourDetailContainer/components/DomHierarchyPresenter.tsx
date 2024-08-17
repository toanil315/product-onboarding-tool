import { Button, OverflowMenu } from "@/components";
import Label from "@/components/Commons/Input/Label";
import { MESSAGES_EVENT_ENUM } from "@/constants/event";
import { Step } from "@/types/Step";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

interface DomHierarchyPresenterProps {
  step: Step;
  onStepChange: (
    step: Step | null,
    option?: { highlight: boolean; debounce: boolean }
  ) => void;
  saveChanges: () => void;
  iframeElement: HTMLIFrameElement;
}

export const DomHierarchyPresenter = ({
  step,
  onStepChange,
  iframeElement,
}: DomHierarchyPresenterProps) => {
  const [isShowDomHierarChy, setIsShowDomHierarchy] = useState(false);
  const [selectedDomIndex, setSelectedDomIndex] = useState(-1);

  useEffect(() => {
    if (step.element) {
      setSelectedDomIndex(step.element.split(" > ").length - 1);
    } else {
      setSelectedDomIndex(-1);
    }
  }, [step]);

  const cutDomHierarchy = (index: number) => {
    if (step.element) {
      const elements = step.element.split(" > ");
      const newElements = elements.slice(0, index + 1);
      onStepChange({
        ...step,
        element: newElements.join(" > "),
      });
    }
  };

  const highlightElementInDomHierarChy = (index: number) => {
    if (step.element) {
      const elements = step.element.split(" > ");
      const newElements = elements.slice(0, index + 1);
      setSelectedDomIndex(index);
      iframeElement.contentWindow?.postMessage(
        {
          type: MESSAGES_EVENT_ENUM.HIGHLIGHT_ELEMENT,
          step: { ...step, element: newElements.join(" > ") },
        },
        "*"
      );
    }
  };

  if (!isShowDomHierarChy) {
    return (
      <Button
        _type="secondary"
        disabled={!step.element}
        onClick={() => setIsShowDomHierarchy(true)}
      >
        Show Dom Hierarchy
      </Button>
    );
  }

  return (
    <>
      <div>
        <Label label="Dom Hierarchy:" />
        <ul className="pl-5 list-none">
          {step.element &&
            step.element.split(" > ").map((dom, index) => {
              return (
                <OverflowMenu
                  key={index}
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        label: "Highlight this element",
                        key: "1",
                        onClick: () => highlightElementInDomHierarChy(index),
                      },
                      {
                        label: "Cut dom hierarchy",
                        key: "2",
                        onClick: () => cutDomHierarchy(index),
                      },
                    ],
                  }}
                >
                  <DomHierarchyItem
                    className={`hover:text-gray-700 cursor-pointer ${
                      selectedDomIndex === index ? "text-green-700" : ""
                    }`}
                  >
                    {dom}
                  </DomHierarchyItem>
                </OverflowMenu>
              );
            })}
        </ul>
      </div>
      <Button _type="secondary" onClick={() => setIsShowDomHierarchy(false)}>
        Hide Dom Hierarchy
      </Button>
    </>
  );
};

const DomHierarchyItem = styled.li`
  position: relative;
  padding-left: 15px;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateY(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary_5};
  }

  &:after {
    content: "";
    position: absolute;
    top: 42%;
    left: -8px;
    width: 1px;
    height: 100%;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary_5};
  }

  &:last-child::after {
    display: none;
  }
`;
