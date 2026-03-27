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
          <p className="text-sm">
            Hệ thống không tìm thấy bảng cấu hình trong cơ sở dữ liệu. Để sử dụng đầy đủ các tính năng mới, vui lòng vào Supabase SQL Editor và chạy nội dung của file:
            <code className="mx-1 bg-amber-900/10 px-1.5 py-0.5 rounded font-mono text-xs">docs/migrations/03_upgrade_gia_pha_viet.sql</code>
          </p>
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
