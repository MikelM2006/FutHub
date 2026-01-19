import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu@1.2.5";
import { cva } from "class-variance-authority@0.7.1";
import { ChevronDownIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("group/navigation-menu-item relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground group inline-flex h-9 w-max items-center justify-center gap-1 rounded-sm bg-transparent px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[active]:bg-accent/50 [&_svg:not([class*='size-'])]:size-4",
);

function NavigationMenuTrigger({
  className,
  children,
  showIndicator = true,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}
      {showIndicator && (
        <ChevronDownIcon
          className="relative top-px ml-1 size-3 transition duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      )}
    </NavigationMenuPrimitive.Trigger>
  );
}

const NavigationMenuContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <NavigationMenuPrimitive.Content
        ref={ref}
        data-slot="navigation-menu-content"
        className={cn(
          "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 left-0 top-0 w-auto",
          "sm:absolute sm:w-full sm:auto-rows-min",
          "data-[viewport=false]:sm:max-h-96 data-[viewport=true]:sm:max-h-[var(--radix-navigation-menu-viewport-height)]",
          "data-[viewport=false]:sm:overflow-y-auto data-[viewport=true]:sm:overflow-hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuViewport = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        data-slot="navigation-menu-viewport-wrapper"
        className={cn(
          "sm:absolute sm:left-0 sm:top-full sm:flex sm:justify-center",
        )}
      >
        <NavigationMenuPrimitive.Viewport
          data-slot="navigation-menu-viewport"
          className={cn(
            "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:relative sm:mt-1.5 sm:h-[var(--radix-navigation-menu-viewport-height)] sm:w-[var(--radix-navigation-menu-viewport-width)] sm:overflow-hidden sm:rounded-md sm:border sm:shadow-lg",
            "data-[state=open]:sm:animate-in data-[state=closed]:sm:animate-out data-[state=closed]:sm:fade-out-0 data-[state=open]:sm:fade-in-0 data-[state=closed]:sm:zoom-out-95 data-[state=open]:sm:zoom-in-90",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
NavigationMenuViewport.displayName = "NavigationMenuViewport";

function NavigationMenuLink({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};