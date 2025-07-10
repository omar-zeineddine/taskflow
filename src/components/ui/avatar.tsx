import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  email?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar({ name, email, size = "md", className }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full text-white font-medium",
        sizeClasses[size],
        getAvatarColor(name),
        className,
      )}
      title={email ? `${name} (${email})` : name}
    >
      {getInitials(name)}
    </div>
  );
}
