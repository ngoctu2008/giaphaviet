"use client";

import { SiteSettings } from "@/types";
import { MapPin, Phone, Mail, Box } from "lucide-react";

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
  return (
    <footer className={`bg-white border-t border-stone-200/50 pt-8 pb-12 px-4 md:px-8 mt-auto ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Top Row: Links aligned right */}
        {Array.isArray(settings?.custom_links) && settings.custom_links.length > 0 && (
          <div className="flex justify-end items-center flex-wrap gap-4 text-[17px] font-medium text-[#C47228]">
            {settings.custom_links.map((link: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#A15817] transition-colors"
                >
                  {link.title}
                </a>
                {index < settings.custom_links!.length - 1 && (
                  <div className="w-[2px] h-6 bg-black"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Middle/Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 md:gap-4 mt-2">

          {/* Left Column: Slogan and Contact */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[22px] italic text-[#6B7280] uppercase tracking-wider font-light">
              {settings?.footer_custom_text || "CON CHÁU HỌ PHẠM MUÔN ĐỜI GHI NHỚ CÔNG ƠN TỔ TIÊN"}
            </h2>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[16px] text-[#6B7280]">
              {settings?.footer_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D946EF] fill-[#D946EF]/20" />
                  <span>{settings.footer_address}</span>
                </div>
              )}
              {settings?.footer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#E11D48] fill-[#E11D48]/20" />
                  <span>{settings.footer_phone}</span>
                </div>
              )}
              {settings?.footer_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#C084FC] fill-[#C084FC]/20" />
                  <span>{settings.footer_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Disclaimer and Attribution */}
          <div className="flex flex-col items-end gap-6 shrink-0">
            {showDisclaimer && (
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-full px-6 py-3 text-[#B45309] text-[16px]">
                Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác hơn.
              </div>
            )}

            <div className="flex items-center gap-2 text-[17px] text-[#6B7280]">
              <Box className="w-5 h-5" />
              <span>Gia phả Việt phát triển bởi <span className="font-bold text-[#9F1239]">Phạm Ngọc Tú</span></span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
