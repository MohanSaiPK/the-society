import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const TABS = ["Overview", "Manage Bookings"];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [bookingTab, setBookingTab] = useState("Pending");
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    uniqueResidents: 0,
    thisMonth: 0,
  });
  const [servicesOffered, setServicesOffered] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "Overview") {
      fetchStats();
      fetchRecentHistory();
      setServicesOffered(user?.services || []);
    }
    if (activeTab === "Manage Bookings") {
      fetchBookings();
    }
    return () => setSortAsc(false); // Reset sort on unmount/reload
    // eslint-disable-next-line
  }, [activeTab, bookingTab]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/bookings/provider/stats");
      setStats(res.data);
    } catch {
      setStats({
        totalBookings: 0,
        pendingRequests: 0,
        uniqueResidents: 0,
        thisMonth: 0,
      });
    }
  };

  const fetchRecentHistory = async () => {
    try {
      const res = await api.get("/bookings/provider/recent-history");
      setRecentHistory(res.data);
    } catch {
      setRecentHistory([]);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      let status = bookingTab.toLowerCase();
      if (status === "pending") status = "pending";
      if (status === "accepted") status = "accepted";
      if (status === "rejected") status = "rejected";
      const res = await api.get(`/bookings/provider/bookings?status=${status}`);
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    setError("");
    try {
      await api.patch(`/bookings/provider/bookings/${id}/status`, { status });
      fetchBookings();
      fetchStats();
    } catch {
      setError("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort bookings
  let filteredBookings = bookings.filter(
    (b) =>
      b.resident?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.toLowerCase().includes(search.toLowerCase())
  );
  if (sortAsc) {
    filteredBookings = [...filteredBookings].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-4 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="text-gray-500">Total Bookings</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <div className="text-gray-500">Pending Requests</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-2xl font-bold">{stats.uniqueResidents}</div>
              <div className="text-gray-500">Unique Residents</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <div className="text-gray-500">This Month</div>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-bold mb-2">Services offered:</h4>
            <div className="flex gap-2 flex-wrap">
              {servicesOffered.map((service) => (
                <span
                  key={service}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {service.charAt(0).toUpperCase() + service.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Recent History</h4>
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Resident Name</th>
                  <th className="py-2 px-4 border">Service</th>
                  <th className="py-2 px-4 border">Date & Time</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.map((row) => (
                  <tr key={row._id}>
                    <td className="py-2 px-4 border">{row.resident?.name}</td>
                    <td className="py-2 px-4 border">{row.service}</td>
                    <td className="py-2 px-4 border">
                      {new Date(row.date).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">Completed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Bookings Tab */}
      {activeTab === "Manage Bookings" && (
        <div>
          <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full max-w-xs"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={`px-4 py-2 rounded border ${
                sortAsc ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSortAsc((prev) => !prev)}
            >
              Sort by Date {sortAsc ? "▲" : "▼"}
            </button>
          </div>
          <div>
            <div className="flex gap-4 mb-4">
              {["Pending", "Accepted", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded ${
                    bookingTab === tab
                      ? tab === "Pending"
                        ? "bg-yellow-500 text-white"
                        : tab === "Accepted"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setBookingTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {loading && <div className="text-gray-500">Loading...</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {bookingTab === "Pending" && (
              <div>
                <h4 className="font-bold mb-2">Pending</h4>
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="py-2 px-4 border">Resident Name</th>
                      <th className="py-2 px-4 border">Service</th>
                      <th className="py-2 px-4 border">Date & Time</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings
                      .filter((b) => b.status === "pending")
                      .map((row) => (
                        <tr key={row._id}>
                          <td className="py-2 px-4 border">
                            {row.resident?.name}
                          </td>
                          <td className="py-2 px-4 border">{row.service}</td>
                          <td className="py-2 px-4 border">
                            {new Date(row.date).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">
                            {row.status.charAt(0).toUpperCase() +
                              row.status.slice(1)}
                          </td>
                          <td className="py-2 px-4 border flex gap-2">
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded"
                              title="Accept"
                              onClick={() =>
                                handleStatusChange(row._id, "accepted")
                              }
                              disabled={loading}
                            >
                              ✓
                            </button>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded"
                              title="Reject"
                              onClick={() =>
                                handleStatusChange(row._id, "rejected")
                              }
                              disabled={loading}
                            >
                              ✗
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {bookingTab === "Accepted" && (
              <div>
                <h4 className="font-bold mb-2">Accepted</h4>
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="py-2 px-4 border">Resident Name</th>
                      <th className="py-2 px-4 border">Service</th>
                      <th className="py-2 px-4 border">Date & Time</th>
                      <th className="py-2 px-4 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings
                      .filter((b) => b.status === "accepted" && !b.completed)
                      .map((row) => (
                        <tr key={row._id}>
                          <td className="py-2 px-4 border">
                            {row.resident?.name}
                          </td>
                          <td className="py-2 px-4 border">{row.service}</td>
                          <td className="py-2 px-4 border">
                            {new Date(row.date).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">
                            {row.status.charAt(0).toUpperCase() +
                              row.status.slice(1)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {bookingTab === "Rejected" && (
              <div>
                <h4 className="font-bold mb-2">Rejected</h4>
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="py-2 px-4 border">Resident Name</th>
                      <th className="py-2 px-4 border">Service</th>
                      <th className="py-2 px-4 border">Date & Time</th>
                      <th className="py-2 px-4 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings
                      .filter((b) => b.status === "rejected")
                      .map((row) => (
                        <tr key={row._id}>
                          <td className="py-2 px-4 border">
                            {row.resident?.name}
                          </td>
                          <td className="py-2 px-4 border">{row.service}</td>
                          <td className="py-2 px-4 border">
                            {new Date(row.date).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border">
                            {row.status.charAt(0).toUpperCase() +
                              row.status.slice(1)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
