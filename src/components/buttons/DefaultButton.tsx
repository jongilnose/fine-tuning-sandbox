export interface ButtonProps {
  label: string | JSX.Element;
  className?: string;
  bgColor?: string;
  color?: string;
  isLoading: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function DefaultButton({ label, className, bgColor, color, isLoading, onClick }: ButtonProps) {
  return (
    <button
      className={`inline-flex rounded-md bg-white px-3 color-gray py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={isLoading}
      style={{
        backgroundColor: bgColor,
        color: color,
      }}
      onClick={onClick}
    >
      {isLoading ? (
        <svg className="animate-spin ml-1 mr-3 h-5 w-5 text-gray" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {label}
    </button>
  );
}
