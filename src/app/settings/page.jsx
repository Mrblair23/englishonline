import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/useLanguage";
import {
  User,
  Bell,
  Shield,
  Globe,
  Camera,
  CheckCircle2,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const { data: user, loading } = useUser();
  const { language } = useLanguage();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const t = (translations) => translations[language] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  if (loading) return null;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/account/signin";
    return null;
  }

  return (
    <div className="min-h-screen bm-page-bg">
      <Header />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right-5">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-2xl flex items-start space-x-4 max-w-sm">
            <div className="flex-shrink-0">
              <CheckCircle2 size={24} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">
                {t({
                  en: "Settings saved! ✨",
                  es: "¡Configuración guardada! ✨",
                })}
              </h4>
              <p className="text-sm text-white/90 leading-relaxed">
                {t({
                  en: "Your profile has been updated successfully.",
                  es: "Tu perfil ha sido actualizado exitosamente.",
                })}
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <main className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="bm-page-title mb-12">
            {t({ en: "Account Settings", es: "Configuración de cuenta" })}
          </h1>

          <div className="flex flex-col md:flex-row gap-12">
            {/* Nav */}
            <aside className="w-full md:w-64 space-y-2">
              {[
                {
                  name: t({ en: "Profile", es: "Perfil" }),
                  icon: <User size={18} />,
                  active: true,
                },
                {
                  name: t({ en: "Notifications", es: "Notificaciones" }),
                  icon: <Bell size={18} />,
                  active: false,
                },
                {
                  name: t({ en: "Security", es: "Seguridad" }),
                  icon: <Shield size={18} />,
                  active: false,
                },
                {
                  name: t({ en: "Language", es: "Idioma" }),
                  icon: <Globe size={18} />,
                  active: false,
                },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-bold transition-all hover:scale-105 ${
                    item.active
                      ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/10"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-8">
              <div className="bm-card bm-card-elevated bm-card-pad-lg">
                <div className="flex items-center space-x-8 mb-12 pb-12 border-b border-gray-50">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a] text-3xl font-bold border-4 border-white shadow-lg overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.[0]
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.name}
                    </h2>
                    <p className="text-gray-500">{user.email}</p>
                    {/* Show user role */}
                    <div className="mt-3">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">
                          <Shield size={16} />
                          <span>
                            {t({ en: "Administrator", es: "Administrador" })}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#3FA9A6] to-[#2d8a87] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">
                          <User size={16} />
                          <span>{t({ en: "Student", es: "Estudiante" })}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {t({ en: "Display Name", es: "Nombre para mostrar" })}
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {t({ en: "Email Address", es: "Correo electrónico" })}
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t({ en: "Bio", es: "Biografía" })}
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a] outline-none resize-none transition-all"
                      placeholder={t({
                        en: "Tell us about your learning goals...",
                        es: "Cuéntanos sobre tus objetivos de aprendizaje...",
                      })}
                    ></textarea>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="group bg-[#1e3a8a] text-white px-10 py-4 rounded-2xl font-extrabold hover:brightness-110 hover:scale-105 shadow-lg shadow-blue-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <span>
                        {isSaving
                          ? t({
                              en: "Saving changes...",
                              es: "Guardando cambios...",
                            })
                          : t({ en: "Save Changes", es: "Guardar cambios" })}
                      </span>
                      {!isSaving && (
                        <CheckCircle2
                          size={20}
                          className="group-hover:scale-110 transition-transform"
                        />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
