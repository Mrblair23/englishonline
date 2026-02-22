import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/utils/useLanguage";
import { CountryProvider } from "@/utils/useCountry";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <div className="font-inter antialiased scroll-smooth">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <CountryProvider>
            <div className="animate-fade-in">{children}</div>
          </CountryProvider>
        </LanguageProvider>
      </QueryClientProvider>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
