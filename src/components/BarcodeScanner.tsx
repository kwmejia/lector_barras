

import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const webcamRef = useRef<Webcam | null>(null);

  useEffect(() => {
    if (webcamRef.current) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            facingMode: 'environment',
          },
          target: webcamRef.current.video,
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader'],
        },

      }, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      });
      Quagga.onDetected((data: any) => {
        if (data && data.codeResult) {
          onDetected(data.codeResult.code);
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [onDetected]);
  return (
    <Webcam
      ref={webcamRef as any}
      videoConstraints={{
        facingMode: 'environment'
      }}
    />
  );
};

export default BarcodeScanner;
