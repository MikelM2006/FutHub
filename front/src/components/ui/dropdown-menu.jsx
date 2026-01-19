"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu@2.1.6";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

function DropdownMenu({
  ...props
}) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          data-slot="dropdown-menu-content"
          sideOffset={sideOffset}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 origin-[--radix-dropdown-menu-content-transform-origin] overflow-hidden rounded-md border p-1 shadow-lg",
            className,
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    );
  },
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        data-slot="dropdown-menu-item"
        data-inset={inset}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8",
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        data-slot="dropdown-menu-checkbox-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        checked={checked}
        {...props}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <CheckIcon className="size-4" />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    );
  },
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.RadioItem
        ref={ref}
        data-slot="dropdown-menu-radio-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator>
            <CircleIcon className="size-2 fill-current" />
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </DropdownMenuPrimitive.RadioItem>
    );
  },
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.Label
        ref={ref}
        data-slot="dropdown-menu-label"
        data-inset={inset}
        className={cn(
          "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.Separator
        ref={ref}
        data-slot="dropdown-menu-separator"
        className={cn("bg-border -mx-1 my-1 h-px", className)}
        {...props}
      />
    );
  },
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

function DropdownMenuShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

const DropdownMenuGroup = React.forwardRef(
  (props, ref) => {
    return (
      <DropdownMenuPrimitive.Group
        ref={ref}
        data-slot="dropdown-menu-group"
        {...props}
      />
    );
  },
);
DropdownMenuGroup.displayName = "DropdownMenuGroup";

const DropdownMenuRadioGroup = React.forwardRef(
  (props, ref) => {
    return (
      <DropdownMenuPrimitive.RadioGroup
        ref={ref}
        data-slot="dropdown-menu-radio-group"
        {...props}
      />
    );
  },
);
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

function DropdownMenuSub({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
  );
}

const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        data-slot="dropdown-menu-sub-trigger"
        data-inset={inset}
        className={cn(
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto size-4" />
      </DropdownMenuPrimitive.SubTrigger>
    );
  },
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        data-slot="dropdown-menu-sub-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-[--radix-dropdown-menu-content-transform-origin] overflow-hidden rounded-md border p-1 shadow-lg",
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
};