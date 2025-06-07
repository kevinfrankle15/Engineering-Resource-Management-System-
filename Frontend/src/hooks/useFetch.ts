import { useEffect, useState } from 'react';

export default function useFetch<T>(fetchFn: () => Promise<any>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFn()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to fetch'))
      .finally(() => setLoading(false));
  }, [fetchFn]);

  return { data, loading, error };
}
