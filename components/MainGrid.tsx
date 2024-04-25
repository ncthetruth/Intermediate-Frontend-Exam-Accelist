import React, { useState, useEffect } from 'react';
import PopupContent from './PopupContent';

interface Order {
  id: number;
  name: string;
  from: string;
  to: string;
  orderedAt: Date;
  quantity: number;
  description?: string;
}

const MainGrid: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.from.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.to.toLowerCase().includes(searchValue.toLowerCase()) ||
    order.orderedAt.toLocaleString().toLowerCase().includes(searchValue.toLowerCase()) ||
    order.quantity.toString().toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const promises = Array.from({ length: 24 }, (_, index) => {
          const orderId = index + 1;
          return fetch(`api/be/api/v1/order/orderdetail/${orderId}`).then(response => response.json());
        });

        const ordersData = await Promise.all(promises);
        const newOrders = ordersData.map((orderData: any, index: number) => ({
          id: index + 1,
          name: `Order ${index + 1}`,
          from: orderData.orderFrom,
          to: orderData.orderTo,
          orderedAt: new Date(orderData.orderedAt),
          quantity: orderData.quantity,
          description: orderData.description
        }));

        setOrders(newOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalPages = Math.ceil(filteredOrders.length / 5);
  const firstIndex = (currentPage - 1) * 5;
  const lastIndex = Math.min(firstIndex + 5, filteredOrders.length);
  const currentOrders = filteredOrders.slice(firstIndex, lastIndex);

  const isLastPage = currentPage === totalPages;

  const nextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
    setIsPopupOpen(false);
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setIsDeletePopupOpen(true);
  };

  const handleCloseDeletePopup = () => {
    setOrderToDelete(null);
    setIsDeletePopupOpen(false);
  };

  const deleteOrder = async () => {
    try {
      if (orderToDelete) {
        const response = await fetch(`api/be/api/v1/Order/DeleteOrder/${orderToDelete.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete.id));
        } else {
          console.error('Failed to delete order');
        }
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      handleCloseDeletePopup();
    }
  };

  const handleEditOrder = (order: Order) => {
    window.location.href = `/edit/${order.id}`;
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prevSelectedOrders =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter(id => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const deleteMultipleOrders = async () => {
    try {
      const promises = selectedOrders.map(orderId =>
        fetch(`api/be/api/v1/Order/DeleteOrder/${orderId}`, { method: 'DELETE' })
      );
      const responses = await Promise.all(promises);
      if (responses.every(response => response.ok)) {
        setOrders(prevOrders => prevOrders.filter(order => !selectedOrders.includes(order.id)));
        setSelectedOrders([]);
      } else {
        console.error('Failed to delete one or more orders');
      }
    } catch (error) {
      console.error('Error deleting orders:', error);
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Main Menu</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchInputChange}
          className="px-2 py-1 border border-gray-400 rounded"
        />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-400">
            {}
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">No</th>
                <th className="border border-gray-400 px-4 py-2">Nama Order</th>
                <th className="border border-gray-400 px-4 py-2">Order From</th>
                <th className="border border-gray-400 px-4 py-2">Order To</th>
                <th className="border border-gray-400 px-4 py-2">Ordered At</th>
                <th className="border border-gray-400 px-4 py-2">Quantity</th>
                <th className="border border-gray-400 px-4 py-2">Action</th>
              </tr>
            </thead>
            {}
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="border border-gray-400 px-4 py-2">{firstIndex + index + 1}</td>
                  <td className="border border-gray-400 px-4 py-2">{order.name}</td>
                  <td className="border border-gray-400 px-4 py-2">{order.from}</td>
                  <td className="border border-gray-400 px-4 py-2">{order.to}</td>
                  <td className="border border-gray-400 px-4 py-2">{order.orderedAt.toLocaleString()}</td>
                  <td className="border border-gray-400 px-4 py-2">{order.quantity}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                    />
                    <button onClick={() => handleViewOrderDetail(order)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">View</button>
                    <button onClick={() => handleEditOrder(order)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Edit</button>
                    <button onClick={() => handleDeleteOrder(order)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Previous
            </button>
            {selectedOrders.length > 0 && (
              <button
                onClick={deleteMultipleOrders}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete Selected
              </button>
            )}
            <button
              onClick={nextPage}
              disabled={isLastPage}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
     <PopupContent 
  show={isPopupOpen} 
  onClose={handleClosePopup} 
  message="Order Detail Menu"
  warningMessage={selectedOrder ? (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Order Detail Menu</h2>
      <p><span className="text-black font-normal text-s">Order ID:</span> {selectedOrder.id}</p>
      <p><span className="text-black font-normal text-s">Description:</span> {selectedOrder.description || "N/A"}</p>
      <p><span className="text-black font-normal text-s">Order From:</span> {selectedOrder.from}</p>
      <p><span className="text-black font-normal text-s">Order To:</span> {selectedOrder.to}</p>
      <p><span className="text-black font-normal text-s">Ordered At:</span> {selectedOrder.orderedAt.toLocaleString()}</p>
      <p><span className="text-black font-normal text-s">Quantity:</span> {selectedOrder.quantity}</p>
    </div>
  ) : (
    <span>No order selected</span>
  )}
/>
      {isDeletePopupOpen && (
        <div id="popup-delete" className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-md mx-auto my-6">
            <div className="relative bg-white w-full rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-3xl font-semibold">Confirmation</h3>
                <button className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={handleCloseDeletePopup}>
                  <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-black text-lg leading-relaxed">
                  Are you sure you want to delete this order?
                </p>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button className="text-blue-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1" type="button" onClick={deleteOrder}>
                  Yes, delete
                </button>
                <button className="bg-red-500 text-white active:bg-gray-200 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1" type="button" onClick={handleCloseDeletePopup}>
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={isDeletePopupOpen ? "opacity-25 fixed inset-0 z-40 bg-black" : ""}></div>
    </div>
  );
};

export default MainGrid;
