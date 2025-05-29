"use client";
import React, { useState, useEffect } from "react";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import { useAccount, useBalance } from "wagmi";
import { formatEther, formatUnits } from "viem";
import useCurrency from "@/shared/hooks/useCurrency";
import { cn } from "@/shared/lib/utils";
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Wallet,
  Copy,
  Check,
} from "lucide-react";

interface Props {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol?: string;
  showPrice?: boolean;
  compact?: boolean;
  className?: string;
}

const Balance = ({
  tokenAddress,
  tokenName,
  tokenSymbol = tokenName,
  showPrice = false,
  compact = false,
  className,
}: Props) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { useGetMyBalance } = useTokenOperations(tokenAddress);
  const { data: tokenBalance } = useGetMyBalance();
  const currencyName = useCurrency();

  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [priceChange] = useState(Math.random() > 0.5 ? 2.34 : -1.23); // Mock price change

  // Determine which balance to display
  const displayBalance = React.useMemo(() => {
    if (tokenSymbol === currencyName && balance) {
      return {
        value: formatEther(balance.value),
        type: "native",
        raw: balance.value,
      };
    }

    if (tokenBalance !== undefined) {
      if (tokenBalance === BigInt(0)) {
        return {
          value: "0",
          type: "token",
          raw: BigInt(0),
        };
      }
      return {
        value: formatUnits(BigInt(tokenBalance as string), 18),
        type: "token",
        raw: BigInt(tokenBalance as string),
      };
    }

    return null;
  }, [tokenBalance, balance, tokenSymbol, currencyName]);

  // Animation trigger when balance changes
  useEffect(() => {
    if (displayBalance) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [displayBalance?.value]);

  const handleCopyAddress = async () => {
    if (tokenAddress) {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDisplayValue = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    if (num < 1000000) return `${(num / 1000).toFixed(2)}K`;
    return `${(num / 1000000).toFixed(2)}M`;
  };

  if (!displayBalance) {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-20",
          className
        )}
      />
    );
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-xl",
          "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
          "border border-gray-200 dark:border-gray-700",
          "transition-all duration-300 hover:shadow-md",
          className
        )}
      >
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {tokenSymbol}
          </span>
        </div>
        <div className="font-semibold text-gray-900 dark:text-white">
          {isVisible ? formatDisplayValue(displayBalance.value) : "••••"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group transition-all duration-300",
        "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
        "border-2 border-gray-200 dark:border-gray-700",
        "rounded-2xl p-6 shadow-sm hover:shadow-lg",
        "hover:border-gray-300 dark:hover:border-gray-600",
        isAnimating && "animate-pulse",
        className
      )}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {tokenName} Balance
            </h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tokenSymbol}
              </p>
              {tokenAddress && (
                <button
                  onClick={handleCopyAddress}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  title="Copy token address"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          title={isVisible ? "Hide balance" : "Show balance"}
        >
          {isVisible ? (
            <Eye className="w-4 h-4 text-gray-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Balance Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div
              className={cn(
                "text-3xl font-bold transition-all duration-300",
                isAnimating && "scale-105",
                isVisible
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-600"
              )}
            >
              {isVisible ? formatDisplayValue(displayBalance.value) : "••••••"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isVisible ? (
                <span title={displayBalance.value}>
                  {parseFloat(displayBalance.value).toLocaleString()}{" "}
                  {tokenSymbol}
                </span>
              ) : (
                "Hidden"
              )}
            </div>
          </div>

          {showPrice && isVisible && (
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                $1,234.56
              </div>
              <div
                className={cn(
                  "flex items-center text-sm",
                  priceChange > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {priceChange > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(priceChange)}%
              </div>
            </div>
          )}
        </div>

        {/* Progress bar for visual representation */}
        {isVisible && displayBalance.value !== "0" && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Balance</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: "100%",
                  animation: isAnimating
                    ? "fillProgress 1s ease-out"
                    : undefined,
                }}
              />
            </div>
          </div>
        )}

        {/* Zero balance state */}
        {displayBalance.value === "0" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No {tokenSymbol} tokens yet
            </p>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default Balance;
