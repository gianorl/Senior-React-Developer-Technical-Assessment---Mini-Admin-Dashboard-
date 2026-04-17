import type * as React from "react";

import { FormError } from "./error";
import { Label } from "./label";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
  error?: { message?: string };
};

export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, "className" | "children"> & {
  containerClassName?: string;
};

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { label, error, children, className, labelClassName } = props;
  return (
    <div className={className}>
      <Label className={labelClassName}>
        {label}
        <div className="mt-1">{children}</div>
      </Label>
      <FormError errorMessage={error?.message} />
    </div>
  );
};
