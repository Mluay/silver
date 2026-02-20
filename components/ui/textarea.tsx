import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-silver-300 dark:border-silver-600 bg-white dark:bg-[#252528] px-3 py-2 text-sm text-silver-900 dark:text-silver-100 placeholder:text-silver-500 dark:placeholder:text-silver-400 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-light focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
