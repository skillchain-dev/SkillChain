import { QRCodeSVG } from 'qrcode.react';
export function QRCodePanel({ certificateId }) {
	const url = `${window.location.origin}/verify/${encodeURIComponent(certificateId)}`;
	return <section className="qr-panel"><QRCodeSVG value={url} size={176} bgColor="#ffffff" fgColor="#12221d" /><p>{url}</p></section>;
}
