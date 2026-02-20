import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-silver-300 dark:border-silver-600 bg-white dark:bg-[#252528] px-3 py-2 text-sm text-silver-900 dark:text-silver-100 placeholder:text-silver-500 dark:placeholder:text-silver-400 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
