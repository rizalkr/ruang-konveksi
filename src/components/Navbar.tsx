"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { BusinessConfig } from "@/config/types";
import { createInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle, Menu, X } from "lucide-react";

interface NavbarProps {
  config: BusinessConfig;
  sections: { id: string; label: string }[];
}

/**
 * Responsive sticky navigation bar.
 * Renders logo/business name, section anchor links, and a WhatsApp CTA.
 * On mobile (<768px), collapses into a hamburger menu with full keyboard accessibility.
 * All links point to section IDs that exist in the page; no fictional sections are created.
 */
export function Navbar({ config, sections }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const waUrl = createInquiryWhatsAppUrl(config.wa, config.nama);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Filter out "Beranda" from nav links (hero already visible at top)
  const navLinks = sections.filter((s) => s.id !== "beranda");

  return (
    <header
      id="beranda"
      className={`sticky top-0 z-50 w-full transition-shadow duration-200 ${
        isScrolled
          ? "bg-white/95 shadow-sm backdrop-blur-sm border-b border-mist"
          : "bg-white border-b border-mist"
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Logo / Business Name */}
        <a
          href="#beranda"
          className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary rounded-lg"
          onClick={closeMenu}
        >
          {config.logo && (
            <img
              src={config.logo}
              alt={`Logo ${config.nama}`}
              className="h-9 w-9 rounded-lg object-cover"
              width={36}
              height={36}
            />
          )}
          <span className="text-base font-bold text-ink sm:text-lg">
            {config.nama}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate transition-colors hover:text-ink hover:bg-page-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {section.label}
            </a>
          ))}
        </div>

        {/* Desktop WhatsApp CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-[40px] items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:inline-flex"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>Hubungi Kami</span>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-page-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-x-0 top-[57px] bottom-0 z-40 bg-white md:hidden"
        >
          <div className="flex flex-col px-4 pb-6 pt-4">
            <div className="space-y-1">
              {navLinks.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={closeMenu}
                  className="block min-h-[48px] rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-page-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  {section.label}
                </a>
              ))}
            </div>
            <div className="mt-4 border-t border-mist pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span>Hubungi WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

