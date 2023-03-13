import QRCode from 'qrcode-generator';
import { Svg, Path } from '@react-pdf/renderer'; 

type QRProps = {
  value: string;
  type: 'react' | 'pdf';
  style?: React.CSSProperties;
}

function generarCodigoQR({ value, type, style }: QRProps) {
  // Generar el codigo QR con la libreria qrcode-generator
  const qr = QRCode(0, 'H');
  qr.addData(value);
  qr.make();

  // Construir el SVG a partir del codigo QR
  const tamaño = qr.getModuleCount() * 4;
  const tamañoCelda = tamaño / qr.getModuleCount();
  let path = '';
  for (let rowIndex = 0; rowIndex < qr.getModuleCount(); rowIndex++) {
    for (let cellIndex = 0; cellIndex < qr.getModuleCount(); cellIndex++) {
      if (qr.isDark(rowIndex, cellIndex)) {
        path += `M${cellIndex * tamañoCelda},${rowIndex * tamañoCelda} `;
        path += `h${tamañoCelda} v${tamañoCelda} h-${tamañoCelda} v-${tamañoCelda} `;
      }
    }
  }

  return (
    type === 'pdf' ? (
      <Svg viewBox={`0 0 ${tamaño} ${tamaño}`} style={{ width: '52px', height: '52px', marginLeft: '78px'}}>
        <Path d={path} fill="#000" />
      </Svg>
    ) : (
      <svg viewBox={`0 0 ${tamaño} ${tamaño}`} style={style}>
        <path d={path} fill="#000" />
      </svg>
    )
  )

}

export default generarCodigoQR;