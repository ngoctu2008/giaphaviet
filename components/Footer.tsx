"use client";

import { SiteSettings } from "@/types";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export interface FooterProps {
  className?: string;
  showDisclaimer?: boolean;
  settings?: SiteSettings | null;
}

export default function Footer({
  className = "",
  showDisclaimer = false,
  settings,
}: FooterProps) {
  const { isInstallable, installPwa } = usePwaInstall();

  // Combine address, email, phone with dashes as shown in design
  const contactInfoParts = [];
  if (settings?.footer_address) contactInfoParts.push(settings.footer_address);
  if (settings?.footer_email) contactInfoParts.push(settings.footer_email);
  if (settings?.footer_phone) contactInfoParts.push(settings.footer_phone);

  const contactInfoString = contactInfoParts.join(" - ");

  return (
    <footer className={`bg-white border-t border-stone-200/50 py-10 px-4 md:px-8 mt-auto ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">

        {/* Left Column: Links, Contact, and Custom text */}
        <div className="flex flex-col gap-4 text-stone-800 flex-1">
          {/* Custom Links (Bordered list) */}
          {Array.isArray(settings?.custom_links) && settings.custom_links.length > 0 && (
            <div className="flex flex-wrap text-[15px] border border-sky-600/50 w-fit">
              {settings.custom_links.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 hover:bg-sky-50 transition-colors ${
                    index < settings.custom_links!.length - 1 ? "border-r border-sky-600/50" : ""
                  }`}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          {/* Contact Info */}
          {contactInfoString && (
            <div className="text-[15px]">
              {contactInfoString}
            </div>
          )}

          {/* Custom Footer Text */}
          {settings?.footer_custom_text && (
            <div className="text-[15px]">
              {settings.footer_custom_text}
            </div>
          )}
        </div>

        {/* Right Column: Install Button and Branding */}
        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">

          {/* The Install Button - Designed like the image */}
          {isInstallable && (
            <button
              onClick={installPwa}
              className="group relative flex items-center bg-[#4673c6] text-white rounded-full pr-6 pl-2 py-2 hover:bg-[#3b62a8] transition-colors shadow-sm overflow-hidden min-w-[320px] justify-start"
            >
              <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center text-stone-900 border-2 border-[#81c045] shrink-0 font-medium text-xs shadow-sm group-hover:scale-105 transition-transform">
                <span>Log</span>
                <span>o</span>
              </div>
              <span className="ml-4 font-medium text-[15px]">
                Cài đặt ứng dụng này vào điện thoại
              </span>
            </button>
          )}

          {/* Disclaimer (if passed, hide for clean layout but keep option) */}
          {showDisclaimer && (
            <p className="text-xs text-stone-500 max-w-[300px] text-center md:text-right">
               Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác hơn.
            </p>
          )}

          {/* Attribution text */}
          <p className="text-[15px] text-stone-800">
            Gia phả Việt phát triển bởi Phạm Ngọc Tú
          </p>
        </div>

      </div>
    </footer>
  );
}
