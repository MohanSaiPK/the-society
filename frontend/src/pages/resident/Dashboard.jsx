import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { HiMenu } from "react-icons/hi";

const menuItems = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "complaints", label: "Complaints", icon: "📝" },
  { key: "gatepass", label: "Gatepass", icon: "🚪" },
  { key: "announcements", label: "Announcements", icon: "📢" },
  { key: "community", label: "Community", icon: "👥" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState("overview");
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [selectedSOSType, setSelectedSOSType] = useState(null);
  const [confirmSOS, setConfirmSOS] = useState(false);
  const [sosLoading, setSOSLoading] = useState(false);
  const [sosError, setSOSError] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  // Listen for navbar hamburger event (for resident)
  React.useEffect(() => {
    const handler = () => setNavOpen(true);
    window.addEventListener("openResidentNav", handler);
    return () => window.removeEventListener("openResidentNav", handler);
  }, []);

  // Overview state
  const [complaints, setComplaints] = useState([]);
  const [gatepasses, setGatepasses] = useState([]);
  const [sosAlerts, setSOSAlerts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Fetch complaints
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/complaints");
        setComplaints(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };
    // Fetch gatepasses
    const fetchGatepasses = async () => {
      try {
        const res = await api.get("/gatepass");
        setGatepasses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };
    // Fetch SOS alerts
    const fetchSOSAlerts = async () => {
      try {
        const res = await api.get("/sos");
        setSOSAlerts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };
    // Fetch announcements
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/announcements");
        setAnnouncements(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };
    // Fetch polls
    const fetchPolls = async () => {
      try {
        const res = await api.get("/polls");
        setPolls(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComplaints();
    fetchGatepasses();
    fetchSOSAlerts();
    fetchAnnouncements();
    fetchPolls();
  }, []);

  // Overview card values
  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter((c) => c.status === "open").length;
  const lastGatepass = gatepasses.length > 0 ? gatepasses[0] : null;
  const activeSOS = sosAlerts.filter((a) => a.status === "active").length;
  const unseenAnnouncements = announcements.filter(
    (a) => !(a.seenBy || []).includes(user?.id)
  ).length;
  const unrespondedPolls = polls.filter(
    (p) => !(p.voters || []).includes(user?.id)
  ).length;

  const renderContent = () => {
    switch (selected) {
      case "overview":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl min-h-3/4 mx-auto items-stretch [grid-auto-rows:1fr]">
            {/* Total Complaints */}
            <div className="rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col h-full justify-center bg-yellow-100 col-span-1">
              <h3 className="text-indigo-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Total Complaints
              </h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                {totalComplaints}
              </div>
            </div>
            {/* Open Complaints */}
            <div className="rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col h-full justify-center bg-blue-100 col-span-1">
              <h3 className="text-indigo-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Open Complaints
              </h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                {openComplaints}
              </div>
            </div>
            {/* New Announcements */}
            <div className="bg-purple-100 rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col h-full justify-center col-span-1">
              <h3 className="text-indigo-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                New Announcements
              </h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                {unseenAnnouncements}
              </div>
            </div>
            {/* Active SOS Alerts */}
            <div className="bg-red-100 rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col h-full justify-center col-span-1">
              <h3 className="text-indigo-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Active SOS Alerts
              </h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                {activeSOS}
              </div>
            </div>
            {/* Active Polls (full width on mobile) */}
            <div className="bg-pink-300 rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col h-full justify-center col-span-2 md:col-span-1">
              <h3 className="text-indigo-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Active Polls
              </h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                {unrespondedPolls}
              </div>
            </div>
            {/* Last Gatepass (full width on mobile) */}
            <div className="bg-green-100 rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col h-full justify-center col-span-2 md:col-span-1">
              <h3 className="text-indigo-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                Last Gatepass
              </h3>
              <div className="text-xs sm:text-base text-slate-700">
                {lastGatepass ? (
                  <>
                    <div>
                      <b>Visitor:</b> {lastGatepass.visitor}
                    </div>
                    <div>
                      <b>Purpose:</b> {lastGatepass.purpose}
                    </div>
                    <div>
                      <b>Status:</b>{" "}
                      <span className="text-yellow-500 font-bold">
                        {lastGatepass.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-slate-400">
                      {lastGatepass.date} {lastGatepass.time}
                    </div>
                  </>
                ) : (
                  <span className="text-slate-400">No gatepass found.</span>
                )}
              </div>
            </div>
          </div>
        );
      case "complaints":
        return <ComplaintsSection selected={selected} />;
      case "gatepass":
        return <GatepassSection selected={selected} />;
      case "announcements":
        return <AnnouncementsSection selected={selected} />;
      case "community":
        return <CommunitySection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen mt-20">
      {/* Side nav for desktop, hidden on mobile */}
      <nav className="w-52 bg-white py-5 flex-col items-center shadow-md hidden md:flex">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setSelected(item.key)}
            className={`w-11/12 my-2 px-3 py-3 rounded-lg flex items-center transition-colors duration-200 text-base font-medium ${
              selected === item.key
                ? "text-yellow-400 bg-black font-bold "
                : "text-black bg-yellow-400"
            } hover:text-yellow-500 hover:bg-black shadow-md`}
          >
            <span className="text-2xl mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      {/* Mobile nav drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
          <div className="w-3/4 max-w-xs bg-white py-8 px-4 shadow-lg h-full flex flex-col">
            <button
              className="self-end mb-4 text-2xl text-gray-500 hover:text-black"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation menu"
            >
              &times;
            </button>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setSelected(item.key);
                  setNavOpen(false);
                }}
                className={`w-full my-2 px-3 py-3 rounded-lg flex items-center transition-colors duration-200 text-base font-medium ${
                  selected === item.key
                    ? "text-yellow-400 bg-black font-bold "
                    : "text-black bg-yellow-400"
                } hover:text-yellow-500 hover:bg-black shadow-md`}
              >
                <span className="text-2xl mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setNavOpen(false)}></div>
        </div>
      )}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>
      <button
        className="fixed bottom-8 right-8 bg-red-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl z-50 hover:bg-red-700"
        onClick={() => setShowSOSModal(true)}
        title="Send SOS"
      >
        !
      </button>
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowSOSModal(false);
                setSelectedSOSType(null);
                setConfirmSOS(false);
              }}
            >
              ×
            </button>
            {!selectedSOSType ? (
              <>
                <h2 className="text-xl font-bold mb-4">Select SOS Type</h2>
                <div className="flex gap-4">
                  {["Medical", "Fire", "Security"].map((type) => (
                    <div
                      key={type}
                      className="flex-1 bg-gray-100 rounded-lg p-6 text-center cursor-pointer hover:bg-red-100"
                      onClick={() => setSelectedSOSType(type)}
                    >
                      <div className="text-3xl mb-2">
                        {type === "Medical"
                          ? "🩺"
                          : type === "Fire"
                          ? "🔥"
                          : "🛡️"}
                      </div>
                      <div className="font-semibold">{type}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : !confirmSOS ? (
              <>
                <h2 className="text-xl font-bold mb-4">Confirm SOS</h2>
                <p className="mb-4">
                  Are you sure you want to send a <b>{selectedSOSType}</b> SOS
                  alert?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
                    onClick={() => setSelectedSOSType(null)}
                    disabled={sosLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                    onClick={async () => {
                      setSOSLoading(true);
                      setSOSError("");
                      try {
                        const token = localStorage.getItem("token");
                        await api.post(
                          "/sos",
                          { type: selectedSOSType },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setConfirmSOS(true);
                      } catch {
                        setSOSError("Failed to send SOS alert.");
                      } finally {
                        setSOSLoading(false);
                      }
                    }}
                    disabled={sosLoading}
                  >
                    {sosLoading ? "Sending..." : "Confirm"}
                  </button>
                </div>
                {sosError && (
                  <div className="text-red-500 mt-2">{sosError}</div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">SOS Sent!</h2>
                <p>Your {selectedSOSType} SOS alert has been sent.</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                    onClick={() => {
                      setShowSOSModal(false);
                      setSelectedSOSType(null);
                      setConfirmSOS(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ComplaintsSection = ({ selected }) => {
  const [tab, setTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    title: "",
    urgency: "low",
    category: "general",
    description: "",
  });
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  // const { user } = useAuth(); // Not used
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    if (selected !== "complaints") return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token");
      return;
    }
    console.log("ComplaintsSection useEffect triggered, selected:", selected);
    const fetchComplaints = async () => {
      setLoadingFetch(true);
      setError("");
      try {
        console.log("Fetching complaints from API...");
        const res = await api.get("/complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API response:", res);
        setComplaints(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load complaints", err);
        setError("Failed to load complaints");
      } finally {
        setLoadingFetch(false);
        console.log("LoadingFetch set to false");
      }
    };
    fetchComplaints();
  }, [selected]);

  const tabOptions = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "in progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" },
  ];
  const filtered =
    tab === "all" ? complaints : complaints.filter((c) => c.status === tab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setError("");
    try {
      const res = await api.post("/complaints", form);
      setComplaints((prev) => [res.data, ...prev]);
      setForm({
        title: "",
        urgency: "low",
        category: "general",
        description: "",
      });
      setShowModal(false);
    } catch {
      setError("Failed to add complaint");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;
    setLoadingAction(true);
    setError("");
    try {
      await api.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch {
      setError("Failed to delete complaint");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div>
      {/* Responsive filter/add for mobile, original for desktop */}
      <div className="mb-6">
        {/* Mobile: filter and add buttons */}
        <div className="flex sm:hidden justify-between items-center gap-2">
          <button
            className="bg-indigo-500 text-white rounded-lg px-3 py-1 font-semibold text-sm flex-1 mr-2"
            onClick={() => setShowMobileFilter((v) => !v)}
          >
            Filter
          </button>
          <button
            className="bg-green-500 text-white rounded-lg px-3 py-1 font-semibold text-sm flex-1 ml-2"
            onClick={() => setShowModal(true)}
          >
            Add
          </button>
        </div>
        {/* Mobile: filter options popover */}
        {showMobileFilter && (
          <div className="flex sm:hidden gap-2 mt-2 justify-center animate-fade-in">
            {tabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => {
                  setTab(option.key);
                  setShowMobileFilter(true);
                }}
                className={`px-3 py-1 rounded-full border-none text-sm font-medium transition-colors duration-200 ${
                  tab === option.key
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-indigo-100 text-indigo-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {/* Desktop: original tab and new complaint button */}
        <div className="hidden sm:flex flex-row justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {tabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setTab(option.key)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border-none text-sm sm:text-base mr-1 transition-colors duration-200 font-medium ${
                  tab === option.key
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-indigo-100 text-indigo-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            className="bg-green-500 text-white border-none rounded-lg px-4 sm:px-5 py-1 sm:py-2 font-semibold text-sm sm:text-base cursor-pointer shadow-sm hover:bg-green-600 transition-colors duration-200 ml-2"
            onClick={() => setShowModal(true)}
          >
            + New Complaint
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
      <div className="mt-2">
        {loadingFetch ? (
          <div className="text-gray-500 italic p-6">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 italic p-6">No complaints found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 bg-yellow-100"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-semibold text-base sm:text-lg truncate">
                    {c.title}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 flex flex-col ">
                    <span className="mr-2">Category: {c.category}</span>
                    <span className="mr-2">Urgency: {c.urgency}</span>
                    <span className="mr-2">Date: {c.date}</span>
                  </div>
                  <div className="mt-1 text-gray-700 text-xs sm:text-sm break-words">
                    Description: {c.description}
                  </div>
                </div>
                {c.status === "open" ? (
                  <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                    <span className="capitalize font-semibold text-xs sm:text-base text-white bg-yellow-400 rounded-full px-2 py-1">
                      {c.status}
                    </span>
                    <button
                      className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-base"
                      onClick={() => handleDelete(c._id)}
                      disabled={loadingAction}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="ml-4 items-end flex flex-col gap-2 min-w-fit">
                    <span
                      className={`capitalize font-semibold text-xs sm:text-base ${
                        c.status === "in progress"
                          ? "text-white bg-blue-400 rounded-full px-2 py-1"
                          : "text-white bg-green-400 rounded-full px-2 py-1"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-base sm:text-xl font-bold mb-4">
              New Complaint
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="general">General</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="noise">Noise</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-slate-200 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-300"
                  onClick={() => setShowModal(false)}
                  disabled={loadingAction}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-indigo-600 text-white font-semibold text-sm sm:text-base hover:bg-indigo-700"
                  disabled={loadingAction}
                >
                  {loadingAction ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const GatepassSection = ({ selected }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [gatepasses, setGatepasses] = useState([]);
  const [form, setForm] = useState({
    visitor: "",
    comments: "",
    purpose: "",
    date: "",
    time: "",
  });
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    if (selected !== "gatepass") return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token");
      return;
    }
    const fetchGatepasses = async () => {
      setLoadingFetch(true);
      setError("");
      try {
        const res = await api.get("/gatepass", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGatepasses(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Failed to load gatepasses");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchGatepasses();
  }, [selected]);

  const tabOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];
  const filtered =
    tab === "all" ? gatepasses : gatepasses.filter((g) => g.status === tab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setError("");
    try {
      const res = await api.post("/gatepass", {
        ...form,
        houseNo: user?.houseNumber,
      });
      setGatepasses((prev) => [res.data, ...prev]);
      setForm({
        visitor: "",
        comments: "",
        purpose: "",
        date: "",
        time: "",
      });
      setShowModal(false);
    } catch {
      setError("Failed to add gatepass");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gatepass?"))
      return;
    setLoadingAction(true);
    setError("");
    try {
      await api.delete(`/gatepass/${id}`);
      setGatepasses((prev) => prev.filter((g) => g._id !== id));
    } catch {
      setError("Failed to delete gatepass");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div>
      {/* Responsive filter/add for mobile, original for desktop */}
      <div className="mb-6">
        {/* Mobile: filter and add buttons */}
        <div className="flex sm:hidden justify-between items-center gap-2">
          <button
            className="bg-indigo-500 text-white rounded-lg px-3 py-1 font-semibold text-sm flex-1 mr-2"
            onClick={() => setShowMobileFilter((v) => !v)}
          >
            Filter
          </button>
          <button
            className="bg-green-500 text-white rounded-lg px-3 py-1 font-semibold text-sm flex-1 ml-2"
            onClick={() => setShowModal(true)}
          >
            Add
          </button>
        </div>
        {/* Mobile: filter options popover */}
        {showMobileFilter && (
          <div className="flex sm:hidden gap-2 mt-2 justify-center animate-fade-in">
            {tabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => {
                  setTab(option.key);
                  setShowMobileFilter(false);
                }}
                className={`px-3 py-1 rounded-full border-none text-sm font-medium transition-colors duration-200 ${
                  tab === option.key
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-indigo-100 text-indigo-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {/* Desktop: original tab and new gatepass button */}
        <div className="hidden sm:flex flex-row justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {tabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setTab(option.key)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border-none text-sm sm:text-base mr-1 transition-colors duration-200 font-medium ${
                  tab === option.key
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-indigo-100 text-indigo-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            className="bg-green-500 text-white border-none rounded-lg px-4 sm:px-5 py-1 sm:py-2 font-semibold text-sm sm:text-base cursor-pointer shadow-sm hover:bg-green-600 transition-colors duration-200 ml-2"
            onClick={() => setShowModal(true)}
          >
            + New Gatepass
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
      <div className="mt-2">
        {loadingFetch ? (
          <div className="text-gray-500 italic p-6">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 italic p-6">No gatepasses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((g) => (
              <div
                key={g._id}
                className="flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 bg-yellow-100 lg:min-h-[140px]"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-semibold text-base sm:text-lg truncate">
                    Visitor: {g.visitor}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 flex flex-col">
                    <span className="mr-2">Purpose: {g.purpose}</span>
                    <span className="mr-2">Comments: {g.comments}</span>
                    <span className="mr-2">Date: {g.date}</span>
                    <span className="mr-2">Time: {g.time}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                  <span
                    className={`capitalize font-semibold text-xs sm:text-base ${
                      g.status === "pending"
                        ? "text-white bg-yellow-400 rounded-full px-2 py-1"
                        : g.status === "approved"
                        ? "text-white bg-blue-400 rounded-full px-2 py-1"
                        : g.status === "completed"
                        ? "text-white bg-green-400 rounded-full px-2 py-1"
                        : g.status === "rejected"
                        ? "text-white bg-red-400 rounded-full px-2 py-1"
                        : "text-gray-700 bg-gray-200 rounded-full px-2 py-1"
                    }`}
                  >
                    {g.status}
                  </span>
                  {(g.status === "pending" || g.status === "open") && (
                    <button
                      className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-base"
                      onClick={() => handleDelete(g._id)}
                      disabled={loadingAction}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-base sm:text-xl font-bold mb-4">
              New Gatepass
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Visitor Name
                </label>
                <input
                  type="text"
                  name="visitor"
                  value={form.visitor}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Comments for Guard
                </label>
                <input
                  type="text"
                  name="comments"
                  value={form.comments}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Purpose of Visit
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Visit Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Visit Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  step="60"
                />
                <span className="text-xs text-slate-500">
                  (24-hour format, e.g., 14:30)
                </span>
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-slate-200 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-300"
                  onClick={() => setShowModal(false)}
                  disabled={loadingAction}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-indigo-600 text-white font-semibold text-sm sm:text-base hover:bg-indigo-700"
                  disabled={loadingAction}
                >
                  {loadingAction ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AnnouncementsSection = ({ selected }) => {
  const [tab, setTab] = useState("all");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    if (selected !== "announcements") return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token");
      return;
    }

    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/announcements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnnouncements(Array.isArray(res.data) ? res.data : []);
        // Mark all as seen
        await api.patch(
          "/announcements/seen",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("Failed to load announcements", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [selected]);
  const tabOptions = [
    { key: "all", label: "All" },
    { key: "info", label: "Info" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" },
  ];
  const filtered =
    tab === "all" ? announcements : announcements.filter((a) => a.type === tab);

  const typeStyles = {
    info: "border-blue-300 bg-blue-50 text-blue-900",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
    error: "border-red-300 bg-red-50 text-red-900",
  };

  return (
    <div>
      {/* Responsive filter/add for mobile, original for desktop */}
      <div className="mb-6">
        {/* Mobile: filter and add buttons */}
        <div className="flex sm:hidden justify-between items-center gap-2 w-10">
          <button
            className="bg-indigo-500 text-white rounded-lg px-3 py-1 font-semibold text-sm flex-1 mr-2"
            onClick={() => setShowMobileFilter((v) => !v)}
          >
            Filter
          </button>
        </div>
        {/* Mobile: filter options popover */}
        {showMobileFilter && (
          <div className="flex sm:hidden gap-2 mt-2 justify-start items-center animate-fade-in">
            {tabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => {
                  setTab(option.key);
                  setShowMobileFilter(false);
                }}
                className={`px-3 py-1 rounded-full border-none text-sm font-medium transition-colors duration-200 ${
                  tab === option.key
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-indigo-100 text-indigo-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {/* Desktop: original tab and add button (disabled) */}
        <div className="hidden sm:flex flex-row justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            {tabOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setTab(option.key)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border-none text-sm sm:text-base mr-1 transition-colors duration-200 font-medium ${
                  tab === option.key
                    ? "bg-indigo-500 text-white font-bold"
                    : "bg-indigo-100 text-indigo-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            className="bg-green-500 text-white border-none rounded-lg px-4 sm:px-5 py-1 sm:py-2 font-semibold text-sm sm:text-base cursor-not-allowed opacity-50 ml-2"
            disabled
          >
            + Add
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
      <div className="mt-2">
        {loading ? (
          <div className="text-gray-500 italic p-6">
            Loading announcements...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 italic p-6">
            No announcements found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((a) => (
              <div
                key={a._id}
                className={`flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 lg:min-h-[140px] ${
                  typeStyles[a.type] ||
                  "border-slate-300 bg-slate-50 text-slate-900"
                }`}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-semibold text-base sm:text-lg truncate mb-1">
                    {a.title}
                  </div>
                  <div className="text-xs sm:text-sm break-words mb-1">
                    {a.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-auto">
                    By: {a.author?.name || "Admin"} •{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                  <span
                    className={`capitalize font-semibold text-xs sm:text-base ${
                      a.type === "info"
                        ? "text-blue-900 bg-blue-200"
                        : a.type === "warning"
                        ? "text-yellow-900 bg-yellow-200"
                        : a.type === "error"
                        ? "text-red-900 bg-red-200"
                        : "text-slate-900 bg-slate-200"
                    } rounded-full px-2 py-1`}
                  >
                    {a.type || "info"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommunitySection = () => {
  const [section, setSection] = useState("service");
  // Service Bookings sub-tabs
  const [bookingTab, setBookingTab] = useState("upcoming");
  const [historyTab, setHistoryTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    provider: "",
    service: "",
    date: "",
    time: "",
  });
  // Service booking state
  const [providers, setProviders] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // SOS Alerts state
  const [sosAlerts, setSOSAlerts] = useState([]);
  const [sosLoading, setSOSLoading] = useState(false);
  const [sosError, setSOSError] = useState("");
  // Polls state
  const [polls, setPolls] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(false);
  const [pollsError, setPollsError] = useState("");
  const [voting, setVoting] = useState({});
  const [showHistoryFilter, setShowHistoryFilter] = useState(false);

  useEffect(() => {
    if (section === "service") {
      fetchProviders();
      fetchBookings();
    }
    if (section === "sos") {
      fetchSOSAlerts();
    }
    if (section === "polls") {
      fetchPolls();
    }
  }, [section]);

  // Service Bookings logic
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/providers");
      setProviders(res.data);
    } catch {
      setError("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  const handleProviderChange = (e) => {
    const providerId = e.target.value;
    setForm((prev) => ({ ...prev, provider: providerId, service: "" }));
    const selected = providers.find((p) => p._id === providerId);
    setProviderServices(selected ? selected.services : []);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/bookings", {
        providerId: form.provider,
        service: form.service,
        date: form.date,
        time: form.time,
      });
      setShowModal(false);
      setForm({ provider: "", service: "", date: "", time: "" });
      fetchBookings();
    } catch {
      setError("Failed to book service");
    } finally {
      setLoading(false);
    }
  };
  // Filter bookings for upcoming/history
  const now = new Date();
  // Update upcoming bookings filter to only show accepted or pending and not completed or rejected
  const upcoming = bookings.filter(
    (b) =>
      new Date(b.date) > now &&
      (b.status === "accepted" || b.status === "pending") &&
      !b.completed
  );
  // In CommunitySection, update the historyTab options to include 'completed'
  // Update filteredHistory logic to support completed tab
  const historyTabOptions = [
    "all",
    "pending",
    "accepted",
    "rejected",
    "completed",
  ];
  const filteredHistory =
    historyTab === "all"
      ? bookings
      : historyTab === "completed"
      ? bookings.filter((b) => b.completed)
      : bookings.filter((b) => b.status === historyTab && !b.completed);

  const handleMarkCompleted = async (bookingId) => {
    setLoading(true);
    setError("");
    try {
      await api.patch(`/bookings/resident/bookings/${bookingId}/complete`);
      fetchBookings();
    } catch {
      setError("Failed to mark as completed");
    } finally {
      setLoading(false);
    }
  };

  // SOS Alerts logic
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
  // Polls logic
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
  const handleVote = async (pollId, optionIndex) => {
    setVoting((prev) => ({ ...prev, [pollId]: true }));
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/polls/vote",
        { pollId, optionIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPolls();
    } catch {
      alert("Failed to vote. You may have already voted.");
    } finally {
      setVoting((prev) => ({ ...prev, [pollId]: false }));
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full border-none text-base transition-colors duration-200 font-medium ${
            section === "service"
              ? "bg-indigo-500 text-white font-bold"
              : "bg-indigo-100 text-indigo-900"
          }`}
          onClick={() => setSection("service")}
        >
          Service Bookings
        </button>
        <button
          className={`px-4 py-2 rounded-full border-none text-base transition-colors duration-200 font-medium ${
            section === "sos"
              ? "bg-indigo-500 text-white font-bold"
              : "bg-indigo-100 text-indigo-900"
          }`}
          onClick={() => setSection("sos")}
        >
          SOS Alerts
        </button>
        <button
          className={`px-4 py-2 rounded-full border-none text-base transition-colors duration-200 font-medium ${
            section === "polls"
              ? "bg-indigo-500 text-white font-bold"
              : "bg-indigo-100 text-indigo-900"
          }`}
          onClick={() => setSection("polls")}
        >
          Community Polls
        </button>
      </div>
      {/* Service Bookings Section */}
      {section === "service" && (
        <div>
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-full border-none text-base transition-colors duration-200 font-medium ${
                bookingTab === "upcoming"
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-blue-100 text-blue-900"
              }`}
              onClick={() => setBookingTab("upcoming")}
            >
              Upcoming Bookings
            </button>
            <button
              className={`px-4 py-2 rounded-full border-none text-base transition-colors duration-200 font-medium ${
                bookingTab === "history"
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-blue-100 text-blue-900"
              }`}
              onClick={() => setBookingTab("history")}
            >
              Booking History
            </button>
          </div>
          {/* Book New Service button at top for both tabs */}
          {bookingTab === "upcoming" && (
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="font-semibold text-lg mb-0">Upcoming Bookings</h3>
              <button
                className="bg-indigo-600 text-white border-none rounded-lg px-4 py-2 font-semibold text-sm sm:text-base cursor-pointer shadow-sm hover:bg-indigo-700 transition-colors duration-200 ml-2"
                onClick={() => setShowModal(true)}
              >
                Book New Service
              </button>
            </div>
          )}
          {bookingTab === "upcoming" &&
            (loading ? (
              <div className="text-gray-500 italic p-6">Loading...</div>
            ) : upcoming.length === 0 ? (
              <div className="text-gray-500 italic p-6">
                No upcoming bookings.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {upcoming.map((b) => (
                  <div
                    key={b._id}
                    className="flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 bg-white min-h-[140px]"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="font-bold text-base sm:text-lg text-black truncate mb-1">
                        {b.provider?.name || "service"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1">
                        {b.service}
                      </div>
                      <div className="flex justify-between items-center mt-2 text-gray-700 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <i className="fa-regular fa-calendar"></i>
                          <span>{new Date(b.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fa-regular fa-clock"></i>
                          <span>{b.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                      <span
                        className={`capitalize font-semibold text-xs sm:text-base ${
                          b.status === "pending"
                            ? "text-white bg-yellow-400 rounded-full px-2 py-1"
                            : b.status === "accepted"
                            ? "text-white bg-blue-400 rounded-full px-2 py-1"
                            : b.status === "completed"
                            ? "text-white bg-green-400 rounded-full px-2 py-1"
                            : b.status === "rejected"
                            ? "text-white bg-red-400 rounded-full px-2 py-1"
                            : "text-gray-700 bg-gray-200 rounded-full px-2 py-1"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          {/* Booking History Tab */}
          {bookingTab === "history" && (
            <>
              <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <button
                    className="bg-indigo-500 text-white rounded-lg px-3 py-1 font-semibold text-sm"
                    onClick={() => setShowHistoryFilter((v) => !v)}
                  >
                    Filter
                  </button>
                  <button
                    className="bg-indigo-600 text-white border-none rounded-lg px-4 py-2 font-semibold text-sm sm:text-base cursor-pointer shadow-sm hover:bg-indigo-700 transition-colors duration-200"
                    onClick={() => setShowModal(true)}
                  >
                    Book New Service
                  </button>
                </div>
                {showHistoryFilter && (
                  <div className="flex gap-2 ml-4 animate-fade-in">
                    {historyTabOptions.map((tabOpt) => (
                      <button
                        key={tabOpt}
                        className={`px-3 py-1 rounded-full border-none text-sm font-medium transition-colors duration-200 ${
                          historyTab === tabOpt
                            ? "bg-indigo-500 text-white font-bold"
                            : "bg-indigo-100 text-indigo-900"
                        }`}
                        onClick={() => {
                          setHistoryTab(tabOpt);
                          setShowHistoryFilter(false);
                        }}
                      >
                        {tabOpt.charAt(0).toUpperCase() + tabOpt.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">Booking History</h3>
              {loading ? (
                <div className="text-gray-500 italic p-6">Loading...</div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-gray-500 italic p-6">
                  No bookings found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {filteredHistory.map((b) => (
                    <div
                      key={b._id}
                      className="flex flex-row items-start justify-between rounded-xl shadow-xl p-3 sm:p-4 bg-white min-h-[140px]"
                    >
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="font-bold text-base sm:text-lg text-black truncate mb-1">
                          {b.provider?.name || "service"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">
                          {b.service}
                        </div>
                        <div className="flex justify-between items-center mt-2 text-gray-700 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <i className="fa-regular fa-calendar"></i>
                            <span>{new Date(b.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="fa-regular fa-clock"></i>
                            <span>{b.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4 items-end min-w-fit">
                        <span
                          className={`capitalize font-semibold text-xs sm:text-base ${
                            b.completed
                              ? "text-white bg-green-400 rounded-full px-2 py-1"
                              : b.status === "pending"
                              ? "text-white bg-yellow-400 rounded-full px-2 py-1"
                              : b.status === "accepted"
                              ? "text-white bg-blue-400 rounded-full px-2 py-1"
                              : b.status === "rejected"
                              ? "text-white bg-red-400 rounded-full px-2 py-1"
                              : "text-gray-700 bg-gray-200 rounded-full px-2 py-1"
                          }`}
                        >
                          {b.completed ? "Completed" : b.status}
                        </span>
                        {b.status === "accepted" && !b.completed && (
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base"
                            onClick={() => handleMarkCompleted(b._id)}
                            disabled={loading}
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-xs sm:max-w-md p-4 sm:p-8 relative overflow-y-auto max-h-[90vh]">
                <h2 className="text-base sm:text-xl font-bold mb-4">
                  Book New Service
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                      Service Provider Name
                    </label>
                    <select
                      name="provider"
                      value={form.provider}
                      onChange={handleProviderChange}
                      required
                      className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="">Select provider</option>
                      {providers.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                      Service
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      disabled={!form.provider}
                    >
                      <option value="">Select service</option>
                      {providerServices.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      step="60"
                    />
                  </div>
                  <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-slate-200 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-300"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-indigo-600 text-white font-semibold text-sm sm:text-base hover:bg-indigo-700"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                  {error && (
                    <div className="text-red-500 mt-2 text-sm">{error}</div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {/* SOS Alerts Section */}
      {section === "sos" && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Your SOS Alerts</h3>
          {sosError && <div className="text-red-500 mb-2">{sosError}</div>}
          {sosLoading ? (
            <div className="text-gray-500 italic p-6">Loading...</div>
          ) : sosAlerts.length === 0 ? (
            <div className="text-gray-500 italic p-6">No SOS alerts.</div>
          ) : (
            <ul className="space-y-3">
              {sosAlerts.map((alert) => (
                <li
                  key={alert._id}
                  className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-900 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{alert.type} SOS</div>
                    <div className="text-xs text-red-700 mt-1">
                      Sent: {new Date(alert.date).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === "active"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {alert.status === "active" ? "Active" : "Resolved"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Community Polls Section */}
      {section === "polls" && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Community Polls</h3>
          {pollsError && <div className="text-red-500 mb-2">{pollsError}</div>}
          {pollsLoading ? (
            <div className="text-gray-500 italic p-6">Loading polls...</div>
          ) : polls.length === 0 ? (
            <div className="text-gray-500 italic p-6">No polls found.</div>
          ) : (
            <ul className="space-y-3">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce(
                  (sum, o) => sum + o.votes,
                  0
                );
                const hasVoted = poll.voters.includes(
                  /* get user id from token */ JSON.parse(
                    atob(localStorage.getItem("token").split(".")[1])
                  ).id
                );
                return (
                  <li
                    key={poll._id}
                    className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded text-indigo-900"
                  >
                    <div className="font-semibold mb-2">{poll.question}</div>
                    {hasVoted ? (
                      <div>
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
                    ) : (
                      <div className="flex flex-col gap-2">
                        {poll.options.map((opt, idx) => (
                          <button
                            key={idx}
                            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                            onClick={() => handleVote(poll._id, idx)}
                            disabled={!!voting[poll._id]}
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
