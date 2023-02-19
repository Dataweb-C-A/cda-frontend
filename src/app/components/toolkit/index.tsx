import React from 'react'
import { Button, MantineSize } from '@mantine/core'

type ToolkitProps = {
  color?: string
  variant?: "gradient" | "light" | "filled" | "outline" | "white" | "default" | "subtle" | undefined
  size?: MantineSize | undefined
  style?: React.CSSProperties
  onClick?: () => void
  children?: React.ReactNode
}

function Toolkit({color, variant, size, style, onClick, children}: ToolkitProps) {
  return (
    <div className="toolkit" style={{ marginTop: '10px'}}>
      <Button
        color={color}
        variant={variant}
        size={size}
        style={style}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}

export default Toolkit
