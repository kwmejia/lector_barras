import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';
import Swal from 'sweetalert2';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const webcamRef = useRef<Webcam | null>(null);

  const showAlertError = (msg: string) => {
    Swal.fire({
      title: msg,
      icon: 'error',
      timer: 5000,
      confirmButtonColor: "#c3d730",
      iconColor: "#dc2626"
    });
  }

  const showAlertSuccess = (msg: string) => {
    Swal.fire({
      title: msg,
      icon: 'success',
      timer: 5000,
      confirmButtonColor: "#0B4A75",
      iconColor: "#c3d730"
    });
  }

  useEffect(() => {
    if (webcamRef.current) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            facingMode: 'environment',
          },
          target: webcamRef.current.video,
          area: { // Define el área de escaneo
            top: "0%",    // Empieza en la parte superior del contenedor
            right: "0%",  // Empieza en el lado derecho del contenedor
            left: "0%",   // Empieza en el lado izquierdo del contenedor
            bottom: "0%"  // Empieza en la parte inferior del contenedor
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency,
        frequency: 10,
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader'],
        },
        locate: true,
      }, (err: any) => {
        if (err) {
          console.error('Error al inicializar Quagga:', err);
          showAlertError(err)
          return;
        }
        console.log('Inicialización de Quagga exitosa');
        Quagga.start();
      });

      Quagga.onDetected((data: any) => {
        console.log('Código de barras detectado:', data.codeResult.code);
        showAlertSuccess('Código de barras detectado: '+ data.codeResult.code)
        if (data && data.codeResult) {
          onDetected(data.codeResult.code);
        }
      });

      Quagga.onProcessed((result: any) => {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box: any) {
              return box !== result.box;
            }).forEach(function (box: any) {
              Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
          }
        }
      });

      return () => {
        Quagga.offDetected();
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
