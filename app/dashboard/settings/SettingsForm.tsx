"use client";

import { SiteSettings } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    site_name: initialSettings?.site_name || "Gia phả Việt",
    logo_url: initialSettings?.logo_url || "",
    footer_address: initialSettings?.footer_address || "",
    footer_email: initialSettings?.footer_email || "",
    footer_phone: initialSettings?.footer_phone || "",
    footer_custom_text: initialSettings?.footer_custom_text || "",
  });

  const [customLinks, setCustomLinks] = useState<Array<{title: string, url: string}>>(
    Array.isArray(initialSettings?.custom_links) ? initialSettings?.custom_links : []
  );

  const handleAddLink = () => {
    setCustomLinks([...customLinks, { title: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...customLinks];
    newLinks[index][field] = value;
    setCustomLinks(newLinks);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();

      // Clean empty links
      const cleanLinks = customLinks.filter(l => l.title.trim() !== "");

      let payload: any = {
        id: 1,
        ...formData,
        custom_links: cleanLinks,
      };

      let { error: updateError } = await supabase
        .from("site_settings")
        .upsert(payload);

      if (updateError && updateError.code === "PGRST204") {
        // Fallback for older database schemas missing custom_links
        const { custom_links, ...rest } = payload;
        const retryRes = await supabase.from("site_settings").upsert(rest);
        updateError = retryRes.error;
      }

      if (updateError) {
        if (updateError.code === "PGRST205") {
          throw new Error("Bảng 'site_settings' chưa được tạo trong CSDL. Vui lòng chạy file script migration.");
        }
        throw updateError;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setError(err.message || "Đã xảy ra lỗi khi lưu cấu hình.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200 flex items-start gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Lưu cấu hình thành công!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-stone-900 border-b pb-2">
            Thông tin chung
          </h3>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tên website (Gia phả)
            </label>
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleChange}
              className="w-full rounded-lg border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 p-2 border"
              placeholder="VD: Gia phả họ Phạm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Logo URL (Đường dẫn ảnh logo)
            </label>
            <input
              type="url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              className="w-full rounded-lg border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 p-2 border"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-stone-900 border-b pb-2">
            Thông tin chân trang (Footer)
          </h3>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Địa chỉ nhà thờ / Từ đường
            </label>
            <input
              type="text"
              name="footer_address"
              value={formData.footer_address}
              onChange={handleChange}
              className="w-full rounded-lg border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 p-2 border"
              placeholder="Thôn Ngọc Trì, xã Bình Chương, tỉnh Quảng Ngãi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Điện thoại liên hệ
              </label>
              <input
                type="text"
                name="footer_phone"
                value={formData.footer_phone}
                onChange={handleChange}
                className="w-full rounded-lg border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 p-2 border"
                placeholder="0901 959 997"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="footer_email"
                value={formData.footer_email}
                onChange={handleChange}
                className="w-full rounded-lg border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 p-2 border"
                placeholder="lienhe@giapha.vn"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Lời nhắn/Thông báo ở Footer
            </label>
            <textarea
              name="footer_custom_text"
              value={formData.footer_custom_text}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border-stone-200 focus:border-amber-500 focus:ring-amber-500 bg-stone-50 p-2 border"
              placeholder="Con cháu họ Phạm muôn đời ghi nhớ công ơn Tổ tiên..."
            />
          </div>
        </div>

        {/* ── Custom Links ──────────────────────────────────── */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-medium text-stone-900">
              Liên kết tùy chỉnh (Footer)
            </h3>
            <button
              type="button"
              onClick={handleAddLink}
              className="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm liên kết
            </button>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Thêm các liên kết ngoài như: Tộc quy, Tộc ước, Quy định sử dụng quỹ, Trang Facebook...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-start bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                    placeholder="VD: Tộc ước dòng họ"
                    className="w-full rounded-md border-stone-200 focus:border-amber-500 focus:ring-amber-500 p-2 border text-sm"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    placeholder="https://example.com/toc-uoc"
                    className="w-full rounded-md border-stone-200 focus:border-amber-500 focus:ring-amber-500 p-2 border text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa liên kết"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {customLinks.length === 0 && (
              <div className="col-span-full py-8 text-center text-stone-400 text-sm border border-dashed border-stone-200 rounded-xl">
                Chưa có liên kết nào được thêm.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
