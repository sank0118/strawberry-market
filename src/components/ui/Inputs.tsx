import React from "react";
import { twMerge } from "tailwind-merge";

//
export const TextInput = ({
  label,
  divClassName,
  labelClassName,
  message,
  messageClassName,
  ...props
}: React.ComponentProps<"input"> & {
  label?: string;
  labelClassName?: string;
  divClassName?: string;
  messageClassName?: string;
  message?: string | null;
}) => {
  return (
    <div className={twMerge("flex flex-col gap-y-1", divClassName)}>
      {label && (
        <label
          htmlFor={props?.id ?? props?.name}
          className={twMerge("text-xs text-gray-500", labelClassName)}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={props?.id ?? props?.name}
        className={twMerge(
          "border border-pink-200 rounded h-12 px-2.5 outline-none bg-pink-50 transition w-full focus:text-pink-500 focus:bg-transparent focus:border-pink-500",
          props?.className
        )}
      />
      {message && (
        <label
          htmlFor={props?.id ?? props?.name}
          className={twMerge("text-xs text-red-500", messageClassName)}
        >
          {message}
        </label>
      )}
    </div>
  );
};

//! preventDefault(), cn => flex, rowGap
export const Form = (props: React.ComponentProps<"form">) => (
  <form
    {...props}
    onSubmit={(e) => {
      e.preventDefault();
      if (props?.onSubmit) {
        props.onSubmit(e);
      }
    }}
    className={twMerge("flex flex-col gap-y-2.5", props?.className)}
  />
);

export const SubmitButton = (props: React.ComponentProps<"button">) => (
  <button
    {...props}
    className={twMerge("h-12 rounded bg-pink-500 text-white", props?.className)}
  />
);
