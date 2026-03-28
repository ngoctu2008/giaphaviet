import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import NewsManager from "./NewsManager";

export const metadata = {
  title: "Tin tức dòng họ | Gia phả Việt",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const canEdit = profile.role === "admin" || profile.role === "editor";

  const supabase = await getSupabase();
  const { data: newsItems, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error && error.code !== "PGRST205" && error.code !== "PGRST116") {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#8b0000]">
          Tin tức dòng họ
        </h1>
        <p className="mt-2 text-stone-600">
          Quản lý các bài viết, tin tức nổi bật, và thông báo của dòng họ.
        </p>
      </div>

      {error?.code === "PGRST205" && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl">
          <h3 className="font-bold text-amber-900 mb-2">Lưu ý quan trọng: Chưa cập nhật Database (CSDL)</h3>
          <p className="text-sm">
            Hệ thống không tìm thấy bảng tin tức trong cơ sở dữ liệu. Để sử dụng đầy đủ tính năng mới, vui lòng vào Supabase SQL Editor và chạy nội dung của file:
            <code className="mx-1 bg-amber-900/10 px-1.5 py-0.5 rounded font-mono text-xs">docs/migrations/03_upgrade_gia_pha_viet.sql</code>
          </p>
        </div>
      )}

      <NewsManager initialNews={newsItems || []} canEdit={canEdit} />
    </div>
  );
}
