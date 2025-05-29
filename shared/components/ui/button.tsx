import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] hover:scale-[1.02]",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 active:scale-[0.98] hover:scale-[1.02]",
        outline:
          "border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:border-gray-600 active:scale-[0.98] hover:scale-[1.02]",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 active:scale-[0.98] hover:scale-[1.02]",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 active:scale-[0.98]",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
        gradient:
          "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] hover:scale-[1.02] animate-gradient-x",
        success:
          "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 active:scale-[0.98] hover:scale-[1.02]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect for gradient buttons */}
        {(variant === "default" || variant === "gradient") && (
          <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer" />
        )}

        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {!loading && leftIcon && (
          <span className="mr-2 transition-transform duration-200 group-hover:scale-110">
            {leftIcon}
          </span>
        )}

        <span className="relative z-10">{children}</span>

        {!loading && rightIcon && (
          <span className="ml-2 transition-transform duration-200 group-hover:scale-110">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
