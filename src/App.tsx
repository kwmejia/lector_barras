import React, { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';

const App: React.FC = () => {

  const [codigos, setCodigos] = useState()
  const handleBarcodeDetected = (code: string) => {
    console.log("Código de barras detectado:", code);
    // Aquí puedes procesar el código de barras, guardar en un estado, enviar a un servidor, etc.
    setCodigos(codigos)
  };

  return (
    <div className="App">
      <h1>Escáner de Códigos de Barras</h1>
      <BarcodeScanner onDetected={handleBarcodeDetected} />
      <pre>{JSON.stringify(codigos)}</pre>

    </div>
  );
}

export default App;
