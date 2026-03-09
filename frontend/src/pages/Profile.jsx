import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── SVG Icons ────────────────────────────────────────────────────────────────


const UserIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const BioIcon = () => (
    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const SignOutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const PersonalInfoIcon = () => (
    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);



// ─── Info Field Card ───────────────────────────────────────────────────────────
function InfoField({ icon, label, value }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
            <div className="mt-0.5 flex-shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
            </div>
        </div>
    );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, loading }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">{label}</p>
            {loading ? (
                <div className="w-10 h-7 bg-gray-100 rounded-lg animate-pulse mt-1" />
            ) : (
                <p className="text-3xl font-bold text-[#2563EB]">{value}</p>
            )}
        </div>
    );
}

// ─── Main Profile Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ tasks: 0, leads: 0, employees: 0 });
    const [statsLoading, setStatsLoading] = useState(true);


    // Load user from localStorage
    useEffect(() => {
        const raw = localStorage.getItem("userData");
        if (raw) {
            try { setUser(JSON.parse(raw)); }
            catch { navigate("/signin"); }
        } else {
            navigate("/signin");
        }
    }, [navigate]);

    // Fetch live stats — each request is independent so a 403 on one
    // (e.g. employee can't access leads/employees) won't zero-out the others.
    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Helper: returns resolved value or null on any error
            const safe = (promise) => promise.catch(() => null);

            const [tasksRes, leadsRes, empRes] = await Promise.all([
                safe(axios.get(`${API_BASE_URL}/tasks`, config)),
                safe(axios.get(`${API_BASE_URL}/leads/all`, config)),
                safe(axios.get(`${API_BASE_URL}/employees/stats`, config)),
            ]);

            const completedTasks = tasksRes
                ? (tasksRes.data.tasks || []).filter(t => t.status === "completed").length
                : 0;
            const closedLeads = leadsRes
                ? (leadsRes.data.data || []).filter(l => l.status === "closed" || l.status === "won").length
                : 0;
            const totalEmployees = empRes
                ? (empRes.data.data?.totalEmployees || 0)
                : 0;

            setStats({ tasks: completedTasks, leads: closedLeads, employees: totalEmployees });
            setStatsLoading(false);
        };
        fetchStats();
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        navigate("/signin");
    };

    const getInitials = (u) => {
        if (!u) return "?";
        return `${(u.first_name || "?")[0]}${(u.last_name || "")[0] || ""}`.toUpperCase();
    };

    const getRoleLabel = (role) => {
        if (!role) return "";
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#EEF2F7] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    const bio = user.bio || "No professional bio added yet.";

    return (
        <>
            <div className="min-h-screen bg-[#EEF2F7] py-10 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* ── Profile Card ──────────────────────────────────────── */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">

                        {/* Header: Avatar + Name + Role + Edit Button */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                {/* Avatar with initials */}
                                <div className="w-16 h-16 rounded-2xl bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                                    <span className="text-white text-xl font-bold tracking-wide">
                                        {getInitials(user)}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{fullName}</h1>
                                    <p className="text-sm font-semibold text-[#2563EB] mt-0.5">
                                        {getRoleLabel(user.role)}
                                    </p>
                                </div>
                            </div>


                        </div>

                        {/* ── Stats Row ─────────────────────────────────────────── */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <StatCard label="Tasks Done" value={stats.tasks} loading={statsLoading} />
                            <StatCard label="Leads Closed" value={stats.leads} loading={statsLoading} />
                            <StatCard label="Team Members" value={stats.employees} loading={statsLoading} />
                        </div>

                        {/* ── Personal Information ───────────────────────────────── */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <PersonalInfoIcon />
                                <h2 className="text-base font-bold text-gray-800">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <InfoField icon={<UserIcon />} label="First Name" value={user.first_name} />
                                <InfoField icon={<UserIcon />} label="Last Name" value={user.last_name} />
                                <InfoField icon={<MailIcon />} label="Email" value={user.email} />
                                <InfoField icon={<PhoneIcon />} label="Phone Number" value={user.phoneNumber} />
                            </div>
                        </div>

                        {/* ── Professional Bio ───────────────────────────────────── */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <BioIcon />
                                <h2 className="text-base font-bold text-gray-800">Professional Bio</h2>
                            </div>
                            <div className="bg-[#F8F9FC] border border-gray-100 rounded-2xl px-6 py-5">
                                <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
                            </div>
                        </div>

                    </div>

                    {/* ── Sign Out Button ──────────────────────────────────────── */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 border border-red-300 text-red-500 font-semibold text-sm rounded-full px-5 py-2.5 hover:bg-red-50 transition-colors"
                        >
                            <SignOutIcon />
                            Sign Out
                        </button>
                    </div>

                </div>
            </div>


        </>
    );
}
