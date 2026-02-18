import React from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    key: "group_2x",
    title: "Group 2x/week",
    price: "$80/month",
    description: "Join group classes twice a week. Best for steady progress.",
    route: "/payment?plan=group_2x",
  },
  {
    key: "group_3x",
    title: "Group 3x/week",
    price: "$102/month",
    description: "Join group classes three times a week. Most popular!",
    route: "/payment?plan=group_3x",
  },
  {
    key: "duo",
    title: "Duo",
    price: "$60/month",
    description: "Small group (2 students). More attention, flexible schedule.",
    route: "/payment?plan=duo",
  },
  {
    key: "private",
    title: "1:1 Specialized",
    price: "$35/session",
    description: "Private, specialized lessons. Pay per session.",
    route: "/payment?plan=private",
  },
];

export default function ChoosePlanPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f7f7fa" }}>
      <h1 style={{ marginBottom: 32 }}>Choose Your Plan</h1>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {plans.map((plan) => (
          <div key={plan.key} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 28, minWidth: 240, maxWidth: 280, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>{plan.title}</h2>
            <div style={{ fontWeight: 600, fontSize: 20, margin: "12px 0" }}>{plan.price}</div>
            <div style={{ color: "#555", marginBottom: 18, textAlign: "center" }}>{plan.description}</div>
            <button
              style={{ padding: "10px 24px", borderRadius: 6, border: "none", background: "#2d7ff9", color: "#fff", fontWeight: 600, cursor: "pointer" }}
              onClick={() => navigate(plan.route)}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
