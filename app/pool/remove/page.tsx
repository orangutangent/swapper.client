"use client";
import RemoveLiquidity from "@/widgets/RemoveLiquidity";
import React from "react";

const Page = () => {
  return (
    <div className="w-full  flex flex-col gap-4 items-center justify-center p-4 h-full">
      <p className="text-3xl">Remove Liquidity</p>
      <RemoveLiquidity />
    </div>
  );
};

export default Page;
