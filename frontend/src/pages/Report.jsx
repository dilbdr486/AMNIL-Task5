import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Report = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dayWiseReport, setDayWiseReport] = useState([]);
  const [totalReport, setTotalReport] = useState([]);
  const [topSearchedProducts, setTopSearchedProducts] = useState([]);
  const [reportType, setReportType] = useState("day"); // New state for report type

  const fetchDayWiseReport = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reports/day-wise-report", {
        params: { startDate, endDate },
      });
      console.log("Day-wise report data:", response.data); // Debug log
      setDayWiseReport(response.data);
    } catch (error) {
      console.error("Error fetching day-wise report:", error);
    }
  };

  const fetchTotalReport = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reports/total-report", {
        params: { startDate, endDate },
      });
      console.log("Total report data:", response.data); // Debug log
      setTotalReport(response.data);
    } catch (error) {
      console.error("Error fetching total report:", error);
    }
  };

  const fetchTopSearchedProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reports/top-searched-products", {
        params: { startDate, endDate },
      });
      console.log("Top searched products data:", response.data); // Debug log
      setTopSearchedProducts(response.data);
    } catch (error) {
      console.error("Error fetching top searched products:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDayWiseReport();
      fetchTotalReport();
      fetchTopSearchedProducts();
    }
  }, [startDate, endDate]);

  const generateLabels = (type) => {
    if (type === "day") {
      return Array.from({ length: 30 }, (_, index) => `Day ${index + 1}`);
    } else if (type === "week") {
      return Array.from({ length: 4 }, (_, index) => `Week ${index + 1}`);
    } else {
      return Array.from({ length: 12 }, (_, index) => `Month ${index + 1}`);
    }
  };

  const fillMissingData = (data, labels) => {
    const filledData = labels.map(label => {
      const existingData = data.find(item => item.name === label);
      return existingData || { name: label, totalSales: 0, totalProducts: 0 };
    });
    return filledData;
  };

  const labels = generateLabels(reportType);
  const dayWiseData = fillMissingData(dayWiseReport.map((report, index) => ({
    name: `Day ${index + 1}`,
    totalSales: report.totalSales,
    totalProducts: report.totalProducts,
  })), labels);

  const weekWiseData = fillMissingData(dayWiseReport.map((report, index) => ({
    name: `Week ${index + 1}`,
    totalSales: report.totalSales,
    totalProducts: report.totalProducts,
  })), labels);

  const monthWiseData = fillMissingData(Array.from({ length: 12 }, (_, index) => ({
    name: `Month ${index + 1}`,
    totalSales: Math.floor(Math.random() * 1000),
    totalProducts: Math.floor(Math.random() * 100),
  })), labels);

  const totalReportData = totalReport.map((report, index) => ({
    name: `Item ${index + 1}`,
    totalQuantity: report.totalQuantity,
    totalRevenue: report.totalRevenue,
  }));

  const topSearchedProductsData = topSearchedProducts.map((product, index) => ({
    name: `Product ${index + 1}`,
    count: product.count,
  }));

  const calculateTotalRevenueAndSales = (data) => {
    return data.reduce((acc, item) => {
      acc.totalRevenue += item.totalRevenue || 0;
      acc.totalSales += item.totalSales || 0;
      return acc;
    }, { totalRevenue: 0, totalSales: 0 });
  };

  const totalRevenueAndSales = calculateTotalRevenueAndSales(totalReportData);

  const renderChart = (data, dataKey, title) => {
    if (data.length === 0) {
      return <div className="h-96 flex items-center justify-center">Data not found</div>;
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Report</h1>
      <div className="mb-4">
        <label className="block mb-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border p-2"
        >
          <option value="day">Day-wise</option>
          <option value="week">Week-wise</option>
          <option value="month">Month-wise</option>
        </select>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{reportType === "day" ? "Day-wise Report" : reportType === "week" ? "Week-wise Report" : "Month-wise Report"}</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportType === "month" ? monthWiseData : reportType === "week" ? weekWiseData : dayWiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
              <Line type="monotone" dataKey="totalProducts" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Total Report</h2>
        <div className="h-96">
          {renderChart(totalReportData, "totalRevenue", "Total Report")}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Top Searched Products</h2>
        <div className="h-96">
          {renderChart(topSearchedProductsData, "count", "Top Searched Products")}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Total Revenue and Sales</h2>
        <div className="h-96">
          {renderChart([{ name: "Total", ...totalRevenueAndSales }], "totalRevenue", "Total Revenue and Sales")}
        </div>
      </div>
    </div>
  );
};

export default Report;