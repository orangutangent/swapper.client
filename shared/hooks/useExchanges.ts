"use client";
import { useEffect } from "react";
import { IEXCHANGE } from "../interfaces";
import React from "react";

import zexchanges from "../contracts/ZExchanges.json";
import { useChainId } from "wagmi";
import useCurrency from "./useCurrency";

const useExchanges = (withMain = true) => {
  const chainID = useChainId();

  const currencyName = useCurrency();

  const defaultWithMain = withMain
    ? [
        {
          name: currencyName,
          symbol: currencyName,
          address: "0x0000000000000000000000000000000000000000",
          tokenAddress: "0x0000000000000000000000000000000000000000",
        },
      ]
    : [];

  const defaultExchanges = zexchanges.map((exchange) => {
    const newDex = {
      name: exchange.name,
      symbol: exchange.symbol,
      address:
        exchange.address[chainID.toString() as keyof typeof exchange.address],
      tokenAddress:
        exchange.tokenAddress[
          chainID.toString() as keyof typeof exchange.tokenAddress
        ],
    } as IEXCHANGE;
    return newDex;
  });

  defaultExchanges.push(...defaultWithMain);

  const [exchanges, setExchanges] =
    React.useState<IEXCHANGE[]>(defaultExchanges);

  useEffect(() => {
    const _exchanges = zexchanges.map((exchange) => {
      const newDex = {
        name: exchange.name,
        symbol: exchange.symbol,
        address:
          exchange.address[chainID.toString() as keyof typeof exchange.address],
        tokenAddress:
          exchange.tokenAddress[
            chainID.toString() as keyof typeof exchange.tokenAddress
          ],
      } as IEXCHANGE;
      return newDex;
    });
    setExchanges([..._exchanges, ...defaultWithMain]);
  }, [currencyName, chainID]);

  return exchanges;
};

export default useExchanges;
