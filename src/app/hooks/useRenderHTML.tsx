import { useEffect, useState } from 'react';

export const useRenderHTML = (initialHTML: string): JSX.Element => {
  const [html, setHTML] = useState<string>(initialHTML);

  useEffect(() => {
    // Realiza cualquier lógica adicional aquí si es necesario
    // Puedes modificar el HTML en función de las actualizaciones de estado u otras condiciones

    // Por ejemplo, aquí se cambia el HTML cada vez que el estado `html` cambia
    setHTML(initialHTML);
  }, [initialHTML]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
