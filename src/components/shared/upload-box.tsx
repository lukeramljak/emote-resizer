interface UploadBoxProps {
  title: string;
  subtitle?: string;
  description: string;
  accept: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadBox = ({
  title,
  subtitle,
  description,
  accept,
  onChange,
}: UploadBoxProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-white">{title}</p>
        {subtitle && (
          <p className="inline-block rounded-full border border-white/30 bg-white/5 px-2 py-0.5 text-center text-sm text-white/60">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex w-72 flex-col items-center justify-center gap-4 rounded-xl border border-white/30 bg-twitch-dark p-6 backdrop-blur-sm">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Upload icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-gray-400">Drag and Drop</p>
        <p className="text-sm text-gray-500">or</p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-twitch-purple px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-twitch-purple/70 focus:outline-none focus:ring-2 focus:ring-twitch-purple focus:ring-opacity-75">
          <span>{description}</span>
          <input
            type="file"
            onChange={onChange}
            accept={accept}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
