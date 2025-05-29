"use client";

import { cn } from "@/shared/lib/utils";
import React, { useState, useEffect } from "react";

interface AmountInputProps {
  value: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxValue?: number;
  onMaxClick?: () => void;
  error?: string;
  label?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  className,
  onChange,
  placeholder = "0.0",
  disabled = false,
  maxValue,
  onMaxClick,
  error,
  label,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(inputValue)) {
      onChange?.(e);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative group transition-all duration-300 ease-in-out",
          "rounded-xl border-2 bg-white dark:bg-gray-900",
          isFocused
            ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
          error && "border-red-500 shadow-lg shadow-red-500/20",
          disabled && "opacity-50 cursor-not-allowed",
          isAnimating && "animate-pulse",
          className
        )}
      >
        <div className="flex items-center p-4">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent text-2xl font-semibold outline-none",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "text-gray-900 dark:text-white",
              "transition-all duration-200"
            )}
          />
          {maxValue && onMaxClick && (
            <button
              onClick={onMaxClick}
              disabled={disabled}
              className={cn(
                "ml-2 px-3 py-1 text-sm font-medium rounded-lg",
                "bg-blue-100 hover:bg-blue-200 text-blue-700",
                "dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300",
                "transition-all duration-200 hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              MAX
            </button>
          )}
        </div>

        {/* Animated border gradient */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
            "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
            "animate-gradient-x",
            isFocused && "opacity-20"
          )}
          style={{ zIndex: -1 }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}

      {maxValue && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Balance: {maxValue.toLocaleString()}
        </p>
      )}
    </div>
  );
};
