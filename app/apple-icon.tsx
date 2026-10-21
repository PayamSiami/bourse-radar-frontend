export const size = {
  width: 180,
  height: 180,
} as const;

export const contentType = 'image/svg+xml';

export default function AppleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
      <rect width="180" height="180" rx="32" fill="#ffffff" />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0d9488" />
          <stop offset="100%" style="stop-color:#14b8a6" />
        </linearGradient>
      </defs>
      <text x="90" y="100" font-family="Vazirmatn, system-ui, sans-serif" font-size="54" font-weight="bold" fill="url(#grad)" text-anchor="middle">BR</text>
    </svg>
  );
}
