import React, { useState } from "react";

const TABS = ["Overview", "Manage Bookings"];

const stats = [
  { label: "Total Bookings", value: 2 },
  { label: "Pending Requests", value: 0 },
  { label: "Unique Residents", value: 2 },
  { label: "This Month", value: 2 },
];

const servicesOffered = ["Plumbing", "Electrician", "Cleaning"];

const recentHistory = [
  {
    id: 1,
    resident: "Alice Smith",
    service: "Plumbing",
    date: "2024-06-01 10:00 AM",
    status: "Completed",
  },
  {
    id: 2,
    resident: "Bob Lee",
    service: "Cleaning",
    date: "2024-06-02 02:00 PM",
    status: "Completed",
  },
];

const bookings = [
  {
    id: 1,
    resident: "Alice Smith",
    service: "Plumbing",
    date: "2024-06-05 09:00 AM",
    status: "Pending",
    contact: "9876543210",
  },
  {
    id: 2,
    resident: "Bob Lee",
    service: "Electrician",
    date: "2024-06-06 11:00 AM",
    status: "Accepted",
    contact: "9123456780",
  },
  {
    id: 3,
    resident: "Carol King",
    service: "Cleaning",
    date: "2024-06-07 01:00 PM",
    status: "Rejected",
    contact: "9988776655",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [bookingTab, setBookingTab] = useState("Pending");

  // Filter bookings by search
  const filteredBookings = bookings.filter(
    (b) =>
      b.resident.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      b.status.toLowerCase().includes(search.toLowerCase())
  );

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
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-4 rounded shadow text-center"
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <h4 className="font-bold mb-2">Services offered:</h4>
            <div className="flex gap-2 flex-wrap">
              {servicesOffered.map((service) => (
                <span
                  key={service}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {service}
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
                  <tr key={row.id}>
                    <td className="py-2 px-4 border">{row.resident}</td>
                    <td className="py-2 px-4 border">{row.service}</td>
                    <td className="py-2 px-4 border">{row.date}</td>
                    <td className="py-2 px-4 border">{row.status}</td>
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
          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full max-w-xs"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                      <th className="py-2 px-4 border">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings
                      .filter((b) => b.status === "Pending")
                      .map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 px-4 border">{row.resident}</td>
                          <td className="py-2 px-4 border">{row.service}</td>
                          <td className="py-2 px-4 border">{row.date}</td>
                          <td className="py-2 px-4 border">{row.status}</td>
                          <td className="py-2 px-4 border">{row.contact}</td>
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
                      <th className="py-2 px-4 border">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings
                      .filter((b) => b.status === "Accepted")
                      .map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 px-4 border">{row.resident}</td>
                          <td className="py-2 px-4 border">{row.service}</td>
                          <td className="py-2 px-4 border">{row.date}</td>
                          <td className="py-2 px-4 border">{row.status}</td>
                          <td className="py-2 px-4 border">{row.contact}</td>
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
                      <th className="py-2 px-4 border">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings
                      .filter((b) => b.status === "Rejected")
                      .map((row) => (
                        <tr key={row.id}>
                          <td className="py-2 px-4 border">{row.resident}</td>
                          <td className="py-2 px-4 border">{row.service}</td>
                          <td className="py-2 px-4 border">{row.date}</td>
                          <td className="py-2 px-4 border">{row.status}</td>
                          <td className="py-2 px-4 border">{row.contact}</td>
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
