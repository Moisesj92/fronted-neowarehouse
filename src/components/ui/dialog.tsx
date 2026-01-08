import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { Text } from "./text";

const sizes = {
  xs: "md:max-w-xs",
  sm: "md:max-w-sm",
  md: "md:max-w-md",
  lg: "md:max-w-lg",
  xl: "md:max-w-xl",
  "2xl": "md:max-w-2xl",
  "3xl": "md:max-w-3xl",
  "4xl": "md:max-w-4xl",
  "5xl": "md:max-w-5xl",
};

export function Dialog({
  size = "lg",
  className,
  children,
  ...props
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & Omit<Headless.DialogProps, "as" | "className">) {
  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 z-50 bg-zinc-950/25 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-zinc-950/50"
      />

      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
        <Headless.DialogPanel
          transition
          className={clsx(
            className,
            sizes[size],
            // Mobile: bottom sheet con 80% altura, scrollable
            "flex max-h-[80vh] w-full flex-col rounded-t-3xl bg-white shadow-lg ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline",
            // Desktop: centrado, altura auto
            "md:max-h-[90vh] md:rounded-2xl",
            // Transiciones
            "transition duration-200 will-change-transform",
            // Mobile: slide up desde abajo
            "translate-y-0 data-closed:translate-y-full data-enter:ease-out data-leave:ease-in",
            // Desktop: scale + fade
            "md:data-closed:translate-y-0 md:data-closed:scale-95 md:data-closed:opacity-0"
          )}
        >
          {children}
        </Headless.DialogPanel>
      </div>
    </Headless.Dialog>
  );
}

export function DialogTitle({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DialogTitleProps,
  "as" | "className"
>) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(
        className,
        "shrink-0 px-6 pt-6 text-lg/6 font-semibold text-balance text-zinc-950 md:px-8 md:pt-8 md:text-base/6 dark:text-white"
      )}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps<typeof Text>,
  "as" | "className"
>) {
  return (
    <Headless.Description
      as={Text}
      {...props}
      className={clsx(className, "mt-2 shrink-0 px-6 text-pretty md:px-8")}
    />
  );
}

export function DialogBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "mt-4 flex-1 overflow-y-auto px-6 md:mt-6 md:px-8"
      )}
    />
  );
}

export function DialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        // Sticky en la parte inferior, siempre visible
        "sticky bottom-0 mt-6 shrink-0 border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900",
        "flex flex-col-reverse items-center justify-end gap-3 *:w-full",
        "md:flex-row md:border-t-0 md:bg-transparent md:px-8 md:py-6 md:*:w-auto md:dark:bg-transparent"
      )}
    />
  );
}
