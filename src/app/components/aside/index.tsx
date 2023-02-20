import { Box } from '@mantine/core';

type AsideProps = {
  children: React.ReactNode;
}

export default function Aside({ children }: AsideProps) {
  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '25%',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </Box>
  );
}
