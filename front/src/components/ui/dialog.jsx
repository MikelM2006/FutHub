// front/src/components/ui/dialog.jsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
import { XIcon } from "lucide-react@0.487.0";
import { cn } from "./utils";

function Dialog({ ...props }) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            data-slot="dialog-overlay"
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
                className,
            )}
            {...props}
        />
    );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(
    ({ className, children, size = "md", ...props }, ref) => {
        const sizeClasses = {
            sm: "w-[90vw] max-w-sm",
            md: "w-[90vw] max-w-lg",
            lg: "w-[92vw] max-w-2xl",
            xl: "w-[95vw] max-w-[1000px]",
        };

        return (
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    ref={ref}
                    data-slot="dialog-content"
                    className={cn(
                        // animations, position
                        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] fixed left-[50%] top-[50%] z-50",
                        // layout: flex column so inner area can flex/scroll
                        "translate-x-[-50%] translate-y-[-50%] flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-lg duration-200 sm:rounded-lg",
                        // fixed max size + overflow hidden (inner handles scroll)
                        "max-h-[85vh] overflow-hidden",
                        sizeClasses[size],
                        className,
                    )}
                    {...props}
                >
                    {children}
                    <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPortal>
        );
    },
);
DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

function DialogTitle({ className, ...props }) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-lg leading-none font-semibold", className)}
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
