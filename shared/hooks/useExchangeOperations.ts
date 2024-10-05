"use client";

import contract from "../contracts/Exchange.json";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAddress, parseEther, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const useExchangeOperations = (exchangeAddress: string) => {
  const { address } = useAccount();

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  const [isSending, setIsSending] = useState(false);

  const useGetETHAmount = (tokenAmount: string) => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${exchangeAddress.slice(2)}`,
      abi: contract.abi,
      functionName: "getEthAMount",
      args: [tokenAmount],
    });

    return { data, isError, isLoading, refetch };
  };

  const useGetTokenAmount = (ethAmount: string) => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${exchangeAddress.slice(2)}`,
      abi: contract.abi,
      functionName: "getTokenAmount",
      args: [ethAmount],
    });
    return { data, isError, isLoading, refetch };
  };

  const addLiquidity = (
    tokenAmount: string,
    ethAmount: string,
    successFunc?: () => void,
    errorFunc?: () => void
  ) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${exchangeAddress.slice(2)}`,
        abi: contract.abi,
        functionName: "addLiquidity",
        args: [parseUnits(tokenAmount, 18)],
        value: parseEther(ethAmount),
        account: address && getAddress(address),
      },
      {
        onSuccess: () => {
          toast.success("Liquidity added successfully");
          setIsSending(false);
          successFunc && successFunc();
        },
        onError: (err: any) => {
          console.log(err);
          setIsSending(false);
          toast.error("Transaction Failed! Try Again");
          errorFunc && errorFunc();
        },
      }
    );
  };

  const useGetTokenReserve = () => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${exchangeAddress.slice(2)}`,
      abi: contract.abi,
      functionName: "getReserve",
    });
    return { data, isError, isLoading, refetch };
  };

  const useGetMyLPBalance = () => {
    const { data, isError, isLoading, refetch } = useReadContract({
      address: `0x${exchangeAddress.slice(2)}`,
      abi: contract.abi,
      functionName: "balanceOf",
      args: [address && getAddress(address || "")],
      account: address && getAddress(address),
    });
    return { data, isError, isLoading, refetch };
  };

  const removeLiquidity = (tokenAmount: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${exchangeAddress.slice(2)}`,
        abi: contract.abi,
        functionName: "removeLiquidity",
        args: [parseUnits(tokenAmount, 18)],
        account: address && getAddress(address),
      },
      {
        onSuccess: () => {
          toast.success("Liquidity removed successfully");
          setIsSending(false);
        },
        onError: (err: any) => {
          console.log(err);
          setIsSending(false);
          toast.error("Transaction Failed! Try Again");
        },
      }
    );
  };

  const swapTokenToETH = (tokenSold: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${exchangeAddress.slice(2)}`,
        abi: contract.abi,
        functionName: "tokenToEthSwap",
        args: [tokenSold, parseEther("0")],
      },
      {
        onSuccess: () => {
          toast.success("Token swapped to ETH successfully");
          setIsSending(false);
        },
        onError: (err: any) => {
          setIsSending(false);
          toast.error("Transaction Failed! Try Again");
        },
      }
    );
  };

  const swapETHtoToken = (ethSold: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${exchangeAddress.slice(2)}`,
        abi: contract.abi,
        functionName: "ethToTokenSwap",
        args: [parseEther("0")],
        value: parseEther(ethSold),
      },
      {
        onSuccess: () => {
          toast.success("ETH swapped to token successfully");
          setIsSending(false);
        },
        onError: (err: any) => {
          console.log(err);
          setIsSending(false);
          toast.error("Transaction Failed! Try Again");
        },
      }
    );
  };

  const swapTokenToToken = (tokenSold: string, tokenAddress: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${exchangeAddress.slice(2)}`,
        abi: contract.abi,
        functionName: "tokenToTokenSwap",
        args: [tokenSold, parseEther("0"), getAddress(tokenAddress)],
      },
      {
        onSuccess: () => {
          toast.success("Token swapped to token successfully");
          setIsSending(false);
        },
        onError: (err: any) => {
          console.log(err);
          setIsSending(false);
          toast.error("Transaction Failed! Try Again");
        },
      }
    );
  };

  return {
    useGetETHAmount,
    useGetTokenAmount,
    useGetMyLPBalance,
    useGetTokenReserve,
    addLiquidity,
    removeLiquidity,
    swapTokenToETH,
    swapETHtoToken,
    swapTokenToToken,
    isSending,
    isConfirming,
    isConfirmed,
  };
};
