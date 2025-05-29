"use client";
import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Droplets,
} from "lucide-react";

interface AddLiquidityButtonProps {
  tokenAddress: string;
  tokenAmount: string;
  ethAmount: string;
  exchangeAddress: string;
  disabled?: boolean;
  className?: string;
}

type TransactionState = "idle" | "approving" | "adding" | "success" | "error";

const AddLiquidityButton: React.FC<AddLiquidityButtonProps> = ({
  tokenAddress,
  tokenAmount,
  ethAmount,
  exchangeAddress,
  disabled = false,
  className,
}) => {
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddLiquidity = async () => {
    try {
      setTxState("approving");
      setError("");

      // Simulate approval process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTxState("adding");

      // Simulate adding liquidity
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setTxHash("0x1234567890abcdef1234567890abcdef12345678");
      setTxState("success");

      // Reset after 5 seconds
      setTimeout(() => {
        setTxState("idle");
        setTxHash("");
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxState("error");

      // Reset after 3 seconds
      setTimeout(() => {
        setTxState("idle");
        setError("");
      }, 3000);
    }
  };

  const getButtonContent = () => {
    switch (txState) {
      case "approving":
        return (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Approving Token...</span>
          </div>
        );
      case "adding":
        return (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Adding Liquidity...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Liquidity Added!</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Transaction Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Liquidity</span>
          </div>
        );
    }
  };

  const getButtonVariant = () => {
    switch (txState) {
      case "success":
        return "success";
      case "error":
        return "destructive";
      case "approving":
      case "adding":
        return "secondary";
      default:
        return "gradient";
    }
  };

  const isLoading = txState === "approving" || txState === "adding";
  const isDisabled = disabled || isLoading;

  return (
    <div className="space-y-4">
      <motion.div
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={handleAddLiquidity}
          disabled={isDisabled}
          variant={getButtonVariant()}
          size="lg"
          className={cn(
            "w-full relative overflow-hidden",
            txState === "success" && "animate-pulse-glow",
            className
          )}
        >
          {/* Background animation for loading states */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-gradient-x" />
          )}

          <span className="relative z-10">{getButtonContent()}</span>
        </Button>
      </motion.div>

      {/* Transaction Status Messages */}
      <AnimatePresence>
        {txState !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {txState === "approving" && (
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Droplets className="w-4 h-4" />
                <span className="text-sm">
                  Step 1/2: Approving token spending...
                </span>
              </div>
            )}

            {txState === "adding" && (
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <Plus className="w-4 h-4" />
                <span className="text-sm">
                  Step 2/2: Adding liquidity to pool...
                </span>
              </div>
            )}

            {txState === "success" && txHash && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      Transaction Successful
                    </span>
                  </div>
                  <a
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <span className="text-xs">View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Your liquidity has been added to the pool. You can now earn
                  trading fees!
                </p>
              </div>
            )}

            {txState === "error" && error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-100">
                    Transaction Failed
                  </span>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Summary */}
      <AnimatePresence>
        {txState === "idle" &&
          !disabled &&
          Number(ethAmount) > 0 &&
          Number(tokenAmount) > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
            >
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Transaction Summary</span>
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    ETH Amount:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Number(ethAmount).toFixed(6)} ETH
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Token Amount:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Number(tokenAmount).toFixed(6)} tokens
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Estimated Gas:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ~0.015 ETH
                    </span>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-blue-200 dark:border-blue-700">
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <p>
                      • You will receive LP tokens representing your pool share
                    </p>
                    <p>
                      • LP tokens can be redeemed for underlying assets + fees
                    </p>
                    <p>
                      • Trading fees are automatically reinvested in your
                      position
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default AddLiquidityButton;
