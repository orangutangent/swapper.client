"use client";

import contract from "../contracts/Factory.json";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAddress, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const useFactoryOperations = () => {
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  const [isSending, setIsSending] = useState(false);

  const useGetExchange = (address: string) => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${contract.address.slice(2)}`,
      abi: contract.abi,
      functionName: "getExchange",
      args: [getAddress(address)],
    });

    return { data, isError, isLoading, refetch };
  };

  const createExchange = async (address: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${contract.address.slice(2)}`,
        abi: contract.abi,
        functionName: "createExchange",
        args: [getAddress(address)],
      },
      {
        onSuccess: () => {
          toast.success("Exchange created successfully");
          setIsSending(false);
        },
        onError: (err: any) => {
          toast.error("Transaction Failed! Try Again.");
          console.log(err.message);
        },
      }
    );
  };

  return {
    isConfirmed,
    isConfirming,
    createExchange,
    isSending,
    useGetExchange,
  };
};
