import useAuth from "@/utils/useAuth";
import { useEffect } from "react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: true });
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bm-page-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900">Signing you out...</h2>
      </div>
    </div>
  );
}
