import React, { useState } from 'react';
import {
  ShoppingCart, Users, Package, DollarSign, Tag, TrendingUp, Clock,
  Plus, Eye, AlertTriangle, Gift, Truck, Shield, Settings, 
  BarChart3, PieChart, Calendar, Bell, Search, Filter,
  ChevronDown, ExternalLink, Activity, CheckCircle, XCircle,
  AlertCircle, User, LogOut, Moon, Sun
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProperDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeFilter, setTimeFilter] = useState('weekly');

  // Sample data
  const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 32 },
    { name: 'Thu', sales: 4500, orders: 28 },
    { name: 'Fri', sales: 6000, orders: 38 },
    { name: 'Sat', sales: 7000, orders: 42 },
    { name: 'Sun', sales: 5500, orders: 35 }
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#10B981' },
    { name: 'Pending', value: 20, color: '#F59E0B' },
    { name: 'Cancelled', value: 15, color: '#EF4444' }
  ];

  const categoryData = [
    { name: 'Electronics', sales: 12000 },
    { name: 'Clothing', sales: 8000 },
    { name: 'Books', sales: 6000 },
    { name: 'Home', sales: 4000 }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'Neel P.', date: 'Jun 24', status: 'Delivered', amount: '₹1200' },
    { id: '#1235', customer: 'Priya S.', date: 'Jun 24', status: 'Pending', amount: '₹850' },
    { id: '#1236', customer: 'Rahul M.', date: 'Jun 23', status: 'Delivered', amount: '₹2100' },
    { id: '#1237', customer: 'Anita K.', date: 'Jun 23', status: 'Cancelled', amount: '₹750' }
  ];

  const lowStockItems = [
    { name: 'iPhone 15 Pro', stock: 2, category: 'Electronics' },
    { name: 'Nike Air Max', stock: 1, category: 'Footwear' },
    { name: 'Samsung Galaxy', stock: 3, category: 'Electronics' }
  ];

  const activePromoCodes = [
    { code: 'SUMMER25', discount: '25%', expires: '2 days', uses: 45 },
    { code: 'NEWUSER', discount: '₹200', expires: '5 days', uses: 23 },
    { code: 'BULK50', discount: '50%', expires: '1 week', uses: 12 }
  ];

  const StatCard = ({ title, value, icon: Icon, change, color = "blue" }) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change} from last {timeFilter}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, Utsav! 👋
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center mt-1`}>
              <Calendar className="w-4 h-4 mr-1" />
              Tuesday, June 24, 2025
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Order
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Create Promo
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Orders" value="1,234" icon={ShoppingCart} change="+12%" color="blue" />
          <StatCard title="Total Customers" value="856" icon={Users} change="+8%" color="green" />
          <StatCard title="Products Available" value="342" icon={Package} change="+3%" color="purple" />
          <StatCard title="Total Revenue" value="₹89,432" icon={DollarSign} change="+15%" color="yellow" />
          <StatCard title="Active Promo Codes" value="12" icon={Tag} change="-2%" color="red" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Overview */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sales Overview</h3>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
              <button className="text-blue-600 hover:text-blue-700 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    <th className="text-left pb-2">Order ID</th>
                    <th className="text-left pb-2">Customer</th>
                    <th className="text-left pb-2">Date</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <td className="py-3 font-medium">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3"><StatusBadge status={order.status} /></td>
                      <td className="py-3 font-semibold">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Low Stock Alert
              </h3>
              <button className="text-blue-600 hover:text-blue-700">Manage Inventory</button>
            </div>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.category}</p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Promo Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-600">Manage Products</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                <Tag className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-600">Promo Codes</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-600">New Order</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                <Gift className="w-6 h-6 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-yellow-600">Gift Wraps</span>
              </button>
            </div>
          </div>

          {/* Active Promo Codes */}
          <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Active Promo Codes</h3>
              <button className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-sm">
                Create New
              </button>
            </div>
            <div className="space-y-3">
              {activePromoCodes.map((promo, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-mono text-sm">
                      {promo.code}
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{promo.discount} off</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expires in {promo.expires}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{promo.uses}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>uses</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COD Status & Category Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COD Status */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Truck className="w-5 h-5 mr-2" />
              COD Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total COD Orders</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>284</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Pending</span>
                <span className="font-semibold text-yellow-600">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Delivered</span>
                <span className="font-semibold text-green-600">198</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Cancelled</span>
                <span className="font-semibold text-red-600">41</span>
              </div>
            </div>
          </div>

          {/* Category Sales */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Category Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProperDashboard;