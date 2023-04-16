import { useState, useEffect } from "react";
import axios from 'axios';

type rifaFetch = {
  id: number;
  awardSign: string;
  awardNoSign: string | null;
  plate: string | null;
  year: number | null;
  price: number;
  loteria: string;
  rifero_id: number;
  money: number;
} 

export default function useLastRifas(rifero_id: number) {
  const [rifas, setRifas] = useState<rifaFetch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getRifas() {
      try {
        const response = await axios.get(`https://rifa-max.com/api/v1/last_rifas${rifero_id}`);
        setRifas(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }

    getRifas();
  }, [rifero_id]);

  return { rifas, loading, error };
}