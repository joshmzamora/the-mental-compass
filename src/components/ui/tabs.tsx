"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "./utils";

// Context to track the active tab within the Tabs component for animations
const TabsContext = React.createContext<{ activeValue?: string }>({ activeValue: undefined });

function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [activeValue, setActiveValue] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const handleValueChange = (val: string) => {
    if (value === undefined) {
      setActiveValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeValue }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        value={activeValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-gray-200/60 dark:bg-gray-800 shadow-inner text-muted-foreground inline-flex h-11 w-fit items-center justify-center rounded-2xl p-1.5 flex transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative text-gray-600 dark:text-gray-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 z-10",
        className,
      )}
      {...props}
    >
      <span className="relative z-20">{children}</span>
      {isActive && (
        <motion.div
            layoutId="active-tab-indicator"
             className="absolute inset-0 bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-100 dark:border-gray-600 z-10"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none mt-4", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
