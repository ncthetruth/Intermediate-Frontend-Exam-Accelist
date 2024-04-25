import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const EditOrderForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [orderData, setOrderData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`/api/be/api/v1/Order/OrderDetail/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrderData(data);
        } else {
          throw new Error('Failed to fetch order data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const validateForm = () => {
    const errors: any = {};

    if (!orderData.description || orderData.description.length > 100) {
      errors.description = 'Description is required and must be maximum 100 characters';
    }
    if (!orderData.orderFrom || orderData.orderFrom.length < 1) {
      errors.orderFrom = 'Order From is required';
    }
    if (!orderData.orderTo || orderData.orderTo.length < 1) {
      errors.orderTo = 'Order To is required';
    }
    if (orderData.quantity === undefined || orderData.quantity < 1 || orderData.quantity > 99) {
      errors.quantity = 'Quantity is required and must be between 1 and 99';
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error message when input changes
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const response = await fetch(`/api/be/api/v1/Order/UpdateOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: orderData.description || '',
          orderFrom: orderData.orderFrom || '',
          orderTo: orderData.orderTo || '',
          quantity: orderData.quantity !== undefined ? orderData.quantity : 0,
        }),
      });
      if (response.ok) {
        console.log('Order updated successfully');
        router.push('/')
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <div className="mb-4">
        <label htmlFor="orderFrom" className="block text-gray-700 text-sm font-bold mb-2">
          Order From:
        </label>
        <input
          type="text"
          id="orderFrom"
          name="orderFrom"
          value={orderData.orderFrom || ''}
          onChange={handleInputChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.orderFrom ? 'border-red-500' : ''
          }`}
        />
        {errors.orderFrom && <p className="text-red-500 text-xs italic">{errors.orderFrom}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="orderTo" className="block text-gray-700 text-sm font-bold mb-2">
          Order To:
        </label>
        <input
          type="text"
          id="orderTo"
          name="orderTo"
          value={orderData.orderTo || ''}
          onChange={handleInputChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.orderTo ? 'border-red-500' : ''
          }`}
        />
        {errors.orderTo && <p className="text-red-500 text-xs italic">{errors.orderTo}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={orderData.description || ''}
          onChange={handleInputChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.description ? 'border-red-500' : ''
          }`}
        />
        {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={orderData.quantity !== undefined ? orderData.quantity : ''}
          onChange={handleInputChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.quantity ? 'border-red-500' : ''
          }`}
        />
        {errors.quantity && <p className="text-red-500 text-xs italic">{errors.quantity}</p>}
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Order
        </button>
      </div>
    </form>
  );
};

export default EditOrderForm;
