interface LoaderProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const Loader = ({
  size = "md",
  message,
  className = "",
}: LoaderProps) => {
  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <div
          className={`animate-spin rounded-full border-b-2 border-gray-600 ${sizeMap[size]}`}
        />
        {message && <span className="text-sm text-gray-600">{message}</span>}
      </div>
    </div>
  );
};
