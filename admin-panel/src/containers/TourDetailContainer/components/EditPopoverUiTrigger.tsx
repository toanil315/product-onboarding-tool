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
import { useMemo, useRef } from "react";
import "./index.css";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

export const EditPopoverUiTrigger = () => {
  const drawer = useModal();
  const containerRef = useRef<HTMLFormElement | null>(null);
  const form = useForm({
    defaultValues: {
      title: "",
      description: [],
    },
  });
  const { fields, append, update } = useFieldArray({
    control: form.control,
    name: "description",
  });

  const elementPlaceholders = useMemo(() => {
    const baseIconProps = {
      width: 24,
      height: 24,
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
        type: "image",
        icon: <ImageIcon {...baseIconProps} />,
        handler: () => append({ type: "image", value: "" }),
      },
      {
        id: "link",
        type: "link",
        icon: <LinkIcon {...baseIconProps} />,
        handler: () => append({ type: "link", value: "" }),
      },
      {
        id: "media",
        type: "media",
        icon: <MediaIcon {...baseIconProps} />,
        handler: () => append({ type: "media", value: "" }),
      },
    ];
  }, []);

  const renderElementPlaceholders = () => {
    return elementPlaceholders.map((element) => (
      <div
        key={element.id}
        className="flex flex-col gap-2 p-3 items-center hover:shadow-md cursor-pointer"
        onClick={element.handler}
      >
        {element.icon}
        <p className="capitalize font-medium text-gray-500">{element.type}</p>
      </div>
    ));
  };

  const renderDescriptionItems = () => {
    return fields.map((item: any, index: number) => {
      switch (item.type) {
        case "text":
          return (
            <Controller
              render={({ field }) => (
                <textarea
                  className="input-without-style driver-popover-description"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    e.target.style.height = "24px";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  value={field.value}
                  placeholder="Enter your description"
                />
              )}
              name={`description.${index}.value`}
              control={form.control}
            />
          );

        default:
          return null;
      }
    });

    // {/* <div className="tooltip-more-info">
    //     <a
    //       href="https://www.linkedin.com/feed/"
    //       target="_blank"
    //       className="tooltip-more-info-link"
    //     >
    //       See details documents
    //     </a>
    //   </div> */}
  };

  return (
    <FormProvider {...form}>
      <Button className="w-full" onClick={drawer.show}>
        Edit UI
      </Button>
      <form ref={containerRef}>
        <Drawer
          open={drawer.isOpen}
          onClose={drawer.hide}
          title="Edit Popover UI"
          maskClosable={false}
          width={400}
          closeIcon={null}
        >
          <div className="flex flex-row justify-center">
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
                  />
                )}
                name="title"
                control={form.control}
              />
              <div className="driver-popover-description-wrapper">
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
          </div>
        </Drawer>
      </form>
    </FormProvider>
  );
};
