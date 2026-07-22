import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import API from "../api";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: "business";
  businessName: string;
  referralCode: string;
};

type ApiError = {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
};

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "business",
    businessName: "",
    referralCode: "",
  });

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    const refFromStorage = localStorage.getItem("affiliate_referral");

    if (refFromUrl) {
      localStorage.setItem("affiliate_referral", refFromUrl);

      setFormData((prev) => ({
        ...prev,
        referralCode: refFromUrl,
      }));

      return;
    }

    if (refFromStorage) {
      setFormData((prev) => ({
        ...prev,
        referralCode: refFromStorage,
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidPhone = (phone: string) => {
    const cleaned = phone.trim().replace(/\s|-/g, "");
    const regex = /^\+?[1-9]\d{7,14}$/;

    return regex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      businessName,
      referralCode,
    } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("⚠️ Please fill in all required fields");
      return;
    }

    if (!businessName.trim()) {
      setError("⚠️ Please enter a business name");
      return;
    }

    if (!phone.trim()) {
      setError("⚠️ Please enter a phone number");
      return;
    }

    if (!isValidPhone(phone.trim())) {
      setError("⚠️ Please enter a valid phone number");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match");
      return;
    }

    try {
      await API.post(
        "/auth/register",
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          userType: "business",
          businessName: businessName.trim(),
          referralCode:
            referralCode ||
            localStorage.getItem("affiliate_referral") ||
            undefined,
        },
        { withCredentials: true }
      );

      localStorage.removeItem("affiliate_referral");

      const { user } = await login(email.trim().toLowerCase(), password, {
        skipRedirect: true,
      });

      if (!user) {
        setError("❌ Failed to log in after registration");
        return;
      }

      if (window.fbq) {
        window.fbq("track", "CompleteRegistration");
        console.log("✅ Facebook Pixel: CompleteRegistration sent");
      }

      navigate("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;

      console.error(
        "Registration error:",
        apiError.response?.data || apiError.message
      );

      if (apiError.response?.status === 400) {
        setError(apiError.response.data?.error || "❌ Email already exists");
        return;
      }

      setError("❌ Unexpected error. Please try again later.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] opacity-20 [background-size:16px_16px] lg:block" />
      </div>

      <main className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
        {/* Left content */}
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            START YOUR 14-DAY FREE TRIAL
          </div>

          <h1 className="mt-8 max-w-2xl text-6xl font-black leading-[0.98] tracking-[-0.05em] text-slate-800 xl:text-7xl">
            Build your
            <br />
            business OS.
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              In minutes.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-xl leading-8 text-slate-600">
            Create your BizUply workspace and manage your business page, CRM,
            clients, appointments, collaborations and AI tools from one premium
            platform.
          </p>

          <div className="mt-10 grid max-w-xl gap-4">
            {[
              ["Business Page", "Launch a professional online presence"],
              ["Smart CRM", "Track leads, clients and follow-ups"],
              ["AI Tools", "Get insights and next-step recommendations"],
            ].map(([title, text], index) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-base font-black text-black shadow-lg shadow-indigo-100">
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
            {[
              "No credit card required",
              "Cancel anytime",
              "All tools included",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-50 text-xs text-indigo-600">
                  ✓
                </span>
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Register card */}
        <section className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-2 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
            <div className="overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white sm:rounded-[2rem]">
              {/* Header */}
              <div className="relative overflow-hidden border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
                  <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
                </div>

                <div className="relative">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl font-black shadow-xl shadow-indigo-950/30">
                    B
                  </div>

                  <h2 className="text-3xl font-black tracking-[-0.04em]">
                    Register
                  </h2>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
                    Create your BizUply business workspace.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-br from-white to-indigo-50/60 px-7 py-7"
              >
                {/* Account type - Business only */}
                <div>
                  <p className="mb-3 text-sm font-black text-slate-700">
                    Account type
                  </p>

                  <div className="rounded-2xl border border-indigo-300 bg-indigo-50 px-4 py-4 shadow-sm">
                    <input
                      type="hidden"
                      name="userType"
                      value="business"
                    />

                    <span className="block text-sm font-black text-slate-800">
                      Business Owner
                    </span>

                    <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                      Manage clients, CRM, appointments and business tools.
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Business name
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Phone number
                  </label>

                  <div className="rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
                    <PhoneInput
                      country="us"
                      enableSearch
                      value={formData.phone}
                      onChange={(phone: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: `+${phone}`,
                        }))
                      }
                      inputStyle={{
                        width: "100%",
                        height: "46px",
                        borderRadius: "14px",
                        border: "0",
                        paddingLeft: "48px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#0f172a",
                        background: "transparent",
                      }}
                      buttonStyle={{
                        border: "0",
                        background: "transparent",
                        borderRadius: "14px",
                      }}
                      dropdownStyle={{
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 20px 60px rgba(15,23,42,0.14)",
                      }}
                    />
                  </div>
                </div>

                {formData.referralCode && (
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-black text-slate-700">
                      Referral code
                    </label>

                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      readOnly
                      placeholder="Referral Code"
                      className="w-full rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 text-sm font-black text-indigo-700 shadow-sm outline-none"
                    />
                  </div>
                )}

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Confirm password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {error && (
                  <p
                    className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="group mt-7 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-8 py-4 text-base font-black text-black shadow-[0_18px_40px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5"
                >
                  Sign Up
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-white/80 px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-black text-indigo-700 hover:text-violet-700"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}