"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  {
    name: "Swap",
    href: "/",
  },
  {
    name: "Pool",
    href: "/pool",
  },
];

const Header = () => {
  const pathname = usePathname();
  return (
    <div className=" w-full p-4 flex justify-between">
      <h1 className="text-3xl">Swapper</h1>

      <div className="flex items-center gap-2 md:gap-8 ">
        {tabs.map((link) => (
          <Link href={link.href} key={link.name} className="relative p-2">
            {pathname === link.href && (
              <motion.div
                layoutId="underline"
                style={{
                  borderRadius: "9999px",
                }}
                className=" absolute inset-0  bg-blue-600"
              />
            )}
            <span className="font-bold relative z-10">{link.name}</span>
          </Link>
        ))}
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
          chainStatus={{
            smallScreen: "icon",
            largeScreen: "full",
          }}
        />
      </div>
    </div>
  );
};

export default Header;
