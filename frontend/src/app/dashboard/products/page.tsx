'use client';
import { useEffect, useState } from 'react';
import { productsAPI } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll()
      .then(r => {
        const data = r.data;
        setProducts(Array.isArray(data) ? data : data?.products || data?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl text-white mb-1">Products</h1>
      <p className="text-slate-400 text-sm mb-6">AERIX AI product catalog</p>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-400">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p: any) => (
            <div key={p._id} className="card">
              <h3 className="text-white font-semibold mb-1">{p.name}</h3>
              <p className="text-slate-400 text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
