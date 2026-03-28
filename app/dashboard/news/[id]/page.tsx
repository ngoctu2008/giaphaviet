import { getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabase();
  const { id } = await params;

  const { data: news, error } = await supabase
    .from("news")
    .select(`*, profiles:created_by (role)`)
    .eq("id", id)
    .single();

  if (error || !news) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-amber-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại trang chủ
        </Link>
        <span className="mx-2 text-stone-300">|</span>
        <Link href="/dashboard/news" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-amber-700 transition-colors">
           Danh sách tin tức
        </Link>
      </div>

      <article className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {news.thumbnail_url && (
          <div className="w-full h-64 sm:h-80 md:h-96 relative bg-stone-100">
            <img
              src={news.thumbnail_url}
              alt={news.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#8b0000] mb-4 leading-tight">
            {news.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-stone-500 mb-8 border-b border-stone-100 pb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {new Date(news.created_at).toLocaleDateString('vi-VN')}
            </span>
            {!news.is_published && (
              <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-xs font-medium">
                Bản nháp
              </span>
            )}
          </div>

          <div
            className="prose prose-stone prose-lg max-w-none
                       prose-headings:font-serif prose-headings:text-stone-800
                       prose-a:text-amber-700 hover:prose-a:text-amber-800
                       prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>
    </div>
  );
}
