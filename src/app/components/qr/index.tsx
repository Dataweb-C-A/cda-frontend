import QRCode from 'qrcode.react'

type Props = {
  value: string
  documentId: string
  size?: number
  margin?: boolean
}

function QRCodeGenerator({value, documentId, size, margin}: Props) {
  return (
    <div>
      <QRCode 
        id={documentId}
        value={value} 
        size={size || 14}
        bgColor={'#FFFFFF'}
        fgColor={'#000000'}
        includeMargin={ margin || true }
        level={'H'}
      />
    </div>
  )
}

export default QRCodeGenerator