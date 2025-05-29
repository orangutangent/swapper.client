"use client";
import { AmountInput } from "@/shared/components/ui/AmountInput";
import { SelectSearch } from "@/shared/components/ui/SelectSearch";
import { Button } from "@/shared/components/ui/button";
import { useExchangeOperations } from "@/shared/hooks/useExchangeOperations";
import { useFactoryOperations } from "@/shared/hooks/useFactoryOperations";
import React, { useEffect, useState } from "react";
import exchanges from "@/shared/contracts/exchanges.json";
import Balance from "@/features/Balance";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import useCurrency from "@/shared/hooks/useCurrency";
import { motion, AnimatePresence } from "framer-motion";
import { useTokenOperations } from "@/shared/hooks/useTokenOperations";
import AddLiquidityButton from "@/features/AddLiquidityButton";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import {
  ArrowLeftRight,
  Plus,
  AlertTriangle,
  Info,
  TrendingUp,
  Droplets,
  ArrowRight,
  ExternalLink,
  Calculator,
  Wallet,
  Zap,
} from "lucide-react";

import { shakeAnimation, getTokenAmount } from "@/shared/lib/utils";

const options = exchanges;

const AddLiquidity: React.FC = () => {
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState(options[0]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const currentCurrency = useCurrency();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { useGetMyLPBalance, useGetTokenReserve } = useExchangeOperations(
    token.address
  );
  const [tokenAmount, setTokenAmount] = useState("0");

  const { useGetMyBalance } = useTokenOperations(token.tokenAddress);
  const { data: tokenBalance } = useGetMyBalance();
  const { data: tokenReserve } = useGetTokenReserve();
  const exchangeBalance = useBalance({
    address: `0x${token.address.slice(2)}`,
  });

  // Calculate token amount with loading state
  useEffect(() => {
    if (amount && tokenReserve && exchangeBalance.data?.value) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const _tokenAmount = getTokenAmount(
          amount,
          tokenReserve as string,
          exchangeBalance.data?.value.toString()
        );
        setTokenAmount(_tokenAmount);
        setIsCalculating(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setTokenAmount("0");
      setIsCalculating(false);
    }
  }, [amount, tokenReserve, exchangeBalance.data?.value]);

  // Check if user has sufficient balances
  const hasInsufficientETH =
    Number(parseEther(amount || "0")) > Number(balance?.value || 0);
  const hasInsufficientToken =
    !!tokenBalance &&
    Number(tokenAmount) >
      Number(formatUnits(BigInt(tokenBalance as string), 18));

  const canAddLiquidity =
    !hasInsufficientETH &&
    !hasInsufficientToken &&
    Number(amount) > 0 &&
    Number(tokenAmount) > 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleMaxETH = () => {
    if (balance?.value) {
      // Leave some ETH for gas fees
      const maxAmount = Number(formatEther(balance.value)) * 0.95;
      setAmount(maxAmount.toString());
    }
  };

  const handleMaxToken = () => {
    if (tokenBalance) {
      const maxAmount = formatUnits(BigInt(tokenBalance as string), 18);
      // Calculate corresponding ETH amount needed
      if (tokenReserve && exchangeBalance.data?.value) {
        const ethNeeded =
          (Number(maxAmount) *
            Number(formatEther(exchangeBalance.data.value))) /
          Number(formatUnits(BigInt(tokenReserve as string), 18));
        setAmount(ethNeeded.toString());
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col max-w-[600px] w-full justify-center gap-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center space-y-2" variants={itemVariants}>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add Liquidity
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Provide liquidity to earn trading fees
        </p>
      </motion.div>

      {/* Balance Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={itemVariants}
      >
        <Balance
          tokenName={token.name}
          tokenSymbol={token.symbol}
          tokenAddress={token.tokenAddress}
          compact={true}
        />
        <Balance
          tokenName="LP Token"
          tokenSymbol="LP"
          tokenAddress={token.address}
          compact={true}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="flex justify-center" variants={itemVariants}>
        <Link
          href="/pool/remove"
          className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <ArrowLeftRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Remove Liquidity
          </span>
          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
        </Link>
      </motion.div>

      {/* Token Selection - добавляем z-index и относительное позиционирование */}
      <motion.div
        className={cn(
          "space-y-3 relative",
          isSelectOpen && "z-50" // Повышаем z-index когда селект открыт
        )}
        variants={itemVariants}
      >
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choose Token Pair
          </h3>
        </div>
        <div className="relative z-40">
          {" "}
          {/* Добавляем обертку с z-index */}
          <SelectSearch
            value={token}
            onChange={(e) => {
              setToken(e);
              setIsSelectOpen(false);
            }}
            onOpenChange={setIsSelectOpen}
            options={options}
            className="w-full"
          />
        </div>
      </motion.div>

      {/* Input Section - понижаем z-index когда селект открыт */}
      <motion.div
        className={cn(
          "space-y-6 relative",
          isSelectOpen && "z-10" // Понижаем z-index когда селект открыт
        )}
        variants={itemVariants}
      >
        {/* ETH Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>{currentCurrency} Amount</span>
            </label>
            {balance && (
              <button
                onClick={handleMaxETH}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <Zap className="w-3 h-3" />
                <span>
                  Max: {Number(formatEther(balance.value)).toFixed(4)}{" "}
                  {currentCurrency}
                </span>
              </button>
            )}
          </div>

          <div
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-300",
              "bg-white dark:bg-gray-900",
              hasInsufficientETH
                ? "border-red-500 shadow-lg shadow-red-500/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                  placeholder="0.0"
                  className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Enter {currentCurrency} amount
                </div>
              </div>
              {balance && (
                <button
                  onClick={handleMaxETH}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>MAX</span>
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {hasInsufficientETH && (
              <motion.div
                variants={shakeAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center space-x-2 text-red-500"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Insufficient {currentCurrency} balance
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plus Icon */}
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Token Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>{token.symbol} Amount</span>
            </label>
            {!!tokenBalance && (
              <button
                onClick={handleMaxToken}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <Zap className="w-3 h-3" />
                <span>
                  Max:{" "}
                  {Number(
                    formatUnits(BigInt(tokenBalance as string), 18)
                  ).toFixed(4)}{" "}
                  {token.symbol}
                </span>
              </button>
            )}
          </div>

          <div
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-300",
              "bg-gray-50 dark:bg-gray-800/50",
              isCalculating
                ? "border-blue-500 shadow-lg shadow-blue-500/20"
                : hasInsufficientToken
                ? "border-red-500 shadow-lg shadow-red-500/20"
                : "border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div
                  className={cn(
                    "text-2xl font-semibold transition-all duration-300",
                    isCalculating && "animate-pulse"
                  )}
                >
                  {isCalculating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-400">Calculating...</span>
                    </div>
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {Number(tokenAmount).toFixed(6)} {token.symbol}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Auto-calculated based on pool ratio
                </div>
              </div>

              {!!tokenReserve &&
                !!exchangeBalance.data?.value &&
                !isCalculating && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Pool Ratio
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      1 {currentCurrency} ={" "}
                      {(
                        Number(
                          formatUnits(BigInt(tokenReserve as string), 18)
                        ) / Number(formatEther(exchangeBalance.data.value))
                      ).toFixed(4)}{" "}
                      {token.symbol}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <AnimatePresence>
            {hasInsufficientToken && (
              <motion.div
                variants={shakeAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center space-x-2 text-red-500"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">
                  Insufficient {token.name} balance
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Pool Information */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Pool Information
            </span>
          </div>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Pool Share
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ~0.01%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentCurrency} Deposited
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Number(amount || 0).toFixed(6)} {currentCurrency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {token.symbol} Deposited
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Number(tokenAmount || 0).toFixed(6)} {token.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rates
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      1 {token.symbol} ={" "}
                      {tokenReserve && exchangeBalance.data?.value
                        ? (
                            Number(formatEther(exchangeBalance.data.value)) /
                            Number(
                              formatUnits(BigInt(tokenReserve as string), 18)
                            )
                          ).toFixed(6)
                        : "0"}{" "}
                      {currentCurrency}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      1 {currentCurrency} ={" "}
                      {tokenReserve && exchangeBalance.data?.value
                        ? (
                            Number(
                              formatUnits(BigInt(tokenReserve as string), 18)
                            ) / Number(formatEther(exchangeBalance.data.value))
                          ).toFixed(6)
                        : "0"}{" "}
                      {token.symbol}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Earn 0.3% trading fees
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Warning Messages */}
      <AnimatePresence>
        {(hasInsufficientETH || hasInsufficientToken) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Insufficient Balance
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {hasInsufficientETH && (
                    <p>
                      • You need more {currentCurrency} to complete this
                      transaction
                    </p>
                  )}
                  {hasInsufficientToken && (
                    <p>
                      • You need more {token.symbol} tokens to complete this
                      transaction
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Preview */}
      <AnimatePresence>
        {canAddLiquidity && Number(amount) > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-start space-x-3">
              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/50">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Ready to Add Liquidity
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You'll receive LP tokens representing your share of the pool
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.div className="pt-4" variants={itemVariants}>
        <AddLiquidityButton
          tokenAddress={token.tokenAddress}
          tokenAmount={tokenAmount}
          ethAmount={amount}
          exchangeAddress={token.address}
          disabled={!canAddLiquidity}
          className={cn(
            "w-full h-14 text-lg font-semibold transition-all duration-300",
            canAddLiquidity
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
        />
      </motion.div>

      {/* Footer Info */}
      <motion.div
        className="text-center space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By adding liquidity you'll earn 0.3% of all trades on this pair
          proportional to your share of the pool.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Fees are added to the pool, accrue in real time and can be claimed by
          withdrawing your liquidity.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AddLiquidity;
