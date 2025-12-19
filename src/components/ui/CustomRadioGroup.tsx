import React from "react";
import { RadioGroup, RadioGroupProps, Radio } from "@heroui/radio";
import { FaCheck } from "react-icons/fa";


export const CustomRadioGroup = React.forwardRef<
  HTMLDivElement,
  RadioGroupProps
>((props, ref) => {
  const defaultClassNames = {
    label: "text-sm text-primary-600 font-medium mb-3",
    wrapper: "gap-2",
    ...props.classNames,
  };

  return (
    <RadioGroup
      ref={ref}
      orientation="horizontal"
      {...props}
      classNames={defaultClassNames}
    />
  );
});

CustomRadioGroup.displayName = "CustomRadioGroup";


interface CustomRadioProps {
  value: string;
  children: React.ReactNode;
}

export const ButtonRadio: React.FC<CustomRadioProps> = ({
  value,
  children,
}) => {
  return (
    <Radio
      value={value}
      classNames={{
        base: [
          "inline-flex",
          "m-0",
          "items-center",
          "justify-center",
          "flex-row-reverse",
          "max-w-full",
          "cursor-pointer",
          "rounded-lg",
          "gap-2",
          "px-4",
          "py-2",
          "border",
          "border-default-200",
          "bg-content1",
          "text-default-700",
          "transition-all",
          "hover:border-primary",
          
          "data-[selected=true]:border-primary",
          "data-[selected=true]:bg-primary",
          "data-[selected=true]:!text-black",
          
          "data-[disabled=true]:opacity-50",
          "data-[disabled=true]:cursor-not-allowed",
          "data-[disabled=true]:hover:border-default-200",
        ],
        labelWrapper: "m-0 ml-0",
        label: "text-sm font-medium text-inherit",
        wrapper: "hidden",
        control: "hidden",
      }}
    >
      <div className="flex items-center gap-1.5 text-inherit [.group[data-selected=true]_&]:text-black">
        <FaCheck className="text-xs [.group:not([data-selected=true])_&]:hidden [.group[data-selected=true]_&]:text-black" />
        <span className="[.group[data-selected=true]_&]:text-black">
          {children}
        </span>
      </div>
    </Radio>
  );
};

ButtonRadio.displayName = "ButtonRadio";
