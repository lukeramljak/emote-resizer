type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      className={`rounded-lg bg-button px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-button/70 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 ${className}`}
      {...props}
    />
  );
};
