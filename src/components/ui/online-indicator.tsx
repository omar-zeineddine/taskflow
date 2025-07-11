import { cn } from "@/lib/utils";

type OnlineIndicatorProps = {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
};

export function OnlineIndicator({
  isOnline,
  size = "md",
  className,
  showText = false,
}: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className={cn(
          "rounded-full border-2 border-background",
          sizeClasses[size],
          isOnline
            ? "bg-green-500 shadow-green-500/50 shadow-sm"
            : "bg-gray-400",
        )}
        title={isOnline ? "Online" : "Offline"}
      />
      {showText && (
        <span className={cn(
          "font-medium",
          textSizeClasses[size],
          isOnline ? "text-green-600" : "text-gray-500",
        )}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </div>
  );
}
