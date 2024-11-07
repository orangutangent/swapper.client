"use client";

import { get } from "http";
import token_abi from "../contracts/TokenABI.json";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAddress, parseEther, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const useTokenOperations = (tokenAddress: string) => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash } = useWriteContract();

  const [isSending, setIsSending] = useState(false);
  const useGetMyBalance = () => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${tokenAddress.slice(2)}`,
      abi: token_abi,
      functionName: "balanceOf",
      args: [address && getAddress(address || "")],
      account: address && getAddress(address),
    });

    return { data, isError, isLoading, refetch };
  };

  const useGetSymbol = () => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${tokenAddress.slice(2)}`,
      abi: token_abi,
      functionName: "symbol",
    });
    return { data, isError, isLoading, refetch };
  };

  const useGetName = () => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${tokenAddress.slice(2)}`,
      abi: token_abi,
      functionName: "name",
    });
    return { data, isError, isLoading, refetch };
  };

  const useGetTotalSupply = () => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${tokenAddress.slice(2)}`,
      abi: token_abi,
      functionName: "totalSupply",
    });
    return { data, isError, isLoading, refetch };
  };

  const approveTokens = (
    address: string,
    amount: string,
    successFunc?: () => void,
    errorFunc?: () => void
  ) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${tokenAddress.slice(2)}`,
        abi: token_abi,
        functionName: "approve",
        args: [getAddress(address), amount],
      },
      {
        onSuccess: () => {
          toast.success("Tokens approved successfully");
          setIsSending(false);
          successFunc?.();
        },
        onError: (err: any) => {
          toast.error("Transaction Failed! Try Again");
          console.log(err.message);
          setIsSending(false);
          errorFunc?.();
        },
      }
    );
  };

  return {
    useGetMyBalance,
    approveTokens,
    isSending,
    useGetSymbol,
    useGetName,
    useGetTotalSupply,
  };
};
