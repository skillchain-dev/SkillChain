import { QRCodeSVG } from 'qrcode.react';

export function QRCodePanel({ certificateId }) {
  const url = `${window.location.origin}/verify/${encodeURIComponent(certificateId)}`;
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-mist-100 text-center">
      <div className="p-2 bg-white rounded shadow-sm border border-mist-100">
        <QRCodeSVG value={url} size={150} bgColor="#ffffff" fgColor="#153d35" level="M" />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 text-xs font-mono text-clay-600 hover:text-clay-700 underline break-all max-w-full"
      >
        {url}
      </a>
    </div>
  );
}
