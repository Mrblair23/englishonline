"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const email = urlParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setMessage("Invalid verification link. Token or email is missing.");
        return;
      }

      try {
        const response = await apiFetch("/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(
            "Your email has been verified successfully! You can now sign in."
          );
        } else {
          setStatus("error");
          setMessage(
            data?.error || "Verification failed. The link may have expired."
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen bm-page-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bm-card bm-card-elevated p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="mb-6 flex justify-center">
              <Loader
                size={64}
                className="text-[#3FA9A6] animate-spin"
                strokeWidth={2}
              />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2A44] mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">Please wait a moment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-6 flex justify-center">
              <CheckCircle
                size={64}
                className="text-green-500"
                strokeWidth={2}
              />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2A44] mb-2">
              Email Verified! 🎉
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <a
              href="/account/signin"
              className="bm-btn-primary"
            >
              Sign In
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-6 flex justify-center">
              <XCircle size={64} className="text-red-500" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2A44] mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/account/signup"
                className="bm-btn-outline"
              >
                Sign Up Again
              </a>
              <a
                href="/contact"
                className="bm-btn-primary"
              >
                Contact Support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
