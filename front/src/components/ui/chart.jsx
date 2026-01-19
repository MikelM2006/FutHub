"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts@2.15.2";

import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" };

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "relative flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis_line]:stroke-border [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-polar-grid_[cx=50%][cy=50%]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle]:[--color:var(--chart-primary)] [&_.recharts-dot]:[--color:var(--chart-primary)] [&_.recharts-label_text]:fill-foreground [&_.recharts-layer:has(path[name])]:[--color:var(--chart-primary)] [&_.recharts-reference-line_line]:stroke-border [&_.recharts-area-area]:[--color:var(--chart-primary)]",
          "[&_.recharts-bar-bar]:[--color:var(--chart-primary)]",
          "[&_.recharts-line-line]:[--color:var(--chart-primary)]",
          "[&_.recharts-sector-sector]:[--color:var(--chart-primary)]",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.color || config.theme,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, config]) => {
    const color = config.color || (config.theme && config.theme.light);
    const colorDark = config.color || (config.theme && config.theme.dark);

    return `
  --chart-${key}: ${color};
  ${THEMES.dark} {
    --chart-${key}: ${colorDark};
  }
`;
  })
  .join("\n")}
}
`,
      }}
    />
  );
}

function ChartTooltip({
  className,
  ...props
}) {
  return (
    <RechartsPrimitive.Tooltip
      cursor={false}
      wrapperStyle={{ outline: "none" }}
      contentStyle={{ display: "none" }}
      {...props}
    />
  );
}

function ChartTooltipContent({
  className,
  hideLabel,
  hideIndicator,
  indicator = "dot",
  labelKey,
  nameKey,
  ...props
}) {
  const { config } = useChart();

  const payload = props.payload || [];

  if (!payload.length) {
    return null;
  }

  const rValues = payload.map((p) => p.value);
  const rDataKeys = payload.map((p) => p.dataKey || "value");

  const [itemConfig, firstItemConfig] = React.useMemo(() => {
    const firstPayload = payload[0];
    const rNameKey = nameKey || firstPayload.name || "value";
    const rLabelKey = labelKey || firstPayload.payload.label || "label";

    const rItemConfig = getPayloadConfigFromPayload(
      config,
      firstPayload,
      rNameKey,
    );
    const rFirstItemConfig = config[rDataKeys[0]];

    return [rItemConfig, rFirstItemConfig];
  }, [config, labelKey, nameKey, payload, rDataKeys]);

  const label = React.useMemo(() => {
    if (hideLabel || !props.label) {
      return null;
    }

    if (itemConfig?.label) {
      return itemConfig.label;
    }

    if (firstItemConfig?.label) {
      return firstItemConfig.label;
    }

    return props.label;
  }, [hideLabel, itemConfig, firstItemConfig, props.label]);

  return (
    <div
      data-slot="chart-tooltip-content"
      className={cn(
        "z-50 min-w-32 rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg transition-all",
        className,
      )}
      {...props}
    >
      {label ? (
        <div data-slot="chart-tooltip-label" className="font-medium">
          {label}
        </div>
      ) : null}
      <div data-slot="chart-tooltip-items" className="flex flex-col gap-1.5">
        {payload.map((item, i) => {
          const key = item.dataKey || "value";
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const color =
            item.color || itemConfig?.color || "var(--chart-primary)";

          return (
            <div
              key={item.key || `item-${i}`}
              data-slot="chart-tooltip-item"
              className={cn(
                "flex items-center gap-1.5",
                hideIndicator && "items-end",
              )}
            >
              {!hideIndicator &&
                (indicator === "line" ? (
                  <div
                    data-slot="chart-tooltip-indicator"
                    className="h-2.5 w-0.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: color,
                    }}
                  />
                ) : (
                  <div
                    data-slot="chart-tooltip-indicator"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: color,
                    }}
                  />
                ))}
              <div
                data-slot="chart-tooltip-item-content"
                className={cn(
                  "flex items-baseline gap-1.5",
                  !hideIndicator && "flex-1 justify-between",
                )}
              >
                <div data-slot="chart-tooltip-item-name" className="text-xs">
                  {itemConfig?.label || item.name}
                </div>
                {item.value ? (
                  <div
                    data-slot="chart-tooltip-item-value"
                    className="text-right text-xs font-medium"
                  >
                    {item.value.toLocaleString()}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({
  className,
  hideIcon,
  ...props
}) {
  const { config } = useChart();

  if (!props.payload?.length) {
    return null;
  }

  return (
    <ChartLegendContent
      className={className}
      hideIcon={hideIcon}
      payload={props.payload}
    />
  );
}

function ChartLegendContent({
  className,
  hideIcon,
  payload,
}) {
  const { config } = useChart();

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5",
        className,
      )}
    >
      {payload.map((item) => {
        const key = item.dataKey?.toString() || item.value?.toString() || "value";
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            data-slot="chart-legend-item"
            className={cn(
              "flex items-center gap-1.5",
              item.inactive && "opacity-50",
              "[&>svg]:size-3",
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config,
  payload,
  key,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey = key;

  if (
    key in payload &&
    typeof payload[key] === "string"
  ) {
    configLabelKey = payload[key];
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key];
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
};