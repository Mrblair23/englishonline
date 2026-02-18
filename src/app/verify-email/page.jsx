import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/utils/apiClient";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    let isActive = true;

    async function verify() {
      try {
        const response = await apiFetch(
          `/auth/verify-email?token=${encodeURIComponent(token)}`
        );
        if (!response.ok) {
          throw new Error("Verification failed");
        }

        if (isActive) {
          setStatus("success");
        }

        setTimeout(() => {
          if (isActive) {
            window.location.href = "/account/signin";
          }
        }, 2500);
      } catch (error) {
        if (isActive) {
          setStatus("error");
          setMessage("This verification link is invalid or has expired.");
        }
      }
    }

    verify();

    return () => {
      isActive = false;
    };
  }, []);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <p className="text-gray-600 text-center">Verifying your email…</p>
      );
    }

    if (status === "success") {
      return (
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Email verified 🎉
          </h1>
          <p className="text-gray-600">
            Your email has been verified successfully.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Verification failed
        </h1>
        <p className="text-gray-600 mb-6">
          {message || "This verification link is invalid or has expired."}
        </p>
        <button
          onClick={() => (window.location.href = "/account/signin")}
          className="inline-block bg-[#1e3a8a] text-white py-3 px-6 rounded-2xl font-bold hover:brightness-110 transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bm-page-bg overflow-x-hidden">
      <Header />

      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bm-card bm-card-elevated p-8 sm:p-12">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
