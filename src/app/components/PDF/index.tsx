import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import List from '../list';

interface PDFProps {
  items: string[];
}

const PDF: React.FC<PDFProps> = ({ items }) => (
  <Document>
    <Page>
      <List items={items} />
    </Page>
  </Document>
);

export default PDF;
