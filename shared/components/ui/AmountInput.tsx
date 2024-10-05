import React from "react";

interface AmountInputProps {
  value: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const AmountInput = ({
  value = "0",
  className = "",
  onChange = () => {},
  placeholder,
  disabled = false,
}: AmountInputProps) => {
  return (
    <input
      placeholder={placeholder}
      type="text"
      min={0}
      disabled={disabled}
      className={`w-full p-4 rounded-2xl text-lg disabled:bg-transparent border-border border-2 outline-none ${className}`}
      value={value}
      onInput={(e) => {
        e.currentTarget.value = e.currentTarget.value
          .toString()
          .replace(/[^0-9.]/g, "")
          .replace(/(\..*)\./g, "$1");
      }}
      onChange={onChange}
    />
  );
};

export default AmountInput;
