import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  type?: "text" | "checkbox" | "email" | "file" | "password" | "number";
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  type?: "textarea";
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="text-white">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className="input input-bordered w-full"
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
