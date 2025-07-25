interface SearchIconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const SearchIcon = ({
  className = '',
  color = '#666666',
  size = 20
}: SearchIconProps) => (
  <svg
    className={`search-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
