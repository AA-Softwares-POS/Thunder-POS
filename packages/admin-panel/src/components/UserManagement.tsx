'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../lib/api';
import { Modal } from '../components/Modal';
import { toast } from 'react-hot-toast';

export default function UserManagement({ role }: { role: string }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await apiRequest('/users', { method: 'POST', body: data });
      setIsAddOpen(false);
      reset();
      toast.success('User created successfully');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {role === 'ADMIN' && (
        <button onClick={() => setIsAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add User
        </button>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('email')} placeholder="Email" className="w-full p-2 border" required />
          <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border" required />
          <select {...register('role')} className="w-full p-2 border">
            <option value="CASHIER">Cashier</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white p-2">Submit</button>
        </form>
      </Modal>
    </div>
  );
}
