import {
  Button,
  ImageIcon,
  MediaIcon,
  PlusIcon,
  Popover,
  TextColorIcon,
} from "@/components";
import { useModal } from "@/hooks";
import { Drawer } from "antd";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import ImageModalTrigger from "./ImageModalTrigger";
import { ACTION_ENUM } from "@/constants";
import MediaModalTrigger from "./MediaModal";
import { Step } from "@/types/Step";

interface Props {
  onPublish: (newStepProps: Pick<Step, "title" | "description">) => void;
}

export const ModalEditorTrigger = ({ onPublish }: Props) => {
  const drawer = useModal();
  const containerRef = useRef<HTMLFormElement | null>(null);
  const form = useFormContext();
  const [previewHeight, setPreviewHeight] = useState<number>(100);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "description",
  });

  const elementPlaceholders = useMemo(() => {
    const baseIconProps = {
      width: 24,
      height: 24,
    };
    const baseTriggerProps = {
      mode: ACTION_ENUM.CREATE,
      index: fields.length,
    };

    return [
      {
        id: "description",
        type: "description",
        icon: <TextColorIcon {...baseIconProps} />,
        handler: () => append({ type: "description", value: "" }),
      },
      {
        id: "image",
        render: () => (
          <ImageModalTrigger
            onSubmit={(data) => append(data)}
            {...baseTriggerProps}
          >
            <div className="flex flex-col gap-2 p-3 items-center hover:shadow-md cursor-pointer">
              <ImageIcon {...baseIconProps} />
              <p className="capitalize font-medium text-gray-500">image</p>
            </div>
          </ImageModalTrigger>
        ),
      },
      {
        id: "media",
        render: () => (
          <MediaModalTrigger
            onSubmit={(data) => append(data)}
            {...baseTriggerProps}
          >
            <div className="flex flex-col gap-2 p-3 items-center hover:shadow-md cursor-pointer">
              <MediaIcon {...baseIconProps} />
              <p className="capitalize font-medium text-gray-500">media</p>
            </div>
          </MediaModalTrigger>
        ),
      },
    ];
  }, [fields, append]);

  const renderElementPlaceholders = () => {
    return elementPlaceholders.map((element) =>
      element.render ? (
        element.render()
      ) : (
        <div
          key={element.id}
          className="flex flex-col gap-2 p-3 items-center hover:shadow-md cursor-pointer"
          onClick={element.handler}
        >
          {element.icon}
          <p className="capitalize font-medium text-gray-500">{element.type}</p>
        </div>
      )
    );
  };

  const renderDescriptionItems = () => {
    return fields.map((item: any, index: number) => {
      switch (item.type) {
        case "description":
          return (
            <Controller
              render={({ field }) => (
                <AutoResizeTextArea
                  value={field.value}
                  onChange={field.onChange}
                  minHeight={36}
                  className="input-without-style introduction-subtitle"
                />
              )}
              name={`description.${index}.value`}
              control={form.control}
            />
          );
        case "image":
          return item.value ? (
            <div className="driver-popover-description-item description-image">
              <img src={item.value} alt={item.alt} />
            </div>
          ) : null;
        case "media":
          return item.value ? (
            <div className="introduction-video-container">
              <iframe
                src={item.value}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null;
        default:
          return null;
      }
    });
  };

  const handlePublish = () => {
    onPublish({
      title: form.getValues("title"),
      description: form.getValues("description"),
    });
    drawer.hide();
  };

  const renderModalUI = (preview = false) => {
    return (
      <div
        ref={(ref) => setPreviewHeight(ref?.scrollHeight || 100)}
        className="introduction-container relative"
        style={{
          pointerEvents: preview ? "none" : "auto",
        }}
      >
        <div className="introduction-content">
          <div className="introduction-acciona-logo">
            <svg width="30" height="30">
              <path
                d="M0,14.52H11.67v11.41l11.67-11.41V3.11H11.67L0,14.52Z"
                fill="#1E766E"
                fill-rule="evenodd"
              ></path>
            </svg>
            walkthrough
          </div>
          <div className="introduction-line"></div>
          <Controller
            render={({ field }) => (
              <AutoResizeTextArea
                value={field.value}
                onChange={field.onChange}
                minHeight={36}
                className="input-without-style introduction-title"
              />
            )}
            name="title"
            control={form.control}
          />
          {renderDescriptionItems()}
        </div>
        {preview ? null : (
          <Popover
            trigger={"click"}
            content={
              <p className="w-[250px] grid grid-cols-2 space-x-2">
                {renderElementPlaceholders()}
              </p>
            }
            placement="bottom"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full h-6 bg-transparent flex justify-center opacity-0 hover:opacity-100">
              <div className=" w-6 h-6 rounded-full bg-black border-white border-solid flex justify-center items-center cursor-pointer">
                <PlusIcon width={10} height={10} fill="white" />
              </div>
            </div>
          </Popover>
        )}
      </div>
    );
  };

  console.log("preview: ", previewHeight);

  return (
    <FormProvider {...form}>
      <div
        className="preview flex flex-row justify-center relative w-full"
        style={{
          height: Number(previewHeight || 0) * 0.4,
        }}
      >
        <div className="absolute left-0 top-0 scale-[0.4] origin-top-left">
          {renderModalUI(true)}
        </div>
      </div>
      <Button className="w-full" onClick={drawer.show}>
        Edit UI
      </Button>
      <form ref={containerRef}>
        <Drawer
          open={drawer.isOpen}
          onClose={drawer.hide}
          title={
            <div className="flex flex-row items-center justify-between">
              Edit Popover UI
              <Button onClick={handlePublish} size="small">
                Publish
              </Button>
            </div>
          }
          maskClosable={false}
          width={800}
          closeIcon={null}
        >
          <div className="flex flex-row justify-center">{renderModalUI()}</div>
        </Drawer>
      </form>
    </FormProvider>
  );
};

interface AutoResizeTextAreaProps {
  onChange?: (value: string) => void;
  value?: string;
  minHeight?: number;
  className: string;
}

export const AutoResizeTextArea = ({
  value,
  onChange,
  className,
  minHeight = 24,
}: AutoResizeTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={className}
      onChange={handleChange}
      value={value || ""}
      placeholder="Enter your description"
    />
  );
};
