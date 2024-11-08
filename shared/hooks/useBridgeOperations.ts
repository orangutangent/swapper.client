"use client";

import { EndpointId } from "@layerzerolabs/lz-definitions";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { Options } from "@layerzerolabs/lz-v2-utilities";

import { useState } from "react";
import toast from "react-hot-toast";
import { getAddress, toBytes, toHex } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

// import amoyZeroX from "../contracts/AMOY_ZeroX.json";
// import avaZeroX from "../contracts/AVA_ZeroX.json";

import oft_abi from "../contracts/OFT_ABI.json";
import { IEXCHANGE } from "../interfaces";

interface SendParam {
  dstEid: any; // Destination endpoint ID, represented as a number.
  to: any; // Recipient address, represented as bytes.
  amountLD: any; // Amount to send in local decimals.
  minAmountLD: any; // Minimum amount to send in local decimals.
  extraOptions: any; // Additional options supplied by the caller to be used in the LayerZero message.
  composeMsg: any; // The composed message for the send() operation.
  oftCmd: any; // The OFT command to be executed, unused in default OFT implementations.
}

export const useBridgeOperations = (
  to: EndpointId,
  amount: string,
  contract: IEXCHANGE
) => {
  const { address } = useAccount();

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  let options = Options.newOptions()
    .addExecutorLzReceiveOption(65000, 0)
    .toBytes();

  const sendParam: SendParam = {
    dstEid: to,
    to: toHex(addressToBytes32(address || "0x")),
    amountLD: amount,
    minAmountLD: amount,
    extraOptions: toHex(options),
    composeMsg: toHex(toBytes("0x")), // Assuming no composed message
    oftCmd: toHex(toBytes("0x")), // Assuming no OFT command is needed
  };

  const useGetFeeQuote = () => {
    const { data, isError, isLoading, refetch, error } = useReadContract({
      address: `0x${contract.tokenAddress.slice(2)}`,
      abi: oft_abi,
      functionName: "quoteSend",
      args: [sendParam, false],
    });

    return { data, isError, isLoading, refetch, error };
  };

  const send = (nativeFee: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${contract.tokenAddress.slice(2)}`,
        abi: oft_abi,
        functionName: "send",
        account: address && getAddress(address),
        args: [
          sendParam,
          {
            nativeFee: nativeFee,
            lzTokenFee: 0,
          },
          address,
        ],
        value: BigInt(nativeFee),
      },
      {
        onSuccess: () => {
          toast.success("Transaction sent successfully");
          setIsSending(false);
        },
        onError: (err: any) => {
          console.log("send error: ", err);
          setIsSending(false);
          toast.error("Transaction Failed! Try Again");
        },
      }
    );
  };

  const [isSending, setIsSending] = useState(false);

  return {
    send,
    useGetFeeQuote,
    isConfirming,
    isSending,
    isConfirmed,
  };
};
