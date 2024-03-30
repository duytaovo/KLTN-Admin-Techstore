import { forwardRef, InputHTMLAttributes, useState } from "react";
import type {
  UseFormRegister,
  RegisterOptions,
  FieldValues,
  FieldPath,
} from "react-hook-form";
export interface InputNumberProps
  extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  name: FieldPath<any>;
  defaultValue?: any;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumberInner(
    {
      errorMessage,
      className,
      classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
      classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
      onChange,
      value,
      name,
      rules,
      register,
      ...rest
    },
    ref,
  ) {
    const [localValue, setLocalValue] = useState<string>(value as string);
    const registerResult = register && name ? register(name, rules) : null;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (/^\d+$/.test(value) || value === "") {
        // Thực thi onChange callback từ bên ngoài truyền vào props
        onChange && onChange(event);
        // Cập nhật localValue state
        setLocalValue(value);
      }
    };
    return (
      <div className={className}>
        <input
          className={classNameInput}
          onChange={handleChange}
          value={value === undefined ? localValue : value}
          {...rest}
          // {...registerResult}
          ref={ref}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    );
  },
);

export default InputNumber;

