"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { VariantProps, cva } from "class-variance-authority@0.7.1";
import { PanelLeftIcon } from "lucide-react@0.487.0";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a Sidebar component",
    );
  }
  return context;
}

function Sidebar({
  className,
  defaultState = "expanded",
  withSheet = true,
  withContent = true,
  withHeader = true,
  withFooter = true,
  withInput = true,
  children,
  ...props
}) {
  const { isMobile } = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [state, setState] = React.useState(defaultState);

  React.useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile]);

  React.useEffect(() => {
    const down = (e) => {
      if (
        e.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (e.metaKey || e.ctrlKey) &&
        !isMobile
      ) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isMobile]);

  React.useEffect(() => {
    const cookieState = getCookie(SIDEBAR_COOKIE_NAME);
    if (
      (cookieState === "expanded" || cookieState === "collapsed") &&
      !isMobile
    ) {
      setState(cookieState);
    } else if (isMobile) {
      setState("collapsed");
    } else if (!isMobile) {
      setState("expanded");
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile((openMobile) => !openMobile);
    } else {
      setState((state) => {
        const newState = state === "expanded" ? "collapsed" : "expanded";
        setCookie(SIDEBAR_COOKIE_NAME, newState, {
          maxAge: SIDEBAR_COOKIE_MAX_AGE,
        });
        return newState;
      });
    }
  };

  const contextValue = {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  };

  const sheet = (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent
        data-slot="sidebar-sheet"
        data-side="left"
        className="w-auto p-0"
      >
        <SidebarHeader data-sheet={true}>
          <SidebarTitle>Menu</SidebarTitle>
          <SidebarDescription>
            Navigate through the application
          </SidebarDescription>
        </SidebarHeader>
        <Separator />
        {withInput && <SidebarInput data-sheet={true} />}
        {withContent && <SidebarContent data-sheet={true}>{children}</SidebarContent>}
        {withFooter && <SidebarFooter data-sheet={true} />}
      </SheetContent>
    </Sheet>
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {withSheet && sheet}
      <aside
        data-slot="sidebar"
        data-state={state}
        data-collapsible={state === "collapsed" ? "icon" : "drawer"}
        className={cn(
          "bg-sidebar text-sidebar-foreground group/sidebar data-[state=expanded]:w-sidebar data-[state=collapsed]:w-sidebar-icon data-[state=expanded]:data-[collapsible=drawer]:w-sidebar data-[state=collapsed]:data-[collapsible=icon]:w-sidebar-icon fixed top-0 z-40 flex h-dvh w-auto flex-col border-r transition-[width] data-[collapsible=drawer]:sm:w-sidebar data-[collapsible=icon]:sm:w-sidebar-icon",
          "max-sm:data-[state=expanded]:w-sidebar-mobile max-sm:data-[state=expanded]:data-[collapsible=drawer]:w-sidebar-mobile",
          isMobile && "hidden",
          className,
        )}
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        }}
        {...props}
      >
        {withHeader && <SidebarHeader />}
        {withInput && <SidebarInput />}
        {withContent && <SidebarContent>{children}</SidebarContent>}
        {withFooter && <SidebarFooter />}
      </aside>
      <div
        data-slot="sidebar-pusher"
        data-state={state}
        className={cn(
          "data-[state=expanded]:sm:pl-sidebar data-[state=collapsed]:sm:pl-sidebar-icon transition-[padding-left]",
          isMobile && "pl-0",
        )}
      />
    </SidebarContext.Provider>
  );
}

function SidebarHeader({
  className,
  "data-sheet": dataSheet,
  ...props
}) {
  const { isMobile, toggleSidebar, openMobile, setOpenMobile } =
    useSidebarContext();

  return (
    <div
      data-slot="sidebar-header"
      data-sheet={dataSheet}
      className={cn(
        "flex h-14 items-center justify-between p-3 data-[sheet=true]:hidden",
        className,
      )}
      {...props}
    >
      <SidebarTitle />
      <Button
        data-slot="sidebar-toggle"
        size="icon"
        variant="ghost"
        className="size-7"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon className="size-4" />
      </Button>
    </div>
  );
}

function SidebarTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-title"
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    >
      <span className="font-semibold">Logo</span>
    </div>
  );
}

function SidebarDescription({
  className,
  ...props
}) {
  return (
    <SheetDescription
      data-slot="sidebar-description"
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  "data-sheet": dataSheet,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-input"
      data-sheet={dataSheet}
      className={cn(
        "p-3 group-data-[collapsible=icon]:px-1.5 data-[sheet=true]:px-3",
        className,
      )}
      {...props}
    >
      <Input
        data-slot="sidebar-input-field"
        className="group-data-[collapsible=icon]:hidden data-[sheet=true]:block"
        placeholder="Search..."
      />
      <Button
        data-slot="sidebar-input-field-icon"
        variant="ghost"
        size="icon"
        className="hidden size-7 group-data-[collapsible=icon]:flex data-[sheet=true]:hidden"
      >
        <PanelLeftIcon className="size-4" />
      </Button>
    </div>
  );
}

function SidebarContent({
  className,
  asChild,
  "data-sheet": dataSheet,
  ...props
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-content"
      data-sheet={dataSheet}
      className={cn(
        "flex h-full flex-col overflow-y-auto data-[sheet=true]:p-3",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({
  className,
  "data-sheet": dataSheet,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sheet={dataSheet}
      className={cn(
        "mt-auto flex flex-col gap-2 p-3 data-[sheet=true]:hidden",
        className,
      )}
      {...props}
    >
      <Separator />
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarInset>
          <SidebarButton>
            <span>Login</span>
          </SidebarButton>
        </SidebarInset>
      </SidebarGroup>
    </div>
  );
}

function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn(
        "flex flex-col gap-1 group-data-[collapsible=icon]:px-1.5",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "text-muted-foreground px-2 text-xs font-semibold uppercase group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group-action"
      className={cn(
        "hidden group-data-[collapsible=icon]:block group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:text-xs group-data-[collapsible=icon]:font-semibold group-data-[collapsible=icon]:uppercase",
        className,
      )}
      {...props}
    >
      •••
    </div>
  );
}

function SidebarGroupContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  );
}

function SidebarButton({
  className,
  asChild,
  size = "md",
  isActive = false,
  ...props
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="sidebar-button"
      data-sidebar="button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground group/sidebar-button flex h-9 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarButtonIcon({
  className,
  ...props
}) {
  return (
    <Slot
      data-slot="sidebar-button-icon"
      className={cn(
        "text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarButtonLabel({
  className,
  ...props
}) {
  return (
    <span
      data-slot="sidebar-button-label"
      className={cn("truncate", className)}
      {...props}
    />
  );
}

function SidebarButtonLoading({
  className,
  ...props
}) {
  return (
    <Skeleton
      data-slot="sidebar-button-loading"
      className={cn("size-9 rounded-md", className)}
      {...props}
    />
  );
}

function SidebarMenu({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-menu"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarMenuButton({
  asChild,
  size = "md",
  isActive = false,
  withTooltip = true,
  withArrow = false,
  label,
  children,
  ...props
}) {
  const { state } = useSidebarContext();
  const Comp = asChild ? Slot : "button";
  const [open, setOpen] = React.useState(false);

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-state={open ? "open" : "closed"}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground group/sidebar-menu-button flex h-9 min-w-0 w-full items-center justify-between gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            child.props["data-slot"] === "sidebar-button-icon"
          ) {
            return child;
          }
          return null;
        })}
        <span
          data-slot="sidebar-menu-button-label"
          className="truncate group-data-[collapsible=icon]:hidden"
        >
          {label}
        </span>
      </div>
      {withArrow && (
        <PanelLeftIcon className="size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
      )}
    </Comp>
  );

  if (state === "collapsed" && withTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

function SidebarMenuSub({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-sub"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function SidebarMenuSubContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sidebar-menu-sub-content"
      className={cn("flex flex-col gap-px pl-6", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild,
  size = "md",
  isActive = false,
  ...props
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarButton,
  SidebarButtonIcon,
  SidebarButtonLabel,
  SidebarButtonLoading,
  SidebarTitle,
  SidebarDescription,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubContent,
  SidebarMenuSubButton,
  useSidebarContext,
};

// --- Cookie helpers (client-side only) ---
function setCookie(name, value, options = {}) {
  if (typeof document === "undefined") return;
  let cookieString = `${name}=${value}`;
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }
  document.cookie = cookieString;
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}