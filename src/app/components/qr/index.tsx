import QRCode from 'qrcode-generator';
import { Svg, Path } from '@react-pdf/renderer'; 

type IQRCode = {
  value: string;
  type: 'react' | 'pdf';
  style?: React.CSSProperties;
}

function QRCodegenerator({ value, type, style }: IQRCode) {
  const qr = QRCode(0, 'H');
  qr.addData(value);
  qr.make();

  const size = qr.getModuleCount() * 4;
  const cellSize = size / qr.getModuleCount();
  let path = '';
  for (let rowIndex = 0; rowIndex < qr.getModuleCount(); rowIndex++) {
    for (let cellIndex = 0; cellIndex < qr.getModuleCount(); cellIndex++) {
      if (qr.isDark(rowIndex, cellIndex)) {
        path += `M${cellIndex * cellSize},${rowIndex * cellSize}`;
        path += `h${cellSize} v${cellSize} h-${cellSize} v-${cellSize} `;
      }
    }
  }

  return (
    type === 'pdf' ? (
      <Svg viewBox={`0 0 ${size} ${size}`} style={{ width: '52px', height: '52px', marginLeft: '74px'}}>
        <Path d={path} fill="#000" />
      </Svg>
    ) : (
      <svg viewBox={`0 0 ${size} ${size}`} style={style}>
        <path d={path} fill="#000" />
      </svg>
    )
  )
}

export default QRCodegenerator;
