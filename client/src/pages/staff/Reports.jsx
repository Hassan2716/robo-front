import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../utils/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export default function StaffReports() {
  const [bookingReport, setBookingReport] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [barberPerformance, setBarberPerformance] = useState([]);
  const [productReport, setProductReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [bookingRes, revenueRes, barberRes, productRes] = await Promise.all([
          api.get(`/reports/bookings?period=${period}`),
          api.get(`/reports/revenue?period=${period}`),
          api.get(`/reports/barbers?period=${period}`),
          api.get(`/reports/products`),
        ]);
        setBookingReport(bookingRes.data.data);
        setRevenueReport(revenueRes.data.data);
        setBarberPerformance(barberRes.data.data);
        setProductReport(productRes.data.data);
      } catch (error) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [period]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e5e5e5' } },
      x: { grid: { display: false } },
    },
  };

  const lineChartData = bookingReport?.chartData ? {
    labels: bookingReport.chartData.map(d => d.date),
    datasets: [{
      label: 'Bookings',
      data: bookingReport.chartData.map(d => d.bookings),
      borderColor: '#e94560',
      backgroundColor: 'rgba(233, 69, 96, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  } : { labels: [], datasets: [] };

  const revenueChartData = revenueReport?.chartData ? {
    labels: revenueReport.chartData.map(d => d.date),
    datasets: [{
      label: 'Revenue',
      data: revenueChartData.chartData?.map(d => d.revenue) || [],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  } : { labels: [], datasets: [] };

  const topServicesData = bookingReport?.topServices ? {
    labels: bookingReport.topServices.map(s => s.name),
    datasets: [{
      data: bookingReport.topServices.map(s => s.count),
      backgroundColor: ['#e94560', '#f97316', '#eab308', '#22c55e', '#06b6d4'],
    }],
  } : { labels: [], datasets: [] };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6"><div className="h-6 bg-dark-100 rounded w-1/2" /><div className="h-10 bg-dark-100 rounded w-1/3 mt-4" /></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6"><div className="h-64 bg-dark-100 rounded" /></div>
          <div className="card p-6"><div className="h-64 bg-dark-100 rounded" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900">Reports & Analytics</h1>
          <p className="text-dark-600">Business insights and performance metrics</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input w-auto"
        >
          {periodOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <p className="text-sm text-dark-500">Total Bookings</p>
          <h3 className="font-display text-3xl font-bold text-dark-900 mt-1">{bookingReport?.totalBookings || 0}</h3>
        </div>
        <div className="card p-6">
          <p className="text-sm text-dark-500">Total Revenue</p>
          <h3 className="font-display text-3xl font-bold text-dark-900 mt-1">${revenueReport?.totalRevenue?.toFixed(2) || '0.00'}</h3>
        </div>
        <div className="card p-6">
          <p className="text-sm text-dark-500">Top Service</p>
          <h3 className="font-display text-lg font-bold text-dark-900 mt-1">{bookingReport?.topServices?.[0]?.name || 'N/A'}</h3>
        </div>
        <div className="card p-6">
          <p className="text-sm text-dark-500">Top Barber</p>
          <h3 className="font-display text-lg font-bold text-dark-900 mt-1">{bookingReport?.topBarbers?.[0]?.name || 'N/A'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Bookings Trend</h2>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Revenue Trend</h2>
          <div className="h-64">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Top Services</h2>
          <div className="h-64">
            <Doughnut
              data={topServicesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
              }}
            />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Barber Performance</h2>
          <div className="space-y-4">
            {barberPerformance.slice(0, 5).map((barber, i) => (
              <div key={barber.barber.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                  {barber.barber.photo ? (
                    <img src={barber.barber.photo} alt={barber.barber.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="font-display font-bold">{barber.barber.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-900 truncate">{barber.barber.name}</p>
                  <p className="text-sm text-dark-500">{barber.totalBookings} bookings • ${barber.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-dark-900">${barber.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-dark-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-dark-900 mb-4">Product Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-red-500">{productReport?.outOfStock || 0}</p>
            <p className="text-sm text-red-700">Out of Stock</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <p className="text-3xl font-bold text-yellow-500">{productReport?.lowStock || 0}</p>
            <p className="text-sm text-yellow-700">Low Stock</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-500">{productReport?.wellStocked || 0}</p>
            <p className="text-sm text-green-700">Well Stocked</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-500">{productReport?.totalProducts || 0}</p>
            <p className="text-sm text-blue-700">Total Products</p>
          </div>
        </div>
        
        {productReport?.lowStockItems?.length > 0 && (
          <div>
            <h3 className="font-medium text-dark-900 mb-3">Low Stock Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase">Stock</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-dark-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {productReport.lowStockItems.map(item => (
                    <tr key={item.id} className="hover:bg-dark-50">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-red-500 font-medium">{item.stock}</td>
                      <td className="px-4 py-3">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}