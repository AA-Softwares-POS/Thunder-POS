'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../lib/api';
import { Modal } from '../components/Modal';

export default function ProductManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await apiRequest('/inventory/products', { 
        method: 'POST', 
        body: JSON.stringify({ ...data, price: parseFloat(data.price), cost: parseFloat(data.cost), stock: parseInt(data.stock) }) 
      });
      setIsAddOpen(false);
      reset();
      alert('Product created');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <button onClick={() => setIsAddOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded">
        Add Product
      </button>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Product">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name')} placeholder="Name" className="w-full p-2 border" required />
          <input {...register('sku')} placeholder="SKU" className="w-full p-2 border" required />
          <input {...register('price')} type="number" placeholder="Price" className="w-full p-2 border" required />
          <input {...register('cost')} type="number" placeholder="Cost" className="w-full p-2 border" required />
          <input {...register('stock')} type="number" placeholder="Initial Stock" className="w-full p-2 border" />
          <button type="submit" className="w-full bg-green-600 text-white p-2">Submit</button>
        </form>
      </Modal>
    </div>
  );
}
