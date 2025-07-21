import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const TABS = [
  "Pending Gatepasses",
  "Approved/Rejected Log",
  "Visitor Log",
  "SOS Logs",
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [reviewModal, setReviewModal] = useState({ open: false, data: null });
  const [reviewComment, setReviewComment] = useState("");
  const [sosTab, setSosTab] = useState("Overview");
  const [toast, setToast] = useState(null);
  const [approvedTab, setApprovedTab] = useState("Approved");
  const [sosAlerts, setSOSAlerts] = useState([]);
  const [sosLoading, setSOSLoading] = useState(false);
  const [sosError, setSOSError] = useState("");
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [selectedSOSType, setSelectedSOSType] = useState(null);
  const [confirmSOS, setConfirmSOS] = useState(false);
  const [sosSendLoading, setSosSendLoading] = useState(false);
  const [sosSendError, setSosSendError] = useState("");
  const [gatepasses, setGatepasses] = useState([]);
  const [gatepassLoading, setGatepassLoading] = useState(false);
  const [gatepassError, setGatepassError] = useState("");
  const [visitorLog, setVisitorLog] = useState([]);
  const [visitorLogLoading, setVisitorLogLoading] = useState(false);
  const [visitorLogError, setVisitorLogError] = useState("");
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    visitor: "",
    visitTime: "",
    resident: "",
    houseNo: "",
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    if (
      activeTab === "Pending Gatepasses" ||
      activeTab === "Approved/Rejected Log"
    ) {
      fetchGatepasses();
    }
    if (activeTab === "Visitor Log") {
      fetchVisitorLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "SOS Logs" || sosTab === "Respond") {
      fetchSOSAlerts();
    }
  }, [activeTab, sosTab]);

  const fetchGatepasses = async () => {
    setGatepassLoading(true);
    setGatepassError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/gatepass", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGatepasses(Array.isArray(res.data) ? res.data : []);
    } catch {
      setGatepassError("Failed to load gatepasses");
    } finally {
      setGatepassLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/gatepass/${id}`,
        { status, guardComment: reviewComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewModal({ open: false, data: null });
      setReviewComment("");
      fetchGatepasses();
    } catch {
      alert("Failed to update gatepass");
    }
  };

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

  const handleRespondSOS = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/sos/${id}`,
        { status: "resolved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSOSAlerts();
    } catch {
      alert("Failed to respond to SOS alert.");
    }
  };

  const fetchVisitorLogs = async () => {
    setVisitorLogLoading(true);
    setVisitorLogError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/visitorlog", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitorLog(Array.isArray(res.data) ? res.data : []);
    } catch {
      setVisitorLogError("Failed to load visitor logs");
    } finally {
      setVisitorLogLoading(false);
    }
  };

  const handleVisitorInputChange = (e) => {
    const { name, value } = e.target;
    setVisitorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/visitorlog",
        {
          ...visitorForm,
          checkIn: visitorForm.visitTime,
          checkOut: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisitorLog((prev) => [res.data, ...prev]);
      setShowVisitorModal(false);
      setVisitorForm({
        visitor: "",
        visitTime: "",
        resident: "",
        houseNo: "",
        checkIn: "",
        checkOut: "",
      });
    } catch {
      alert("Failed to add visitor log");
    }
  };

  const handleCheckout = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const now = new Date().toLocaleTimeString();
      const res = await api.patch(
        `/visitorlog/${id}`,
        { checkOut: now },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisitorLog((prev) =>
        prev.map((log) =>
          log._id === id ? { ...log, checkOut: res.data.checkOut } : log
        )
      );
    } catch {
      alert("Failed to update checkout time");
    }
  };

  // Modal for reviewing gatepass
  const ReviewModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Review Gatepass</h2>
        <div className="mb-2">
          <b>Visitor:</b> {data.visitor}
        </div>
        <div className="mb-2">
          <b>Purpose:</b> {data.purpose}
        </div>
        <div className="mb-2">
          <b>Time:</b> {data.time}
        </div>
        <div className="mb-2">
          <b>Resident Name:</b> {data.resident}
        </div>
        <div className="mb-2">
          <b>House No:</b> {data.houseNo}
        </div>
        <textarea
          className="w-full border rounded p-2 mt-2 mb-4"
          placeholder="Comments (optional)"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onClose();
              setReviewComment("");
            }}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onClose();
              setReviewComment("");
            }}
          >
            Reject
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Toastify-like notification
  const Toast = ({ message, onClose }) => (
    <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce-in">
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>
        ×
      </button>
    </div>
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

      {/* Pending Gatepasses Tab */}
      {activeTab === "Pending Gatepasses" && (
        <div className="overflow-x-auto">
          {gatepassError && (
            <div className="text-red-500 mb-2">{gatepassError}</div>
          )}
          {gatepassLoading ? (
            <div className="text-gray-500 italic">Loading...</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Visitor</th>
                  <th className="py-2 px-4 border">Purpose</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Resident Name</th>
                  <th className="py-2 px-4 border">House No</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Review</th>
                </tr>
              </thead>
              <tbody>
                {gatepasses
                  .filter((g) => g.status === "pending")
                  .map((row) => (
                    <tr key={row._id}>
                      <td className="py-2 px-4 border">{row.visitor}</td>
                      <td className="py-2 px-4 border">{row.purpose}</td>
                      <td className="py-2 px-4 border">{row.time}</td>
                      <td className="py-2 px-4 border">
                        {row.user?.name ||
                          row.residentName ||
                          row.resident ||
                          "-"}
                      </td>
                      <td className="py-2 px-4 border">{row.houseNo}</td>
                      <td className="py-2 px-4 border text-yellow-600">
                        {row.status}
                      </td>
                      <td className="py-2 px-4 border">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() =>
                            setReviewModal({ open: true, data: row })
                          }
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {reviewModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-4">Review Gatepass</h2>
                <div className="mb-2">
                  <b>Visitor:</b> {reviewModal.data.visitor}
                </div>
                <div className="mb-2">
                  <b>Purpose:</b> {reviewModal.data.purpose}
                </div>
                <div className="mb-2">
                  <b>Time:</b> {reviewModal.data.time}
                </div>
                <div className="mb-2">
                  <b>House No:</b> {reviewModal.data.houseNo}
                </div>
                <textarea
                  className="w-full border rounded p-2 mt-2 mb-4"
                  placeholder="Comments (optional)"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleReview(reviewModal.data._id, "approved")
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleReview(reviewModal.data._id, "rejected")
                    }
                  >
                    Reject
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setReviewModal({ open: false, data: null })}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approved/Rejected Log Tab */}
      {activeTab === "Approved/Rejected Log" && (
        <div>
          <div className="flex gap-4 mb-4">
            {["Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded ${
                  approvedTab === tab
                    ? tab === "Approved"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setApprovedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {approvedTab === "Approved" && (
            <div>
              <h3 className="text-lg font-bold mb-2">Approved</h3>
              <table className="min-w-full bg-white border rounded shadow">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-2 px-4 border">Visitor</th>
                    <th className="py-2 px-4 border">Purpose</th>
                    <th className="py-2 px-4 border">Time</th>
                    <th className="py-2 px-4 border">Resident Name</th>
                    <th className="py-2 px-4 border">House No</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {gatepasses
                    .filter((g) => g.status === "approved")
                    .map((row) => (
                      <tr key={row._id}>
                        <td className="py-2 px-4 border">{row.visitor}</td>
                        <td className="py-2 px-4 border">{row.purpose}</td>
                        <td className="py-2 px-4 border">{row.time}</td>
                        <td className="py-2 px-4 border">
                          {row.user?.name ||
                            row.residentName ||
                            row.resident ||
                            "-"}
                        </td>
                        <td className="py-2 px-4 border">{row.houseNo}</td>
                        <td className="py-2 px-4 border text-green-600">
                          {row.status}
                        </td>
                        <td className="py-2 px-4 border">{row.guardComment}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {approvedTab === "Rejected" && (
            <div>
              <h3 className="text-lg font-bold mb-2">Rejected</h3>
              <table className="min-w-full bg-white border rounded shadow">
                <thead>
                  <tr className="bg-red-100">
                    <th className="py-2 px-4 border">Visitor</th>
                    <th className="py-2 px-4 border">Purpose</th>
                    <th className="py-2 px-4 border">Time</th>
                    <th className="py-2 px-4 border">Resident Name</th>
                    <th className="py-2 px-4 border">House No</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {gatepasses
                    .filter((g) => g.status === "rejected")
                    .map((row) => (
                      <tr key={row._id}>
                        <td className="py-2 px-4 border">{row.visitor}</td>
                        <td className="py-2 px-4 border">{row.purpose}</td>
                        <td className="py-2 px-4 border">{row.time}</td>
                        <td className="py-2 px-4 border">
                          {row.user?.name ||
                            row.residentName ||
                            row.resident ||
                            "-"}
                        </td>
                        <td className="py-2 px-4 border">{row.houseNo}</td>
                        <td className="py-2 px-4 border text-red-600">
                          {row.status}
                        </td>
                        <td className="py-2 px-4 border">{row.guardComment}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Visitor Log Tab */}
      {activeTab === "Visitor Log" && (
        <div className="overflow-x-auto">
          <button
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowVisitorModal(true)}
          >
            Add Visitor
          </button>
          {visitorLogError && (
            <div className="text-red-500 mb-2">{visitorLogError}</div>
          )}
          {visitorLogLoading ? (
            <div className="text-gray-500 italic">Loading...</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Visitor</th>
                  <th className="py-2 px-4 border">Visit Time</th>
                  <th className="py-2 px-4 border">Resident</th>
                  <th className="py-2 px-4 border">House No</th>
                  <th className="py-2 px-4 border">Check-in</th>
                  <th className="py-2 px-4 border">Check-out</th>
                </tr>
              </thead>
              <tbody>
                {visitorLog.map((row) => (
                  <tr key={row._id}>
                    <td className="py-2 px-4 border">{row.visitor}</td>
                    <td className="py-2 px-4 border">{row.visitTime}</td>
                    <td className="py-2 px-4 border">{row.resident}</td>
                    <td className="py-2 px-4 border">{row.houseNo}</td>
                    <td className="py-2 px-4 border">{row.checkIn}</td>
                    <td className="py-2 px-4 border">
                      {row.checkOut ? (
                        row.checkOut
                      ) : (
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() => handleCheckout(row._id)}
                        >
                          Checkout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {showVisitorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-4">Add Visitor</h2>
                <form onSubmit={handleVisitorSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">
                      Visitor Name
                    </label>
                    <input
                      type="text"
                      name="visitor"
                      value={visitorForm.visitor}
                      onChange={handleVisitorInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Visit Time</label>
                    <input
                      type="time"
                      name="visitTime"
                      value={visitorForm.visitTime}
                      onChange={handleVisitorInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Resident Name
                    </label>
                    <input
                      type="text"
                      name="resident"
                      value={visitorForm.resident}
                      onChange={handleVisitorInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">House No</label>
                    <input
                      type="text"
                      name="houseNo"
                      value={visitorForm.houseNo}
                      onChange={handleVisitorInputChange}
                      required
                      className="w-full border border-slate-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Check-in:</span>
                      <span>{visitorForm.visitTime || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Check-out:</span>
                      <span>-</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={() => {
                        setShowVisitorModal(false);
                        setVisitorForm({
                          visitor: "",
                          visitTime: "",
                          resident: "",
                          houseNo: "",
                          checkIn: "",
                          checkOut: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SOS Logs Tab */}
      {activeTab === "SOS Logs" && (
        <div>
          <div className="flex gap-4 mb-4">
            {["Overview", "Create Alert", "Respond"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded font-semibold ${
                  sosTab === tab
                    ? "bg-indigo-500 text-white"
                    : "bg-indigo-100 text-indigo-900"
                }`}
                onClick={() => setSosTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {sosTab === "Overview" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-2xl font-bold">{sosAlerts.length}</div>
                  <div className="text-gray-700 mt-2">Total Alerts</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-2xl font-bold">
                    {sosAlerts.filter((a) => a.status === "active").length}
                  </div>
                  <div className="text-gray-700 mt-2">Active Alerts</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-2xl font-bold">
                    {sosAlerts.filter((a) => a.status === "resolved").length}
                  </div>
                  <div className="text-gray-700 mt-2">Resolved</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-2xl font-bold">
                    {sosAlerts.length > 0
                      ? (
                          (sosAlerts.filter((a) => a.status === "resolved")
                            .length /
                            sosAlerts.length) *
                          100
                        ).toFixed(0) + "%"
                      : "0%"}
                  </div>
                  <div className="text-gray-700 mt-2">Response Rate</div>
                </div>
              </div>
              <h4 className="font-bold mb-2">Recent Alerts</h4>
              {sosLoading ? (
                <div className="text-gray-500 italic">Loading...</div>
              ) : sosError ? (
                <div className="text-red-500 mb-2">{sosError}</div>
              ) : (
                <ul className="space-y-3">
                  {sosAlerts.slice(0, 5).map((alert) => (
                    <li
                      key={alert._id}
                      className={`p-4 rounded shadow flex justify-between items-center ${
                        alert.status === "active"
                          ? "bg-red-50 border-l-4 border-red-400"
                          : "bg-green-50 border-l-4 border-green-400"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{alert.type} SOS</div>
                        <div className="text-xs text-gray-700">
                          {alert.sender?.name || "Unknown"} •{" "}
                          {new Date(alert.date).toLocaleString()}
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

          {/* Create Alert Tab */}
          {sosTab === "Create Alert" && (
            <div>
              <button
                className="mb-4 bg-red-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl z-50 hover:bg-red-700"
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
                        setSosSendError("");
                      }}
                    >
                      ×
                    </button>
                    {!selectedSOSType ? (
                      <>
                        <h2 className="text-xl font-bold mb-4">
                          Select SOS Type
                        </h2>
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
                          Are you sure you want to send a{" "}
                          <b>{selectedSOSType}</b> SOS alert?
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 py-2 rounded bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
                            onClick={() => setSelectedSOSType(null)}
                            disabled={sosSendLoading}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                            onClick={async () => {
                              setSosSendLoading(true);
                              setSosSendError("");
                              try {
                                const token = localStorage.getItem("token");
                                await api.post(
                                  "/sos",
                                  { type: selectedSOSType },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                setConfirmSOS(true);
                                fetchSOSAlerts();
                              } catch {
                                setSosSendError("Failed to send SOS alert.");
                              } finally {
                                setSosSendLoading(false);
                              }
                            }}
                            disabled={sosSendLoading}
                          >
                            {sosSendLoading ? "Sending..." : "Confirm"}
                          </button>
                        </div>
                        {sosSendError && (
                          <div className="text-red-500 mt-2">
                            {sosSendError}
                          </div>
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
                              setSosSendError("");
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
          )}

          {/* Respond Tab */}
          {sosTab === "Respond" && (
            <div>
              <h3 className="font-bold mb-2">Active SOS Alerts</h3>
              {sosLoading ? (
                <div className="text-gray-500 italic">Loading...</div>
              ) : sosError ? (
                <div className="text-red-500 mb-2">{sosError}</div>
              ) : (
                <ul className="space-y-3">
                  {sosAlerts
                    .filter((a) => a.status === "active")
                    .map((alert) => (
                      <li
                        key={alert._id}
                        className="bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-900 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-semibold">{alert.type} SOS</div>
                          <div className="text-xs text-red-700 mt-1">
                            Sender: {alert.sender?.name || "Unknown"}
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
        </div>
      )}
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default Dashboard;
