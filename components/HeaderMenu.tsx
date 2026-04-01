"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Bell, CalendarDays, ChevronDown, Database, Download, GitMerge, Info, Network, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "./LogoutButton";
import { useUser } from "./UserProvider";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function HeaderMenu() {
  const { user, isAdmin } = useUser();
  const userEmail = user?.email;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isInstallable, isInstalled, installPwa } = usePwaInstall();
  const { isSupported, subscription, subscribeToPush, unsubscribeFromPush, isLoading: isPushLoading } = usePushNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-stone-100 transition-all duration-200 border border-transparent hover:border-stone-200"
      >
        <div className="size-8 rounded-full bg-linear-to-br from-amber-200 to-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-sm ring-1 ring-amber-300/50">
          {userEmail ? (
            userEmail.charAt(0).toUpperCase()
          ) : (
            <UserCircle className="size-5" />
          )}
        </div>
        <ChevronDown
          className={`size-4 text-stone-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/60 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
                Tài khoản
              </p>
              <p className="text-sm font-medium text-stone-900 truncate">
                {userEmail}
              </p>
            </div>

            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Network className="size-4" />
                Bảng điều khiển
              </Link>

              <Link
                href="/dashboard/members?view=tree"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Network className="size-4" />
                Cây gia phả
              </Link>
              
              <Link
                href="/dashboard/kinship"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <GitMerge className="size-4" />
                Tra cứu danh xưng
              </Link>

              <Link
                href="/dashboard/stats"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <BarChart2 className="size-4" />
                Thống kê
              </Link>

              <Link
                href="/dashboard/finance"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Database className="size-4" />
                Sổ công đức
              </Link>

              <Link
                href="/dashboard/events"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <CalendarDays className="size-4" />
                Sự kiện
              </Link>

              <Link
                href="/dashboard/news"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-sky-700 hover:bg-sky-50 transition-colors"
              >
                <Info className="size-4" />
                Tin tức dòng họ
              </Link>

              <div className="h-px bg-stone-100 my-1 mx-4" />

              <div className="px-4 py-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Ứng dụng
                </p>
                <div className="space-y-1">
                  {!isInstalled ? (
                    <button
                      onClick={() => { installPwa(); setIsOpen(false); }}
                      className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                         isInstallable ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200' : 'text-stone-700 bg-stone-50 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><Download className="size-3.5" /> Cài đặt App</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-medium text-stone-500 bg-stone-50 rounded-lg border border-stone-200 opacity-70 cursor-not-allowed">
                      <span className="flex items-center gap-1.5"><Download className="size-3.5" /> Đã cài đặt App</span>
                    </div>
                  )}

                  {!isPushLoading && isSupported && (
                    <button
                      onClick={async () => {
                        if (subscription) {
                          await unsubscribeFromPush();
                        } else {
                          const perm = await Notification.requestPermission();
                          if (perm === "granted") await subscribeToPush();
                        }
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                        subscription
                          ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                          : 'text-sky-700 bg-sky-50 hover:bg-sky-100 border-sky-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Bell className={`size-3.5 ${subscription ? 'fill-rose-700/20' : ''}`} />
                        {subscription ? 'Tắt thông báo' : 'Bật thông báo'}
                      </span>
                    </button>
                  )}
                  {!isPushLoading && !isSupported && (
                     <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs font-medium text-stone-500 bg-stone-50 rounded-lg border border-stone-200 opacity-70 cursor-not-allowed">
                     <span className="flex items-center gap-1.5"><Bell className="size-3.5" /> Trình duyệt không hỗ trợ TB</span>
                   </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <>
                  <div className="h-px bg-stone-100 my-1 mx-4" />
                  <div className="px-4 py-2 mt-1">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                      Quản trị viên
                    </p>
                  </div>
                  
                  <Link
                    href="/dashboard/users"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <Users className="size-4" />
                    Quản lý Người dùng
                  </Link>

                  <Link
                    href="/dashboard/lineage"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    <Network className="size-4" />
                    Thứ tự gia phả
                  </Link>

                  <Link
                    href="/dashboard/data"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    <Database className="size-4" />
                    Sao lưu & Phục hồi
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <Network className="size-4" />
                    Cấu hình chung
                  </Link>
                </>
              )}

              <div className="h-px bg-stone-100 my-1 mx-4" />

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Info className="size-4" />
                Giới thiệu
              </Link>

              <LogoutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
