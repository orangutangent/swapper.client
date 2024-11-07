"use client";

import { EndpointId } from "@layerzerolabs/lz-definitions";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { Options } from "@layerzerolabs/lz-v2-utilities";

import { BigNumberish, BytesLike, ethers } from "ethers";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAddress, parseEther, parseUnits, toBytes, toHex } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import amoyZeroX from "../contracts/AMOY_ZeroX.json";
import avaZeroX from "../contracts/AVA_ZeroX.json";

// function addressToBytes32(address: string): `0x${string}` {
//   // Удаляем префикс '0x' и дополняем до 64 символов (32 байта) нулями слева.
//   const strippedAddress = address.toLowerCase().replace(/^0x/, "");
//   return `0x${strippedAddress.padStart(64, "0")}`;
// }

interface SendParam {
  dstEid: any; // Destination endpoint ID, represented as a number.
  to: any; // Recipient address, represented as bytes.
  amountLD: any; // Amount to send in local decimals.
  minAmountLD: any; // Minimum amount to send in local decimals.
  extraOptions: any; // Additional options supplied by the caller to be used in the LayerZero message.
  composeMsg: any; // The composed message for the send() operation.
  oftCmd: any; // The OFT command to be executed, unused in default OFT implementations.
}

export const useBridgeOperations = (to: EndpointId, amount: string) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const [contract, setContract] = useState(avaZeroX);

  useEffect(() => {
    switch (chainId) {
      case 43113:
        setContract(avaZeroX);
        break;
      case 80002:
        setContract(amoyZeroX);
        break;
    }
  }, [chainId]);

  let options = Options.newOptions()
    .addExecutorLzReceiveOption(65000, 0)
    .toBytes();

  const sendParam: SendParam = {
    dstEid: to,
    to: toHex(addressToBytes32("0xdF42881Ee786Bea8526916f6632561443Ab170Ea")),
    amountLD: amount,
    minAmountLD: amount,
    extraOptions: toHex(options),
    composeMsg: toHex(toBytes("0x")), // Assuming no composed message
    oftCmd: toHex(toBytes("0x")), // Assuming no OFT command is needed
  };

  console.log(sendParam);

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  const useGetFeeQuote = () => {
    const { data, isError, isLoading, refetch, error } = useReadContract({
      address: `0x${contract.address.slice(2)}`,
      abi: contract.abi,
      functionName: "quoteSend",
      args: [sendParam, false],
    });

    return { data, isError, isLoading, refetch, error };
  };

  const send = (nativeFee: string) => {
    setIsSending(true);
    writeContract(
      {
        address: `0x${contract.address.slice(2)}`,
        abi: contract.abi,
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
