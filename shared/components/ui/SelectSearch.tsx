"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDownIcon, SearchIcon, CheckIcon } from "lucide-react";

export interface ISelectOption {
  name: string;
  symbol: string;
  address: string;
  tokenAddress: string;
  logoUrl?: string;
  balance?: number;
  price?: number;
}

interface Props {
  value: ISelectOption;
  options: ISelectOption[];
  onChange?: (value: ISelectOption) => void;
  onOpenChange?: (isOpen: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SelectSearch: React.FC<Props> = ({
  value,
  options,
  onChange,
  onOpenChange,
  placeholder = "Select token",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Notify parent component when open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (option: ISelectOption) => {
    onChange?.(option);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleToggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={handleToggleOpen}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl border-2",
          "bg-white dark:bg-gray-900 transition-all duration-300",
          "hover:border-gray-300 dark:hover:border-gray-600",
          isOpen
            ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]"
            : "border-gray-200 dark:border-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
          "group"
        )}
      >
        <div className="flex items-center space-x-3">
          {value.logoUrl ? (
            <img
              src={value.logoUrl}
              alt={value.symbol}
              className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {value.symbol.charAt(0)}
            </div>
          )}
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">
              {value.symbol}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-32">
              {value.name}
            </div>
          </div>
        </div>

        <ChevronDownIcon
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 z-[200]", // Увеличиваем z-index
            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
            "rounded-xl shadow-xl backdrop-blur-sm",
            "animate-in slide-in-from-top-2 duration-200"
          )}
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tokens..."
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700",
                  "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-pulse">No tokens found</div>
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.address}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full flex items-center justify-between p-3",
                    "hover:bg-gray-50 dark:hover:bg-gray-800",
                    "transition-all duration-150 group",
                    highlightedIndex === index && "bg-gray-50 dark:bg-gray-800",
                    value.address === option.address &&
                      "bg-blue-50 dark:bg-blue-900/20"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {option.logoUrl ? (
                      <img
                        src={option.logoUrl}
                        alt={option.symbol}
                        className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {option.symbol.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-40">
                        {option.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {option.balance !== undefined && (
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.balance.toLocaleString()}
                      </div>
                    )}
                    {option.price !== undefined && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ${option.price.toFixed(4)}
                      </div>
                    )}
                    {value.address === option.address && (
                      <CheckIcon className="w-4 h-4 text-blue-500 ml-2" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
