"use client";
import Web3Provider from "./Web3Provider";
import { ThemeProvider } from "./ThemeProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  );
};

export default Providers;
