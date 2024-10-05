"use client";
import Down from "@/shared/icons/Down";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface Props {
  value: ISelectOption;
  options: ISelectOption[];
  onChange?: (value: ISelectOption) => void;
}

export interface ISelectOption {
  name: string;
  symbol: string;
  address: string;
  tokenAddress: string;
}

const SelectSearch = ({
  options,
  onChange = () => {},
  value = options[0],
}: // setValue,
Props) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  return (
    <>
      <div className={`relative ${open && "z-50"}`}>
        <div className="w-full  p-2 relative ps-4  pe-12 border-border border-2 rounded-2xl">
          <p className=" truncate">{value.symbol}</p>
          <motion.div
            className=" absolute cursor-pointer right-4 top-[calc(50%-12px)]  h-6 "
            initial={{ rotate: 0 }}
            animate={{ rotate: open ? 180 : 0 }}
            onClick={() => setOpen(!open)}
          >
            <Down className={` w-6 `} />
          </motion.div>
        </div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: open ? 0 : 10, opacity: open ? 1 : 0 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`absolute top-12 w-full border-border border-2 rounded-2xl bg-background overflow-y-scroll max-h-[250px] z-50 ${
            open ? "block" : "hidden"
          }`}
        >
          <input
            type="text"
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 outline-none bg-transparent border-none botder-b-border border-2 "
          />
          {options
            .filter(
              (option) =>
                option.symbol.includes(search) || option.name.includes(search)
            )
            .map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
                className="p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                {option.symbol}
              </div>
            ))}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`fixed h-screen w-screen top-0 start-0  backdrop-blur-md z-20 bg-[rgba(0,0,0,0.2)] ${
          open ? "block" : "hidden"
        }`}
      />
    </>
  );
};

export default SelectSearch;
