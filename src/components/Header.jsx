import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  Globe,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/utils/useLanguage";
import CountrySelector from "@/components/CountrySelector";
import { routeForRole } from "@/utils/roleRoutes";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, hydrating } = useAuthContext();
  const { language, toggleLanguage } = useLanguage();
  const authBusy = loading || hydrating;
  const currentUser = authBusy ? null : user;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const t = (translations) => translations[language] || translations.en;

  const roleBadgeLabel =
    currentUser?.role === "admin"
      ? "Admin"
      : currentUser?.role === "teacher"
        ? "Teacher"
        : currentUser?.role === "student"
          ? "Student"
          : null;

  const dashboardRoute = routeForRole(currentUser?.role, "/dashboard");

  const publicLinks = [
    { name: t({ en: "Home", es: "Inicio" }), href: "/" },
    { name: t({ en: "Pricing", es: "Precios" }), href: "/pricing" },
    { name: t({ en: "About", es: "Acerca de" }), href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: t({ en: "Contact", es: "Contacto" }), href: "/contact" },
  ];

  const sharedLinks = [
    {
      name: t({ en: "Book a class", es: "Reservar clase" }),
      href: "/book",
      icon: <Calendar size={18} />,
    },
    {
      name: t({ en: "My plan", es: "Mi plan" }),
      href: "/my-plan",
      icon: <CreditCard size={18} />,
    },
    {
      name: t({ en: "Settings", es: "Configuración" }),
      href: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  const roleSpecificMenus = {
    admin: [
      {
        name: t({ en: "Admin Classes", es: "Clases admin" }),
        href: "/admin/classes",
        icon: <Shield size={18} />,
      },
    ],
    teacher: [
      {
        name: t({ en: "My schedule", es: "Mi horario" }),
        href: "/teacher/classes",
        icon: <Calendar size={18} />,
      },
    ],
    student: [
      {
        name: t({ en: "My bookings", es: "Mis reservas" }),
        href: "/my-bookings",
        icon: <Calendar size={18} />,
      },
    ],
  };

  const allAuthLinks = [
    {
      name: t({ en: "Dashboard", es: "Panel" }),
      href: dashboardRoute,
      icon: <LayoutDashboard size={18} />,
    },
    ...((roleSpecificMenus[currentUser?.role] ?? [])),
    ...sharedLinks,
  ];

  return (
    <>
      {/* Email Verification Banner */}
      {currentUser && !currentUser.emailVerified && (
        <div className="w-full bg-yellow-50 border-b border-yellow-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium">
                {t({
                  en: "Please verify your email address to access all features.",
                  es: "Por favor verifica tu correo electrónico para acceder a todas las funciones.",
                })}
              </p>
            </div>
            <a
              href="/account/resend-verification"
              className="text-sm font-semibold text-yellow-900 hover:text-yellow-700 underline whitespace-nowrap"
            >
              {t({ en: "Resend email", es: "Reenviar correo" })}
            </a>
          </div>
        </div>
      )}

      <header className="w-full bg-[#FAF9F7]/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo - Optimized for mobile */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1F2A44] to-[#2B3448] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-[#F2B705] font-bold text-lg sm:text-xl">
                E
              </span>
            </div>
            <span className="text-[#1F2A44] font-semibold text-base sm:text-lg lg:text-xl tracking-tight">
              Be More English Online
            </span>
          </div>

          {/* Desktop Navigation - stays the same */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-[#3FA9A6] font-medium text-sm transition-colors hover:scale-105 inline-block"
              >
                {link.name}
              </a>
            ))}

            {/* Currency Selector (Admin only) - Desktop */}
            {currentUser?.role === "admin" ? (
              <CountrySelector variant="compact" />
            ) : null}

            {/* Language Toggle - Desktop */}
            <button
              onClick={toggleLanguage}
              className="group flex items-center space-x-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#3FA9A6] hover:bg-[#3FA9A6]/5 text-gray-700 hover:text-[#3FA9A6] font-semibold text-sm transition-all hover:scale-105 shadow-sm"
              aria-label="Toggle language"
            >
              <Globe
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              <span>{language === "en" ? "ES" : "EN"}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {roleBadgeLabel && (
                  <span className="rounded-full bg-[#1F2A44]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1F2A44]">
                    {roleBadgeLabel}
                  </span>
                )}
                <a
                  href={dashboardRoute}
                  className="text-sm font-semibold text-[#1F2A44] hover:text-[#3FA9A6] transition-colors"
                >
                  {t({ en: "Dashboard", es: "Panel" })}
                </a>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-[#1F2A44] font-medium text-sm">
                    {currentUser?.imageUrl ? (
                      <img
                        src={currentUser.imageUrl}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border-2 border-[#3FA9A6]/30"
                      />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1F2A44] to-[#2B3448] flex items-center justify-center text-white text-xs font-bold">
                        {(currentUser?.displayName || currentUser?.name)?.[0]?.toUpperCase() || <User size={14} />}
                      </span>
                    )}
                    <span>{t({ en: "My account", es: "Mi cuenta" })}</span>
                    <ChevronDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform"
                    />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                    {allAuthLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#3FA9A6]/5 hover:text-[#3FA9A6] transition-colors"
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </a>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                    <a
                      href="/account/logout"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span>{t({ en: "Logout", es: "Cerrar sesión" })}</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/account/signin"
                  className="text-gray-700 hover:text-[#3FA9A6] font-medium text-sm transition-colors hover:scale-105 inline-block"
                >
                  {t({ en: "Login", es: "Iniciar sesión" })}
                </a>
                <a
                  href="/account/signup"
                  className="bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-md hover:brightness-105 transition-all shadow-sm hover:scale-105"
                >
                  {t({ en: "Sign up", es: "Registrarse" })}
                </a>
              </div>
            )}
          </nav>

          {/* Mobile menu button - Larger touch target */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1F2A44] hover:bg-[#1F2A44]/5 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu overlay - Full height, scrollable */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-[#FAF9F7] z-40 md:hidden overflow-y-auto">
            <div className="p-6 space-y-6 pb-safe">
              <nav className="flex flex-col space-y-1">
                {publicLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base sm:text-lg font-medium text-[#1F2A44] hover:text-[#3FA9A6] hover:bg-[#3FA9A6]/5 border-b border-gray-200/50 py-4 px-2 transition-colors min-h-[52px] flex items-center rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    {link.name}
                  </a>
                ))}

                {/* Country Selector - Mobile */}
                <div className="pt-4">
                  {currentUser?.role === "admin" ? (
                    <CountrySelector variant="compact" />
                  ) : null}
                </div>

                {/* Language Toggle - Mobile with larger touch target */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center space-x-2 px-4 py-4 min-h-[52px] rounded-xl bg-white border border-gray-200 hover:border-[#3FA9A6] hover:bg-[#3FA9A6]/5 text-gray-700 hover:text-[#3FA9A6] font-semibold text-base transition-all shadow-sm w-full mt-2"
                >
                  <Globe size={20} />
                  <span>{language === "en" ? "Español" : "English"}</span>
                </button>

                {currentUser ? (
                  <>
                    <div className="pt-6 pb-2 text-xs font-semibold text-[#3FA9A6] uppercase tracking-wider">
                      {roleBadgeLabel || t({ en: "Portal", es: "Portal" })}
                    </div>
                    {allAuthLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="flex items-center space-x-3 text-base sm:text-lg font-medium text-[#1F2A44] hover:text-[#3FA9A6] hover:bg-[#3FA9A6]/5 py-4 px-2 rounded-lg transition-colors min-h-[52px]"
                        onClick={toggleMobileMenu}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </a>
                    ))}
                    <a
                      href="/account/logout"
                      className="flex items-center space-x-3 text-base sm:text-lg font-medium text-red-600 hover:bg-red-50 py-4 px-2 rounded-lg min-h-[52px] mt-4"
                      onClick={toggleMobileMenu}
                    >
                      <LogOut size={20} />
                      <span>{t({ en: "Logout", es: "Cerrar sesión" })}</span>
                    </a>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-6">
                    <a
                      href="/account/signin"
                      className="flex items-center justify-center px-6 py-4 min-h-[52px] border-2 border-gray-300 rounded-xl font-semibold text-base text-[#1F2A44] hover:border-[#3FA9A6] hover:text-[#3FA9A6] hover:bg-[#3FA9A6]/5 transition-all"
                      onClick={toggleMobileMenu}
                    >
                      {t({ en: "Login", es: "Iniciar sesión" })}
                    </a>
                    <a
                      href="/account/signup"
                      className="flex items-center justify-center px-6 py-4 min-h-[52px] bg-gradient-to-r from-[#F2B705] to-[#f5c642] text-[#1F2A44] rounded-xl font-bold text-base shadow-md hover:shadow-lg hover:brightness-105 transition-all"
                      onClick={toggleMobileMenu}
                    >
                      {t({ en: "Sign up", es: "Registrarse" })}
                    </a>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
