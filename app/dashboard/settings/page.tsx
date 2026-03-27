import { getProfile, getSettings, getSupabase } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const metadata = {
  title: "Cấu hình chung | Gia phả Việt",
};

export default async function SettingsPage() {
  const profile = await getProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const settings = await getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-stone-800">
          Cấu hình chung website
        </h1>
        <p className="mt-2 text-stone-600">
          Thay đổi tên, logo, địa chỉ, và thông tin liên hệ hiển thị ở chân
          trang (Footer) của hệ thống gia phả.
        </p>
      </div>

      {!settings && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl">
          <h3 className="font-bold text-amber-900 mb-2">Lưu ý quan trọng: Chưa cập nhật Database (CSDL)</h3>
          <p className="text-sm mb-3">Hệ thống không tìm thấy bảng <code>site_settings</code> trong cơ sở dữ liệu. Để lưu cấu hình, bạn cần chạy đoạn mã SQL dưới đây trong Supabase SQL Editor:</p>
          <pre className="bg-amber-900/5 p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap font-mono border border-amber-900/10">
{`CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Gia phả Việt',
  logo_url TEXT,
  footer_address TEXT,
  footer_email TEXT,
  footer_phone TEXT,
  footer_custom_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Enable update for admins" ON public.site_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Enable insert for admins" ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());`}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6">
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}
