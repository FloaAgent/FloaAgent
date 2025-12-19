import React from "react";
import { Select, SelectProps } from "@heroui/select";


export const CustomSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const defaultClassNames = {
      label: "text-sm text-primary-600 font-medium",
      trigger:
        "bg-content1 border-default-200 data-[hover=true]:border-default-400",
      value: " group-data-[has-value=true]:text-white",
      ...props.classNames,
    };

    const defaultListboxProps = {
      itemClasses: {
        base: ["data-[focus-visible=true]:outline-none"],
        ...(props.listboxProps?.itemClasses || {}),
      },
      ...props.listboxProps,
    };

    return (
      <Select
        ref={ref}
        variant="bordered"
        {...props}
        classNames={defaultClassNames}
        listboxProps={defaultListboxProps}
      />
    );
  }
);

CustomSelect.displayName = "CustomSelect";
