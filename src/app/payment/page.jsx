"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  const [loading, setLoading] = useState(false);

  const handlePaid = async () => {
    setLoading(true);
    try {
      await fetch("/api/subscription/request-activation", {
        method: "POST",
        credentials: "include",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f7fa",
      }}
    >
      <h1 style={{ marginBottom: 16 }}>Payment Instructions</h1>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: 32,
          minWidth: 320,
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <p>
          <strong>Selected Plan:</strong> {plan}
        </p>

        <p style={{ marginTop: 16 }}>Please send payment via Zelle to:</p>

        <p style={{ fontWeight: "bold", marginBottom: 24 }}>
          admin@englishonline.com
        </p>

        <button
          onClick={handlePaid}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "I've Paid"}
        </button>
      </div>
    </div>
  );
}
