import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../store/StoreContext"; // Import the StoreContext
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Report = () => {
  const { url } = useContext(StoreContext); // Access the url from the context
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("day");
  const [reportData, setReportData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [yoyGrowth, setYoYGrowth] = useState(0);
  const [momGrowth, setMoMGrowth] = useState(0);
  const [grossProfitData, setGrossProfitData] = useState([]);
  const [marginProducts, setMarginProducts] = useState({ highMarginProducts: [], lowMarginProducts: [] });
  const [topSearchedProducts, setTopSearchedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productSalesHistory, setProductSalesHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerSalesAnalysis, setCustomerSalesAnalysis] = useState({ newCustomers: 0, repeatCustomers: 0, topCustomerSegments: [] });

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous error

    try {
      const response = await axios.get(
        `${url}/api/reports/${reportType}-wise-report`, // Use the url from context
        {
          params: { startDate, endDate },
        }
      );

      // Ensure the backend response is in the expected format
      if (Array.isArray(response.data)) {
        setReportData(response.data);
      } else {
        setError("Invalid data format from the server.");
      }

      // Fetch total revenue
      const revenueResponse = await axios.get(`${url}/api/reports/total-revenue`, {
        params: { startDate, endDate },
      });
      setTotalRevenue(revenueResponse.data.totalRevenue || 0);

      // Fetch total sales
      const salesResponse = await axios.get(`${url}/api/reports/total-sales`, {
        params: { startDate, endDate },
      });
      setTotalSales(salesResponse.data.totalSales || 0);

      // Calculate average order value
      const averageOrderValue = (revenueResponse.data.totalRevenue || 0) / (salesResponse.data.totalSales || 1);
      setAverageOrderValue(averageOrderValue);

      // Fetch conversion rate
      const conversionRateResponse = await axios.get(`${url}/api/reports/conversion-rate`, {
        params: { startDate, endDate },
      });
      setConversionRate(parseFloat(conversionRateResponse.data.conversionRate) || 0);

      // Fetch YoY growth
      const yoyGrowthResponse = await axios.get(`${url}/api/reports/yoy-growth`, {
        params: { startDate, endDate },
      });
      setYoYGrowth(yoyGrowthResponse.data.yoyGrowth || 0);

      // Fetch MoM growth
      const momGrowthResponse = await axios.get(`${url}/api/reports/mom-growth`, {
        params: { startDate, endDate },
      });
      setMoMGrowth(parseFloat(momGrowthResponse.data.momGrowth) || 0);

      // Fetch gross profit per product
      const grossProfitResponse = await axios.get(`${url}/api/reports/gross-profit-per-product`, {
        params: { startDate, endDate },
      });
      setGrossProfitData(grossProfitResponse.data);

      // Fetch margin products
      const marginProductsResponse = await axios.get(`${url}/api/reports/margin-products`, {
        params: { startDate, endDate },
      });
      setMarginProducts(marginProductsResponse.data);

      // Fetch top searched products
      const topSearchedProductsResponse = await axios.get(`${url}/api/reports/top-searched-products`, {
        params: { startDate, endDate },
      });
      setTopSearchedProducts(topSearchedProductsResponse.data);
    } catch (error) {
      // Improved error handling
      if (error.response) {
        setError(`Error: ${error.response.data.message || error.response.data}`);
      } else {
        setError("Network error or server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProductSalesHistory = async (productId) => {
    try {
      const response = await axios.get(`${url}/api/reports/product-sales-history`, {
        params: { productId, startDate, endDate },
      });
      setProductSalesHistory(response.data);
      setSelectedProduct(productId);
    } catch (error) {
      setError("Failed to fetch product sales history.");
    }
  };

  const handleDataPointClick = (e) => {
    if (e && e.activePayload && e.activePayload[0] && e.activePayload[0].payload) {
      fetchProductSalesHistory(e.activePayload[0].payload._id);
    }
  };

  const fetchCustomerSalesAnalysis = async () => {
    try {
      const response = await axios.get(`${url}/api/reports/customer-sales-analysis`, {
        params: { startDate, endDate },
      });
      setCustomerSalesAnalysis(response.data);
    } catch (error) {
      setError("Failed to fetch customer sales analysis.");
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
      fetchCustomerSalesAnalysis();
    }
  }, [startDate, endDate, reportType]);

  const formatXAxis = (index) => {
    if (reportType === "day") return `Day ${index + 1}`;
    if (reportType === "week") return `Week ${index + 1}`;
    if (reportType === "month") return `Month ${index + 1}`;
    if (reportType === "year") return `Year ${index + 1}`;
    return index;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sales Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Total Sales</h2>
          <p className="text-2xl">{totalSales}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Total Revenue</h2>
          <p className="text-2xl">${totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Average Order Value</h2>
          <p className="text-2xl">${averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Conversion Rate</h2>
          <p className="text-2xl">{Number(conversionRate).toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">YoY Growth</h2>
          <p className="text-2xl">{yoyGrowth.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">MoM Growth</h2>
          <p className="text-2xl">{Number(momGrowth).toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="day">Day-wise</option>
            <option value="week">Week-wise</option>
            <option value="month">Month-wise</option>
            <option value="year">Year-wise</option>
          </select>
        </div>
      </div>

      <button
        className="bg-black text-white px-4 py-2 rounded mb-6"
        onClick={fetchReport}
        disabled={loading}
      >
        {loading ? "Generating Report..." : "Generate Report"}
      </button>

      {error && <div className="text-red-500 mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)}-wise Sales
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData} onClick={handleDataPointClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tickFormatter={(index) => formatXAxis(index)} />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)}-wise Products
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tickFormatter={(index) => formatXAxis(index)} />
              <YAxis tickFormatter={(value) => `${value}`} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalProducts" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Gross Profit Per Product</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={grossProfitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip />
              <Legend />
              <Bar dataKey="grossProfit" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">High Margin Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marginProducts.highMarginProducts}
                dataKey="grossProfit"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {marginProducts.highMarginProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Low Margin Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marginProducts.lowMarginProducts}
                dataKey="grossProfit"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#FF8042"
                label
              >
                {marginProducts.lowMarginProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top 10 Searched Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topSearchedProducts}
                dataKey="totalSearches"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {topSearchedProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedProduct && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-4">Sales History for Product: {selectedProduct}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productSalesHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalQuantity" stroke="#8884d8" />
              <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
          <table className="min-w-full bg-white mt-4">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Price per Item</th>
                <th className="py-2">Total Price</th>
                <th className="py-2">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {productSalesHistory.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">{new Date(item._id).toLocaleDateString()}</td>
                  <td className="py-2">{item.totalQuantity}</td>
                  <td className="py-2">${(item.totalRevenue / item.totalQuantity).toFixed(2)}</td>
                  <td className="py-2">${item.totalRevenue.toFixed(2)}</td>
                  <td className="py-2">${item.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Customer-Based Sales Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">New Customers</h2>
            <p className="text-2xl">${customerSalesAnalysis.newCustomers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Repeat Customers</h2>
            <p className="text-2xl">${customerSalesAnalysis.repeatCustomers}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top Customer Segments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerSalesAnalysis.topCustomerSegments}
                dataKey="totalRevenue"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {customerSalesAnalysis.topCustomerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Report;
