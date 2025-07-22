import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const TABS = [
  "Broadcast",
  "Community Polls",
  "SOS Alerts",
  "Inspections",
  "Complaints",
  "Users",
];

const mockInspections = [
  {
    id: 1,
    area: "Block B Roof",
    guard: "John Guard",
    date: "2024-06-07",
    status: "Completed",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastType, setBroadcastType] = useState("info");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pollQ, setPollQ] = useState("");
  const [pollOpts, setPollOpts] = useState([""]);
  const [userRole, setUserRole] = useState("All");

  // Complaints state for admin
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState("");
  const [complaintsTab, setComplaintsTab] = useState("Open");

  // SOS Alerts state for admin
  const [sosAlerts, setSOSAlerts] = useState([]);
  const [sosLoading, setSOSLoading] = useState(false);
  const [sosError, setSOSError] = useState("");

  // Polls state for admin
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(false);
  const [pollsError, setPollsError] = useState("");
  const [creatingPoll, setCreatingPoll] = useState(false);
  const [createError, setCreateError] = useState("");

  // Fetch announcements when Broadcast tab is active
  useEffect(() => {
    if (activeTab === "Broadcast") {
      fetchAnnouncements();
    }
  }, [activeTab]);

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);
    } catch {
      // error intentionally ignored for linter
    }
  };

  // Fetch complaints when Complaints tab is active
  useEffect(() => {
    if (activeTab === "Complaints") {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchComplaints = async () => {
    setComplaintsLoading(true);
    setComplaintsError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch {
      setComplaintsError("Failed to load complaints");
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Fetch SOS alerts when SOS Alerts tab is active
  useEffect(() => {
    if (activeTab === "SOS Alerts") {
      fetchSOSAlerts();
    }
  }, [activeTab]);

  const fetchSOSAlerts = async () => {
    setSOSLoading(true);
    setSOSError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/sos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSOSAlerts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSOSError("Failed to load SOS alerts");
    } finally {
      setSOSLoading(false);
    }
  };

  // Fetch polls when Community Polls tab is active
  useEffect(() => {
    if (activeTab === "Community Polls") {
      fetchPolls();
    }
  }, [activeTab]);

  const fetchPolls = async () => {
    setPollsLoading(true);
    setPollsError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/polls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPollsError("Failed to load polls");
    } finally {
      setPollsLoading(false);
    }
  };

  const handleBroadcastSubmit = async () => {
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/announcements",
        {
          title: broadcastTitle,
          message: broadcastMsg,
          type: broadcastType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBroadcastTitle("");
      setBroadcastMsg("");
      setBroadcastType("info");
      fetchAnnouncements(); // Refresh the list
    } catch (err) {
      console.error("Failed to send broadcast:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondSOS = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/sos/${id}`,
        {
          status: "resolved",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSOSAlerts();
    } catch {
      alert("Failed to respond to SOS alert.");
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    setCreatingPoll(true);
    setCreateError("");
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/polls",
        { question: pollQ, options: pollOpts.filter((opt) => opt.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPollQ("");
      setPollOpts([""]);
      fetchPolls();
    } catch {
      setCreateError("Failed to create poll");
    } finally {
      setCreatingPoll(false);
    }
  };

  const handleDeletePoll = async (id) => {
    if (!window.confirm("Delete this poll?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/polls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls();
    } catch {
      alert("Failed to delete poll");
    }
  };

  const handleComplaintStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch {
      alert("Failed to update complaint status");
    }
  };

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    if (activeTab === "Users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsersError("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <div className="p-6 mt-20">
      <div className="flex gap-4 mb-6 border-b overflow-x-auto">
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

      {/* Broadcast Tab */}
      {activeTab === "Broadcast" && (
        <div>
          <h3 className="font-bold mb-2">Broadcast Announcement</h3>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="Announcement title..."
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full border rounded p-2"
                value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value)}
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full border rounded p-2"
                placeholder="Write your message..."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                rows={4}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleBroadcastSubmit}
              disabled={
                loading || !broadcastTitle.trim() || !broadcastMsg.trim()
              }
            >
              {loading ? "Sending..." : "Send Broadcast"}
            </button>
          </div>

          <h4 className="font-bold mb-2 mt-6">Previous Broadcasts</h4>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-gray-500 italic">No announcements yet.</p>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="border rounded p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">
                        {announcement.title}
                      </div>
                      <div className="text-gray-700 mt-1">
                        {announcement.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        By: {announcement.author?.name || "Admin"} •{" "}
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.type === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : announcement.type === "error"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {announcement.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Community Polls Tab */}
      {activeTab === "Community Polls" && (
        <div>
          <h3 className="font-bold mb-2">Create Community Poll</h3>
          <form onSubmit={handleCreatePoll} className="mb-6 space-y-2">
            <input
              className="w-full border rounded p-2"
              placeholder="Poll question..."
              value={pollQ}
              onChange={(e) => setPollQ(e.target.value)}
              required
            />
            {pollOpts.map((opt, idx) => (
              <input
                key={idx}
                className="w-full border rounded p-2"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...pollOpts];
                  newOpts[idx] = e.target.value;
                  setPollOpts(newOpts);
                }}
                required
              />
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-gray-300 px-2 py-1 rounded"
                onClick={() => setPollOpts([...pollOpts, ""])}
              >
                Add Option
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={creatingPoll}
              >
                {creatingPoll ? "Creating..." : "Create Poll"}
              </button>
            </div>
            {createError && <div className="text-red-500">{createError}</div>}
          </form>
          <h4 className="font-bold mb-2">Existing Polls</h4>
          {pollsError && <div className="text-red-500 mb-2">{pollsError}</div>}
          {pollsLoading ? (
            <div className="text-gray-500 italic">Loading polls...</div>
          ) : polls.length === 0 ? (
            <div className="text-gray-500 italic">No polls found.</div>
          ) : (
            <ul className="space-y-3">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce(
                  (sum, o) => sum + o.votes,
                  0
                );
                return (
                  <li
                    key={poll._id}
                    className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded text-indigo-900 flex justify-between items-start"
                  >
                    <div>
                      <div className="font-semibold mb-2">{poll.question}</div>
                      {poll.options.map((opt, idx) => (
                        <div key={idx} className="mb-1 flex items-center">
                          <span className="mr-2">{opt.text}</span>
                          <div className="w-2/3 bg-indigo-100 rounded h-4 mx-2 relative">
                            <div
                              className="bg-indigo-500 h-4 rounded"
                              style={{
                                width: `${
                                  totalVotes
                                    ? (opt.votes / totalVotes) * 100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-semibold">
                            {totalVotes
                              ? ((opt.votes / totalVotes) * 100).toFixed(0)
                              : 0}
                            %
                          </span>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-2">
                        Total votes: {totalVotes}
                      </div>
                    </div>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeletePoll(poll._id)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* SOS Alerts Tab */}
      {activeTab === "SOS Alerts" && (
        <div>
          <h3 className="font-bold mb-2">SOS Alerts</h3>
          {sosError && <div className="text-red-500 mb-2">{sosError}</div>}
          {sosLoading ? (
            <div className="text-gray-500 italic">Loading...</div>
          ) : sosAlerts.length === 0 ? (
            <div className="text-gray-500 italic">No SOS alerts.</div>
          ) : (
            <ul className="space-y-3">
              {sosAlerts
                .filter((alert) => alert.status === "active")
                .map((alert) => (
                  <li
                    key={alert._id}
                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-900 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">{alert.type} SOS</div>
                      <div className="text-xs text-red-700 mt-1">
                        Sender: {alert.sender?.name || "Unknown"} (
                        {alert.sender?.email || "Unknown"})
                      </div>
                      <div className="text-xs text-red-700 mt-1">
                        Sent: {new Date(alert.date).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => handleRespondSOS(alert._id)}
                    >
                      Respond
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {/* Inspections Tab */}
      {activeTab === "Inspections" && (
        <div>
          <h3 className="font-bold mb-2">Completed Inspections</h3>
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-green-100">
                <th className="py-2 px-4 border">Area</th>
                <th className="py-2 px-4 border">Guard</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockInspections.map((ins) => (
                <tr key={ins.id}>
                  <td className="py-2 px-4 border">{ins.area}</td>
                  <td className="py-2 px-4 border">{ins.guard}</td>
                  <td className="py-2 px-4 border">{ins.date}</td>
                  <td className="py-2 px-4 border">{ins.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === "Complaints" && (
        <div>
          <div className="flex gap-4 mb-4">
            {["Open", "In Progress", "Resolved"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded font-semibold ${
                  complaintsTab === tab
                    ? "bg-indigo-500 text-white"
                    : "bg-indigo-100 text-indigo-900"
                }`}
                onClick={() => setComplaintsTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <h3 className="font-bold mb-2">All Resident Complaints</h3>
          <button
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={fetchComplaints}
            disabled={complaintsLoading}
          >
            {complaintsLoading ? "Refreshing..." : "Refresh"}
          </button>
          {complaintsError && (
            <div className="text-red-500 mb-2">{complaintsError}</div>
          )}
          {complaintsLoading ? (
            <div className="text-gray-500 italic">Loading...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-2 py-2 text-left">Title</th>
                  <th className="px-2 py-2 text-left">Category</th>
                  <th className="px-2 py-2 text-left">Urgency</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Resident</th>
                  <th className="px-2 py-2 text-left">Email</th>
                  <th className="px-2 py-2 text-left">Description</th>
                  {complaints.some(
                    (c) =>
                      (complaintsTab === "Open" && c.status === "open") ||
                      (complaintsTab === "In Progress" &&
                        c.status === "in progress")
                  ) && <th className="px-2 py-2 text-left">Action</th>}
                </tr>
              </thead>
              <tbody>
                {complaints
                  .filter((c) =>
                    complaintsTab === "Open"
                      ? c.status === "open"
                      : complaintsTab === "In Progress"
                      ? c.status === "in progress"
                      : c.status === "resolved"
                  )
                  .map((c) => (
                    <tr key={c._id} className="border-b border-slate-200">
                      <td className="px-2 py-2">{c.title}</td>
                      <td className="px-2 py-2">{c.category}</td>
                      <td className="px-2 py-2 capitalize">{c.urgency}</td>
                      <td className="px-2 py-2 capitalize">{c.status}</td>
                      <td className="px-2 py-2">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-2 py-2">{c.user?.name || "Unknown"}</td>
                      <td className="px-2 py-2">
                        {c.user?.email || "Unknown"}
                      </td>
                      <td className="px-2 py-2">{c.description}</td>
                      {((complaintsTab === "Open" && c.status === "open") ||
                        (complaintsTab === "In Progress" &&
                          c.status === "in progress")) && (
                        <td className="px-2 py-2">
                          {complaintsTab === "Open" && (
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                              onClick={() =>
                                handleComplaintStatus(c._id, "in progress")
                              }
                            >
                              Start
                            </button>
                          )}
                          {complaintsTab === "In Progress" && (
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={() =>
                                handleComplaintStatus(c._id, "resolved")
                              }
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div>
          <h3 className="font-bold mb-2">All Users</h3>
          <div className="mb-4">
            <label className="mr-2">Filter by Role:</label>
            <select
              className="border rounded px-2 py-1"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="All">All</option>
              <option value="resident">Resident</option>
              <option value="guard">Guard</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {usersError && <div className="text-red-500 mb-2">{usersError}</div>}
          {usersLoading ? (
            <div className="text-gray-500 italic">Loading users...</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => userRole === "All" || u.role === userRole)
                  .map((user) => (
                    <tr key={user._id}>
                      <td className="py-2 px-4 border">{user.name}</td>
                      <td className="py-2 px-4 border">{user.role}</td>
                      <td className="py-2 px-4 border">{user.email}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
