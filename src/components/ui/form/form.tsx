import { zodResolver } from "@hookform/resolvers/zod";
import type * as React from "react";
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { cn } from "@/utils/cn";

type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  schema: Parameters<typeof zodResolver>[0];
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
};

function Form<TFormValues extends FieldValues>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues>) {
  const form = useForm<TFormValues>({
    ...options,
    resolver: zodResolver(schema) as ReturnType<
      typeof useForm<TFormValues>
    >["control"]["_options"]["resolver"],
  });
  return (
    <form className={cn("space-y-6", className)} onSubmit={form.handleSubmit(onSubmit)} id={id}>
      {children(form)}
    </form>
  );
}

export { Form };
