import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  type?: "text" | "checkbox" | "email" | "file" | "password" | "number";
  error?: string;
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  type?: "textarea";
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", error, className = "", ...props }, ref) => {
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
          className={`input input-bordered w-full ${
            error ? "input-error" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
