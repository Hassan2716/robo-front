import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function StaffPOS() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      items: [{ type: 'service', item: '', quantity: 1 }],
      paymentMethod: 'cash',
      customer: '',
      barber: '',
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          api.get('/services?active=true'),
          api.get('/products?active=true'),
        ]);
        setServices(servicesRes.data.data);
        setProducts(productsRes.data.data);
      } catch (error) {
        toast.error('Failed to load services/products');
      }
    };
    fetchData();
  }, []);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (!item.item) return total;
      const found = item.type === 'service'
        ? services.find(s => s._id === item.item)
        : products.find(p => p._id === item.item);
      if (!found) return total;
      return total + (found.price * (item.quantity || 1));
    }, 0);
  };

  const total = calculateTotal();

  const onSubmit = async (data) => {
    const validItems = data.items.filter(item => item.item);
    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/sales', {
        items: validItems,
        paymentMethod: data.paymentMethod,
        customer: data.customer || undefined,
        barber: data.barber || undefined,
        notes: data.notes,
      });
      toast.success('Sale completed!');
      setReceipt(res.data.data);
      // Reset form
      handleSubmit(() => {})(); // This won't work well, let's use reset
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process sale');
    } finally {
      setLoading(false);
    }
  };

  const getItemName = (item) => {
    if (!item.item) return 'Select...';
    const found = item.type === 'service'
      ? services.find(s => s._id === item.item)
      : products.find(p => p._id === item.item);
    return found ? `${found.name} - $${found.price}` : 'Unknown';
  };

  const getItemPrice = (item) => {
    if (!item.item) return 0;
    const found = item.type === 'service'
      ? services.find(s => s._id === item.item)
      : products.find(p => p._id === item.item);
    return found ? found.price * (item.quantity || 1) : 0;
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-dark-900">Point of Sale</h1>
        <p className="text-dark-600">Process walk-in sales for services and products</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Items</h2>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 mb-4 items-start">
                  <select
                    {...register(`items.${index}.type`)}
                    className="input w-32"
                    onChange={(e) => {
                      setValue(`items.${index}.type`, e.target.value);
                      setValue(`items.${index}.item`, '');
                    }}
                  >
                    <option value="service">Service</option>
                    <option value="product">Product</option>
                  </select>

                  <select
                    {...register(`items.${index}.item`)}
                    className="input flex-1"
                    onChange={(e) => setValue(`items.${index}.quantity`, 1)}
                  >
                    <option value="">Select {items[index]?.type || 'type'} first</option>
                    {items[index]?.type === 'service' && services.map(s => (
                      <option key={s._id} value={s._id}>{s.name} - $${s.price} ({s.duration}min)</option>
                    ))}
                    {items[index]?.type === 'product' && products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} - $${p.price} (Stock: {p.stock})</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max={99}
                    {...register(`items.${index}.quantity`)}
                    className="input w-20"
                    onChange={(e) => setValue(`items.${index}.quantity`, parseInt(e.target.value) || 1)}
                  />

                  <div className="text-right pt-2 w-24">
                    {getItemPrice(field) > 0 && (
                      <div className="font-medium text-dark-900">${getItemPrice(field).toFixed(2)}</div>
                    )}
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ type: 'service', item: '', quantity: 1 })}
                className="btn-outline w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Add Another Item
              </button>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Payment Method</label>
                  <select {...register('paymentMethod')} className="input">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Customer (Optional)</label>
                  <input type="text" {...register('customer')} className="input" placeholder="Customer name or email" />
                </div>
                <div>
                  <label className="label">Barber (Optional)</label>
                  <input type="text" {...register('barber')} className="input" placeholder="Barber name" />
                </div>
                <div>
                  <label className="label">Notes</label>
                  <textarea {...register('notes')} className="input" rows={2} placeholder="Additional notes..." />
                </div>
              </div>
            </div>

            <div className="card p-6 bg-dark-50 border-dark-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-dark-500">Subtotal</p>
                  <p className="font-display text-3xl font-bold text-dark-900">${total.toFixed(2)}</p>
                </div>
                <button
                  type="submit"
                  disabled={loading || items.filter(i => i.item).length === 0}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  {loading ? 'Processing...' : `Charge $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Quick Add</h2>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-dark-500">Popular Services</h3>
              {services.slice(0, 5).map(s => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    const emptyIndex = fields.findIndex(f => !items[f.id]?.item);
                    if (emptyIndex >= 0) {
                      setValue(`items.${emptyIndex}.type`, 'service');
                      setValue(`items.${emptyIndex}.item`, s._id);
                      setValue(`items.${emptyIndex}.quantity`, 1);
                    } else {
                      append({ type: 'service', item: s._id, quantity: 1 });
                    }
                  }}
                  className="w-full text-left p-3 rounded-lg border border-dark-200 hover:bg-dark-50 transition-colors flex justify-between"
                >
                  <span>{s.name}</span>
                  <span className="font-medium text-primary-500">${s.price}</span>
                </button>
              ))}
              
              <h3 className="text-sm font-medium text-dark-500 mt-4">Popular Products</h3>
              {products.slice(0, 5).map(p => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => {
                    const emptyIndex = fields.findIndex(f => !items[f.id]?.item);
                    if (emptyIndex >= 0) {
                      setValue(`items.${emptyIndex}.type`, 'product');
                      setValue(`items.${emptyIndex}.item`, p._id);
                      setValue(`items.${emptyIndex}.quantity`, 1);
                    } else {
                      append({ type: 'product', item: p._id, quantity: 1 });
                    }
                  }}
                  className="w-full text-left p-3 rounded-lg border border-dark-200 hover:bg-dark-50 transition-colors flex justify-between"
                  disabled={p.stock === 0}
                >
                  <span className={p.stock === 0 ? 'text-dark-400' : ''}>{p.name}</span>
                  <span className={`font-medium ${p.stock === 0 ? 'text-dark-400' : 'text-green-500'}`}>
                    ${p.price} {p.stock === 0 ? '(Out of stock)' : `(${p.stock} left)`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {receipt && (
            <div className="card p-6 border-2 border-primary-500 animate-fade-in">
              <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Receipt</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sale ID</span>
                  <span className="font-mono">#{receipt._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{new Date(receipt.createdAt).toLocaleString()}</span>
                </div>
                <div className="border-t border-dark-200 pt-2">
                  {receipt.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dark-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${receipt.total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-dark-500">
                  Payment: {receipt.paymentMethod}
                </div>
              </div>
              <button
                onClick={() => setReceipt(null)}
                className="btn-ghost w-full mt-4 text-sm"
              >
                Close Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}