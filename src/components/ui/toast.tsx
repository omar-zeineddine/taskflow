import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

import type { AppError } from "@/stores/error";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useErrorStore } from "@/stores/error";

type ToastProps = {
  error: AppError;
};

export function Toast({ error }: ToastProps) {
  const { removeError } = useErrorStore();

  const getIcon = () => {
    switch (error.type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (error.type) {
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-800";
      default:
        return "border-green-200 bg-green-50 text-green-800";
    }
  };

  return (
    <Card className={cn("w-full max-w-sm shadow-lg", getStyles())}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{error.message}</p>
            {error.details && (
              <p className="text-xs mt-1 opacity-75">{error.details}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {error.action && (
              <Button
                size="sm"
                variant="ghost"
                onClick={error.action.handler}
                className="h-6 px-2 text-xs"
              >
                {error.action.label}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeError(error.id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ToastContainer() {
  const { errors } = useErrorStore();

  if (errors.length === 0)
    return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {errors.map(error => (
        <Toast key={error.id} error={error} />
      ))}
    </div>
  );
}
