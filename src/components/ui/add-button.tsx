import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ElementType;
}

/**
 * Shared primary "add" button — dùng thống nhất ở mọi toolbar để đảm bảo
 * màu sắc, kích thước, icon nhất quán trên toàn ứng dụng.
 */
export function AddButton({ onClick, label, className, disabled, icon: Icon = Plus }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="sm"
      className={cn(
        "h-9 gap-1.5 px-4 font-medium shadow-sm",
        className
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </Button>
  );
}
