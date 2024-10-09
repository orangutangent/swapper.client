import AddLiquidity from "@/widgets/AddLiquidity";
import React from "react";

const page = () => {
  return (
    <div className="w-full  flex flex-col gap-4 items-center justify-center p-4 h-full">
      <p className="text-3xl">Pool</p>

      <AddLiquidity />
    </div>
  );
};

export default page;
