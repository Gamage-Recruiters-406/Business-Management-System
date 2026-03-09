import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// SVG Icons
const MailIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const LockIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);
const EyeIcon = ({ open }) =>
  open ? (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  ) : (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

// Plain text input (no icon)
const TextField = ({ label, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      className={`w-full border rounded-xl bg-[#F8F9FC] px-4 h-12 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors ${error ? "border-red-400" : "border-gray-200 focus:border-[#2563EB]"}`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

// Password input with eye toggle
const PasswordField = ({ label, show, onToggle, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div
      className={`flex items-center border rounded-xl bg-[#F8F9FC] px-4 h-12 transition-colors ${error ? "border-red-400" : "border-gray-200 focus-within:border-[#2563EB]"}`}
    >
      <LockIcon />
      <input
        type={show ? "text" : "password"}
        className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder-gray-400"
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
      >
        <EyeIcon open={show} />
      </button>
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

export default function SignUpPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    NIC: "",
    role: "employee",
  });

  const updateField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "First name is required";
    if (!form.last_name.trim()) e.last_name = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{10,15}$/.test(form.phoneNumber))
      e.phoneNumber = "Invalid phone (e.g. +94771234567)";
    if (!form.NIC.trim()) e.NIC = "NIC is required";
    else if (!/^[0-9]{9}[VvXx]$|^[0-9]{12}$/.test(form.NIC))
      e.NIC = "Invalid NIC (e.g. 123456789V or 200012345678)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phoneNumber: form.phoneNumber.trim(),
          NIC: form.NIC.trim(),
          role: form.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.message || "Registration failed. Please try again.");
        return;
      }
      navigate("/signin", {
        state: { message: "Account created! Please sign in." },
      });
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F7] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg px-10 py-10">
        {/* Brand badge */}
        <div className="flex flex-col items-center mb-8">
          <span className="bg-[#E8EEFF] text-[#2563EB] text-[11px] font-semibold tracking-widest px-4 py-1.5 rounded-full mb-5">
            BIZMANAGER
          </span>
          <h1 className="text-[2rem] font-bold text-gray-900 mb-2 tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-gray-500">
            Fill in your details to get started
          </p>
        </div>

        <form onSubmit={handleSignUp} noValidate>
          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {apiError}
            </div>
          )}

          {/* First & Last Name row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                label="First Name"
                placeholder="John"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                error={errors.first_name}
                autoComplete="given-name"
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Last Name"
                placeholder="Doe"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                error={errors.last_name}
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Email — keep mail icon as it matches the design */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div
              className={`flex items-center border rounded-xl bg-[#F8F9FC] px-4 h-12 transition-colors ${errors.email ? "border-red-400" : "border-gray-200 focus-within:border-[#2563EB]"}`}
            >
              <MailIcon />
              <input
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder-gray-400"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <TextField
            label="Phone Number"
            type="tel"
            placeholder="+94771234567"
            value={form.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
            autoComplete="tel"
          />

          {/* NIC */}
          <TextField
            label="NIC"
            placeholder="123456789V or 200012345678"
            value={form.NIC}
            onChange={(e) => updateField("NIC", e.target.value)}
            error={errors.NIC}
          />

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="w-full border border-gray-200 rounded-xl bg-[#F8F9FC] px-4 h-12 text-sm text-gray-800 outline-none focus:border-[#2563EB] transition-colors cursor-pointer"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <PasswordField
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            error={errors.password}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <PasswordField
            label="Confirm Password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            autoComplete="new-password"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl py-3.5 text-base transition-colors mt-2 mb-6 ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#2563EB] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
