export const size = {
  width: 192,
  height: 192,
} as const;

export const contentType = 'image/svg+xml';

export default function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="32" fill="#ffffff"/>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0d9488"/>
          <stop offset="100%" style="stop-color:#14b8a6"/>
        </linearGradient>
      </defs>
      <text x="96" y="106" font-family="Vazirmatn, system-ui, sans-serif" font-size="48" font-weight="bold" fill="url(#grad)" text-anchor="middle">BR</text>
    </svg>
  );
}
