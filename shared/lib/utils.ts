import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTokenAmount = (
  ethAmount: string,
  tokenReserve: string,
  ethReserve: string
) => {
  return formatUnits(
    (parseUnits(ethAmount, 18) * BigInt(tokenReserve)) / BigInt(ethReserve),
    18
  );
};

export const getLiquidityAmount = (
  amountLP: string,
  reserve: string,
  totalSupplyLP: string
) => {
  return formatUnits(
    (parseUnits(amountLP, 18) * BigInt(reserve)) / BigInt(totalSupplyLP),
    18
  );
};

export const shakeAnimation = {
  initial: { x: 0 },
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
