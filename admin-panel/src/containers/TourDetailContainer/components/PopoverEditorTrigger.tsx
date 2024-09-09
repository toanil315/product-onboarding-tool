import {
  Button,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  MediaIcon,
  PlusIcon,
  Popover,
} from "@/components";
import { useModal } from "@/hooks";
import { Drawer } from "antd";
import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import "./index.css";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import ImageModalTrigger from "./ImageModalTrigger";
import { ACTION_ENUM } from "@/constants";
import LinkModalTrigger from "./LinkModal";
import MediaModalTrigger from "./MediaModal";
import { Step } from "@/types/Step";

interface Props {
  onPublish: (newStepProps: Pick<Step, "title" | "description">) => void;
}

export const PopoverEditorTrigger = ({ onPublish }: Props) => {
  const drawer = useModal();
  const containerRef = useRef<HTMLFormElement | null>(null);
  const form = useFormContext();

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
        id: "text",
        type: "text",
        icon: <ItalicIcon {...baseIconProps} />,
        handler: () => append({ type: "text", value: "" }),
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
        id: "link",
        render: () => (
          <LinkModalTrigger
            onSubmit={(data) => append(data)}
            {...baseTriggerProps}
          >
            <div className="flex flex-col gap-2 p-3 items-center hover:shadow-md cursor-pointer">
              <LinkIcon {...baseIconProps} />
              <p className="capitalize font-medium text-gray-500">link</p>
            </div>
          </LinkModalTrigger>
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
        case "text":
          return (
            <Controller
              render={({ field }) => (
                <AutoResizeTextArea
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
              name={`description.${index}.value`}
              control={form.control}
            />
          );

        case "image":
          return item.value ? (
            <div className="driver-popover-description-item description-image">
              <img src={item.value} alt="image" />
            </div>
          ) : null;

        case "link":
          return item.value ? (
            <a
              href={item.value}
              target="_blank"
              className="driver-popover-description-item description-link"
            >
              {item.linkText}
            </a>
          ) : null;

        case "media":
          return item.value ? (
            <div className="driver-popover-description-item description-media">
              <div className="description-media-trigger">
                <div className="play-icon">
                  <svg
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.96276 6.1004C9.75283 5.64424 9.75283 4.5039 8.96276 4.04774L2.29609 0.198637C1.50601 -0.257526 0.518311 0.312642 0.518311 1.22511V8.92303C0.518311 9.8355 1.50601 10.4057 2.29609 9.9495L8.96276 6.1004Z"
                      fill="#E20714"
                    />
                  </svg>
                </div>
              </div>
              {item.mediaText}
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

  const renderPopoverUI = () => {
    return (
      <div
        className="driver-popover driverjs-theme relative"
        id="driver-popover-content"
      >
        <Controller
          render={({ field }) => (
            <input
              className="input-without-style driver-popover-title"
              placeholder="Enter your title"
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value}
            />
          )}
          name="title"
          control={form.control}
        />
        <div className="driver-popover-description">
          {renderDescriptionItems()}
        </div>
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
      </div>
    );
  };

  return (
    <FormProvider {...form}>
      <div className="preview flex flex-row justify-center scale-75">
        {renderPopoverUI()}
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
              Popover Editor
              <Button onClick={handlePublish} size="small">
                Publish
              </Button>
            </div>
          }
          maskClosable={false}
          width={400}
          closeIcon={null}
        >
          <div className="flex flex-row justify-center">
            {renderPopoverUI()}
          </div>
        </Drawer>
      </form>
    </FormProvider>
  );
};

interface AutoResizeTextAreaProps {
  onChange?: (value: string) => void;
  value?: string;
}

export const AutoResizeTextArea = ({
  value,
  onChange,
}: AutoResizeTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="input-without-style driver-popover-description-item"
      onChange={handleChange}
      value={value || ""}
      placeholder="Enter your description"
    />
  );
};
