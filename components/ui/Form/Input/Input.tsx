import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  type?: "text" | "checkbox" | "email" | "file" | "password" | "number";
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  type?: "textarea";
};

function Input(props: InputProps | TextAreaProps) {
  const { label } = props;

  return (
    <div className="flex flex-col text-primary">
      {props?.type !== "checkbox" ? <label> {label} </label> : null}
      {props?.type === "textarea" ? (
        <textarea
          className="p-3 bg-secondary border-primary border-opacity-50 border-2 rounded-lg"
          {...props}
        />
      ) : props?.type === "checkbox" ? (
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-accent w-6 h-6"
              {...props}
            />
            <span className="label-text">{label}</span>
          </label>
        </div>
      ) : (
        <input
          className="p-3 bg-secondary border-2 border-primary border-opacity-50 rounded-lg"
          {...props}
        />
      )}
    </div>
  );
}

export default Input;
