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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setConversionRate(conversionRateResponse.data.conversionRate || 0);

      // Fetch YoY growth
      const yoyGrowthResponse = await axios.get(`${url}/api/reports/yoy-growth`, {
        params: { startDate, endDate },
      });
      setYoYGrowth(yoyGrowthResponse.data.yoyGrowth || 0);

      // Fetch MoM growth
      const momGrowthResponse = await axios.get(`${url}/api/reports/mom-growth`, {
        params: { startDate, endDate },
      });
      setMoMGrowth(momGrowthResponse.data.momGrowth || 0);
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

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate, reportType]);

  const formatXAxis = (index) => {
    if (reportType === "day") return `Day ${index + 1}`;
    if (reportType === "week") return `Week ${index + 1}`;
    if (reportType === "month") return `Month ${index + 1}`;
    if (reportType === "year") return `Year ${index + 1}`;
    return index;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sales Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Total Sales</h2>
          <p className="text-2xl">${totalSales}</p>
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
          <p className="text-2xl">{conversionRate.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">YoY Growth</h2>
          <p className="text-2xl">{yoyGrowth.toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">MoM Growth</h2>
          <p className="text-2xl">{momGrowth.toFixed(2)}%</p>
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
            <LineChart data={reportData}>
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
    </div>
  );
};

export default Report;
