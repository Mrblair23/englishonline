import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

const CountryContext = createContext();

export function CountryProvider({ children }) {
  const auth = useContext(AuthContext);
  const authBusy = Boolean(auth?.loading || auth?.hydrating);
  const currentUser = authBusy ? null : auth?.user;
  const isAdmin = currentUser?.role === "admin";

  const [country, setCountry] = useState("CO"); // Default to Colombia
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setCountry("CO");
      setLoading(false);
      return;
    }

    // Admin-only: load preference from localStorage
    const savedCountry = localStorage.getItem("preferredCountry");
    if (savedCountry === "CO" || savedCountry === "US") {
      setCountry(savedCountry);
    }
    setLoading(false);
  }, [isAdmin]);

  const changeCountry = (newCountry) => {
    if (!isAdmin) return;
    if (newCountry !== "CO" && newCountry !== "US") return;
    setCountry(newCountry);
    localStorage.setItem("preferredCountry", newCountry);
  };

  return (
    <CountryContext.Provider value={{ country, changeCountry, loading }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}

// Helper function to format price based on country
export function formatPrice(priceUsd, priceCop, country) {
  if (country === "CO") {
    return {
      amount: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(priceCop),
      subtitle: `(~USD $${priceUsd})`,
      rawAmount: priceCop,
      currency: "COP",
    };
  } else {
    return {
      amount: `$${priceUsd} USD`,
      subtitle: `(~COP ${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(priceCop)})`,
      rawAmount: priceUsd,
      currency: "USD",
    };
  }
}

// Calculate price per class
export function calculatePricePerClass(
  priceUsd,
  priceCop,
  classesPerWeek,
  country,
) {
  const classesPerMonth = classesPerWeek * 4; // Approximate 4 weeks per month

  if (country === "CO") {
    const pricePerClass = Math.round(priceCop / classesPerMonth);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pricePerClass);
  } else {
    const pricePerClass = (priceUsd / classesPerMonth).toFixed(2);
    return `$${pricePerClass} USD`;
  }
}
