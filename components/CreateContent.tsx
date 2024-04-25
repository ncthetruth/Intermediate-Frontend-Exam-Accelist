import { useRouter } from 'next/router';
import { useState } from 'react';

const CreateDataComponent = () => {
    const router = useRouter()
  const [formData, setFormData] = useState({
    description: '',
    orderFrom: '',
    orderTo: '',
    orderedAt: '',
    jumlahItem: 1,
  });

  const [errors, setErrors] = useState({
    description: '',
    orderFrom: '',
    orderTo: '',
    orderedAt: '',
    jumlahItem: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'description' && value.length > 100) {
      setErrors({ ...errors, [name]: 'Description maksimal 100 karakter.' });
    } else if ((name === 'orderFrom' || name === 'orderTo') && value.length < 1) {
      setErrors({ ...errors, [name]: 'Field ini wajib diisi.' });
    } else if (name === 'orderedAt' && new Date(value) < new Date()) {
      setErrors({ ...errors, [name]: 'Tanggal harus setelah hari ini.' });
    } else if (name === 'jumlahItem' && (parseInt(value) < 1 || parseInt(value) > 99)) {
      setErrors({ ...errors, [name]: 'Jumlah item harus diantara 1 dan 99.' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/be/api/v1/Order/CreateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          orderFrom: formData.orderFrom,
          orderTo: formData.orderTo,
          quantity: formData.jumlahItem,
          orderedAt: formData.orderedAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      console.log('Data submitted successfully!');
      router.push('/')
      
      
      setFormData({
        description: '',
        orderFrom: '',
        orderTo: '',
        orderedAt: '',
        jumlahItem: 1,
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-600">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="orderFrom" className="block text-sm font-semibold text-gray-600">Order From:</label>
        <input type="text" id="orderFrom" name="orderFrom" value={formData.orderFrom} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
        {errors.orderFrom && <p className="text-red-500 text-xs mt-1">{errors.orderFrom}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="orderTo" className="block text-sm font-semibold text-gray-600">Order To:</label>
        <input type="text" id="orderTo" name="orderTo" value={formData.orderTo} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
        {errors.orderTo && <p className="text-red-500 text-xs mt-1">{errors.orderTo}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="orderedAt" className="block text-sm font-semibold text-gray-600">Ordered At:</label>
        <input type="date" id="orderedAt" name="orderedAt" value={formData.orderedAt} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
        {errors.orderedAt && <p className="text-red-500 text-xs mt-1">{errors.orderedAt}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="jumlahItem" className="block text-sm font-semibold text-gray-600">Jumlah Item:</label>
        <input type="number" id="jumlahItem" name="jumlahItem" value={formData.jumlahItem.toString()} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
        {errors.jumlahItem && <p className="text-red-500 text-xs mt-1">{errors.jumlahItem}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
    </form>
  );
};

export default CreateDataComponent;
