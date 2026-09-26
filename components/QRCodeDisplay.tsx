'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 120,
  className = '',
  darkColor = '#000000',
  lightColor = '#ffffff',
  label,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  const activeUrl = value ? dataUrl : '';

  if (error || !activeUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center border border-dashed border-gray-400 p-2 text-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[10px] text-gray-500 font-mono break-all">QR Code</span>
        {label && <span className="text-[8px] text-gray-400 mt-1">{label}</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeUrl}
        alt={`QR Code pour ${value}`}
        width={size}
        height={size}
        className="block rounded-sm print:block"
        style={{ imageRendering: 'pixelated', width: size, height: size }}
      />
      {label && (
        <span className="text-[9px] text-gray-600 mt-1 font-mono tracking-tight text-center">
          {label}
        </span>
      )}
    </div>
  );
};

export default QRCodeDisplay;
