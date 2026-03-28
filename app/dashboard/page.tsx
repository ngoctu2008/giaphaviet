import { getTodayLunar } from "@/utils/dateHelpers";
import { computeEvents } from "@/utils/eventHelpers";
import { getIsAdmin, getSupabase, getSettings } from "@/utils/supabase/queries";
import {
  ArrowRight,
  BarChart2,
  Cake,
  CalendarDays,
  Database,
  Flower2,
  GitMerge,
  Network,
  Star,
  Users,
  Info,
  HeartHandshake
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;
export const dynamic = "force-dynamic";

/* ── Event type helpers ───────────────────────────────────────────── */
const eventTypeConfig = {
  birthday: {
    icon: Cake,
    label: "Sinh nhật",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  death_anniversary: {
    icon: Flower2,
    label: "Ngày giỗ",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  custom_event: {
    icon: Star,
    label: "Sự kiện",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

export default async function DashboardLaunchpad() {
  const isAdmin = await getIsAdmin();
  const supabase = await getSupabase();
  const settings = await getSettings();

  /* ── Fetch events data ────────────────────────────────────────── */
  const { data: persons } = await supabase
    .from("persons")
    .select(
      "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased",
    );

  const { data: customEvents } = await supabase
    .from("custom_events")
    .select("id, name, content, event_date, location, created_by");

  const { data: recentNews, error: newsError } = await supabase
    .from("news")
    .select("id, title, thumbnail_url, created_at, content")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const allEvents = computeEvents(persons ?? [], customEvents ?? []);
  const upcomingEvents = allEvents.filter(
    (e) => e.daysUntil >= 0 && e.daysUntil <= 30,
  );

  const lunar = getTodayLunar();

  /* ── Feature lists ────────────────────────────────────────────── */
  const publicFeatures = [
    {
      title: "Cây gia phả",
      description: "Xem và tương tác với sơ đồ dòng họ",
      icon: <Network className="size-8 text-amber-600" />,
      href: "/dashboard/members",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      hoverColor: "hover:border-amber-400 hover:shadow-amber-100",
    },
    // {
    //   title: "Sự kiện",
    //   description: "Quản lý ngày giỗ, họp họ và các dịp quan trọng",
    //   icon: <CalendarClock className="size-8 text-emerald-600" />,
    //   href: "/dashboard/events",
    //   bgColor: "bg-emerald-50",
    //   borderColor: "border-emerald-200/60",
    //   hoverColor: "hover:border-emerald-400 hover:shadow-emerald-100",
    // },
    {
      title: "Tra cứu danh xưng",
      description: "Hệ thống gọi tên họ hàng chuẩn xác",
      icon: <GitMerge className="size-8 text-blue-600" />,
      href: "/dashboard/kinship",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200/60",
      hoverColor: "hover:border-blue-400 hover:shadow-blue-100",
    },
    {
      title: "Thống kê gia phả",
      description: "Tổng quan dữ liệu và biểu đồ phân tích",
      icon: <BarChart2 className="size-8 text-purple-600" />,
      href: "/dashboard/stats",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200/60",
      hoverColor: "hover:border-purple-400 hover:shadow-purple-100",
    },
  ];

  const adminFeatures = [
    {
      title: "Quản lý Người dùng",
      description: "Phê duyệt tài khoản và phân quyền",
      icon: <Users className="size-8 text-rose-600" />,
      href: "/dashboard/users",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200/60",
      hoverColor: "hover:border-rose-400 hover:shadow-rose-100",
    },
    {
      title: "Thứ tự gia phả",
      description: "Sắp xếp và xem cấu trúc hệ thống",
      icon: <Network className="size-8 text-indigo-600" />,
      href: "/dashboard/lineage",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200/60",
      hoverColor: "hover:border-indigo-400 hover:shadow-indigo-100",
    },
    {
      title: "Sao lưu & Phục hồi",
      description: "Xuất/Nhập dữ liệu toàn hệ thống",
      icon: <Database className="size-8 text-teal-600" />,
      href: "/dashboard/data",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200/60",
      hoverColor: "hover:border-teal-400 hover:shadow-teal-100",
    },
    {
      title: "Cấu hình chung",
      description: "Tên trang, logo, thông tin liên hệ chân trang",
      icon: <Network className="size-8 text-amber-600" />,
      href: "/dashboard/settings",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/60",
      hoverColor: "hover:border-amber-400 hover:shadow-amber-100",
    },
  ];

  const siteName = settings?.site_name || "Gia phả Việt";

  return (
    <main className="flex-1 flex flex-col p-4 sm:p-8 max-w-7xl mx-auto w-full bg-stone-50/30">

      {/* ── Banner: Uống nước nhớ nguồn ─────────────────── */}
      <div className="mb-10 w-full relative overflow-hidden rounded-3xl bg-linear-to-r from-red-950 via-red-900 to-red-950 shadow-2xl shadow-red-900/20 border border-red-800/50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 px-8 py-14 md:py-20 flex flex-col items-center justify-center text-center">
          <div className="mb-6 size-20 md:size-24 bg-white/10 rounded-full p-1 backdrop-blur-sm border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <div className="w-full h-full rounded-full border-2 border-amber-400/50 flex items-center justify-center overflow-hidden bg-white">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-amber-600 font-serif text-3xl font-bold">{siteName.charAt(0)}</span>
              )}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-amber-400 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-4 uppercase">
            {siteName}
          </h1>
          <p className="text-amber-200/90 text-lg md:text-2xl font-serif italic max-w-2xl tracking-wide drop-shadow-md">
            "Cây có gốc mới nở cành xanh ngọn,
            <br />
            Nước có nguồn mới bể rộng sông sâu."
          </p>
        </div>
      </div>

      {/* ── Urgent Event Ribbon (Upcoming Death Anniversaries) ─────────────────── */}
      {upcomingEvents.some(e => e.type === "death_anniversary" && e.daysUntil <= 7) && (
        <Link href="/dashboard/events" className="group flex items-center gap-3 bg-linear-to-r from-red-600 to-red-500 text-white px-5 py-3 rounded-2xl mb-8 shadow-md hover:shadow-lg transition-all border border-red-400">
          <div className="p-1.5 bg-white/20 rounded-full shrink-0 group-hover:scale-110 transition-transform">
            <Flower2 className="size-5" />
          </div>
          <div className="flex-1 truncate">
            <span className="font-bold uppercase text-sm tracking-wider mr-2">Sắp đến ngày giỗ:</span>
            <span className="text-sm font-medium opacity-90 truncate">
              {upcomingEvents.filter(e => e.type === "death_anniversary" && e.daysUntil <= 7).map(e => `${e.personName} (${e.daysUntil === 0 ? "Hôm nay" : e.daysUntil === 1 ? "Ngày mai" : e.daysUntil + " ngày nữa"})`).join(" • ")}
            </span>
          </div>
          <ArrowRight className="size-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {/* ── Events / Calendar Tear-off Style ─────────────────── */}
        <div className="lg:col-span-1">
          <Link
            href="/dashboard/events"
            className="group relative block overflow-hidden rounded-[2rem] bg-[#fdfbf7] border border-amber-900/10 shadow-lg hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 h-full flex flex-col"
          >
            {/* Calendar top binder */}
            <div className="h-10 bg-red-900 w-full flex items-center justify-center gap-4 px-6 border-b-4 border-red-950">
              <div className="w-16 h-2 bg-white/20 rounded-full"></div>
            </div>

            <div className="p-8 flex flex-col items-center text-center flex-1 border-x border-b border-amber-900/5 rounded-b-[2rem]">
              <p className="text-amber-900/60 font-medium text-sm tracking-widest uppercase mb-2">Hôm nay</p>
              <h2 className="text-7xl font-bold text-red-800 tracking-tighter mb-4 font-serif drop-shadow-xs">
                {lunar.lunarDay}
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/50 border border-amber-200/50 text-amber-900 text-sm font-medium mb-6">
                Tháng {lunar.lunarMonth} · Năm {lunar.lunarYear}
              </div>
              <p className="text-stone-500 text-sm mb-8 pb-8 border-b border-amber-900/10 w-full flex items-center justify-center gap-2">
                <CalendarDays className="size-4 opacity-50" /> Dương lịch: {lunar.solarStr}
              </p>

              <div className="w-full text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <Star className="size-4 text-amber-500" />
                    Sự kiện sắp tới
                  </h3>
                </div>

                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((evt, i) => {
                      const cfg = eventTypeConfig[evt.type];
                      const Icon = cfg.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-900/5 shadow-xs">
                          <div className={`mt-0.5 size-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`size-4 ${cfg.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-stone-800 truncate">{evt.personName}</p>
                            <p className="text-xs text-stone-500 font-medium mt-0.5">
                              {evt.daysUntil === 0 ? "Hôm nay" : evt.daysUntil === 1 ? "Ngày mai" : `${evt.daysUntil} ngày nữa`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-stone-400 text-sm bg-white rounded-xl border border-dashed border-amber-900/20">
                    Không có sự kiện sắp tới.
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* ── Features & Merit Book ─────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
          {/* Quick Access Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {publicFeatures.map((feat) => (
              <Link
                key={feat.href}
                href={feat.href}
                className={`group relative overflow-hidden flex flex-col p-6 rounded-[2rem] bg-white border border-amber-900/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${feat.bgColor} rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 ${feat.bgColor} text-amber-700 relative z-10 ring-1 ring-amber-900/5 shadow-inner group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <h4 className="text-xl font-serif font-bold text-stone-800 mb-2 relative z-10 group-hover:text-amber-700 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-sm text-stone-500 relative z-10">
                  {feat.description}
                </p>
              </Link>
            ))}
          </div>

          {/* News Slider / Recent News */}
          {recentNews && recentNews.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-amber-900/10 shadow-sm overflow-hidden p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-bold text-stone-800 flex items-center gap-2">
                  <Info className="size-5 text-sky-600" />
                  Tin tức dòng họ
                </h3>
                <Link href="/dashboard/news" className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1">
                  Xem tất cả <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentNews.map((n: any) => (
                  <Link key={n.id} href={`/dashboard/news/${n.id}`} className="group block bg-stone-50 rounded-xl border border-stone-100 overflow-hidden hover:border-sky-200 hover:shadow-md transition-all">
                    <div className="h-32 bg-stone-200 relative overflow-hidden">
                      {n.thumbnail_url ? (
                        <img
                          src={n.thumbnail_url}
                          alt={n.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 items-center justify-center bg-stone-100 text-stone-300 ${n.thumbnail_url ? 'hidden' : 'flex'}`}>
                        <Info className="size-8" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-stone-500 mb-1">{new Date(n.created_at).toLocaleDateString('vi-VN')}</p>
                      <h4 className="text-sm font-bold text-stone-800 line-clamp-2 group-hover:text-sky-700 transition-colors">{n.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Merit Book Highlight (Sổ công đức) */}
          <Link href="/dashboard/finance" className="group relative block overflow-hidden rounded-[2rem] bg-linear-to-br from-[#8b0000] to-[#5a0000] text-amber-50 border border-red-950 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 p-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <HeartHandshake className="size-3.5" /> Vinh danh công đức
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-400 mb-2 drop-shadow-sm">Sổ Vàng Dòng Họ</h3>
                <p className="text-red-200/80 text-sm max-w-sm">Quản lý minh bạch, ghi nhận lòng thành tâm và sự đóng góp của con cháu muôn phương xây dựng tổ tiên.</p>
              </div>
              <div className="flex-shrink-0">
                <div className="size-20 rounded-full bg-linear-to-br from-amber-400 to-amber-600 p-1 shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full border-2 border-amber-200/50 flex items-center justify-center bg-[#8b0000]">
                    <Database className="size-8 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Feature Grid ──────────────────────────────────── */}
      <div className="space-y-12">
        <section>
          {/* <h3 className="text-xl font-serif font-bold text-stone-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-stone-300 rounded-full"></span>
            Chức năng chung
          </h3> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {publicFeatures.map((feat) => (
              <Link
                key={feat.href}
                href={feat.href}
                className={`group flex flex-col p-6 rounded-2xl bg-white border ${feat.borderColor} ${feat.hoverColor} transition-all duration-300 hover:-translate-y-1 shadow-sm`}
              >
                <div
                  className={`size-14 rounded-xl flex items-center justify-center mb-5 ${feat.bgColor} transition-colors duration-300 group-hover:bg-white border border-transparent group-hover:${feat.borderColor}`}
                >
                  {feat.icon}
                </div>
                <h4 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-sm text-stone-500 line-clamp-2">
                  {feat.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {isAdmin && (
          <section>
            <h3 className="text-xl font-serif font-bold text-rose-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-rose-200 rounded-full"></span>
              Quản trị viên
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {adminFeatures.map((feat) => (
                <Link
                  key={feat.href}
                  href={feat.href}
                  className={`group flex flex-col p-6 rounded-2xl bg-white border ${feat.borderColor} ${feat.hoverColor} transition-all duration-300 hover:-translate-y-1 shadow-sm`}
                >
                  <div
                    className={`size-14 rounded-xl flex items-center justify-center mb-5 ${feat.bgColor} transition-colors duration-300 group-hover:bg-white border border-transparent group-hover:${feat.borderColor}`}
                  >
                    {feat.icon}
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-rose-700 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {feat.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
