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
    <div className="p-6 mt-20">
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
            <div className="bg-yellow-100 p-4 rounded shadow-xl text-center">
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="text-gray-500">Total Bookings</div>
            </div>
            <div className="bg-blue-100 p-4 rounded shadow-xl text-center">
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <div className="text-gray-500">Pending Requests</div>
            </div>
            <div className="bg-green-100 p-4 rounded shadow-xl text-center">
              <div className="text-2xl font-bold">{stats.uniqueResidents}</div>
              <div className="text-gray-500">Unique Residents</div>
            </div>
            <div className="bg-pink-100 p-4 rounded shadow-xl text-center">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {recentHistory.map((row) => (
                <div
                  key={row._id}
                  className="flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 bg-white min-h-[120px]"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="font-semibold text-base sm:text-lg truncate mb-1">
                      {row.resident?.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      {row.service}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      {new Date(row.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                    <span className="capitalize font-semibold text-xs sm:text-base text-white bg-green-400 rounded-full px-2 py-1">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manage Bookings Tab */}
      {activeTab === "Manage Bookings" && (
        <div className="flex flex-col gap-4 ">
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
            {/* Cards for each tab */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredBookings
                .filter((b) =>
                  bookingTab === "Pending"
                    ? b.status === "pending"
                    : bookingTab === "Accepted"
                    ? b.status === "accepted" && !b.completed
                    : b.status === "rejected"
                )
                .map((row) => (
                  <div
                    key={row._id}
                    className="flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 bg-white min-h-[120px]"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="font-semibold text-base sm:text-lg truncate mb-1">
                        {row.resident?.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        {row.service}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        {new Date(row.date).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                      <span
                        className={`capitalize font-semibold text-xs sm:text-base ${
                          row.status === "pending"
                            ? "text-white bg-yellow-400"
                            : row.status === "accepted"
                            ? "text-white bg-green-400"
                            : row.status === "rejected"
                            ? "text-white bg-red-400"
                            : "text-gray-700 bg-gray-200"
                        } rounded-full px-2 py-1`}
                      >
                        {row.status.charAt(0).toUpperCase() +
                          row.status.slice(1)}
                      </span>
                      {bookingTab === "Pending" && (
                        <div className="flex gap-2">
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
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
