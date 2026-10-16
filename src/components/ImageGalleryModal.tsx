"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Calculator } from "lucide-react";

export interface ModalImageItem {
  src: string;
  alt?: string;
  title?: string;
  category?: string;
}

export interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | ModalImageItem)[];
  initialIndex?: number;
  title?: string;
  onCtaClick?: (currentIndex: number) => void;
  ctaText?: string;
}

/**
 * Shared accessible image gallery modal component for both Catalog details and Gallery exploration.
 * Features:
 * - Fluid high-definition preview with preserved aspect ratio
 * - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
 * - Mobile horizontal touch swipe support
 * - Focus trap inside modal and focus restoration on close
 * - Background body scroll locking
 * - Descriptive image counter (1 / N) and accessible ARIA attributes
 * - Zero viewport overflow guaranteed on 360px screens
 */
export function ImageGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
  onCtaClick,
  ctaText = "Hitung Estimasi",
}: ImageGalleryModalProps) {
  const normalizedImages: ModalImageItem[] = useMemo(() => {
    const list: ModalImageItem[] = [];
    const sourceImages = Array.isArray(images) ? images : [];
    for (let idx = 0; idx < sourceImages.length; idx++) {
      const item = sourceImages[idx];
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (trimmed) {
          list.push({
            src: trimmed,
            alt: title
              ? `Detail contoh produk ${title} ${idx + 1}`
              : `Dokumentasi produk ${idx + 1}`,
            title: title || undefined,
          });
        }
      } else if (item && typeof item === "object" && typeof item.src === "string") {
        const trimmed = item.src.trim();
        if (trimmed) {
          list.push({
            src: trimmed,
            alt:
              item.alt ||
              (title
                ? `Detail contoh produk ${title} ${idx + 1}`
                : `Dokumentasi produk ${idx + 1}`),
            title: item.title || title,
            category: item.category,
          });
        }
      }
    }
    return list;
  }, [images, title]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Sync current index when modal opens or initial index changes
  useEffect(() => {
    if (isOpen && normalizedImages.length > 0) {
      const safeIndex = Math.min(
        Math.max(0, initialIndex),
        normalizedImages.length - 1
      );
      setCurrentIndex(safeIndex);
    }
  }, [isOpen, initialIndex, normalizedImages.length]);

  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const shouldRestoreFocus = useRef<boolean>(true);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    shouldRestoreFocus.current = true;  

    shouldRestoreFocus.current = true;

    if (typeof document !== "undefined") {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>("[data-modal-close]");
        if (closeBtn) {
          closeBtn.focus();
        } else {
          modalRef.current?.focus();
        }
      }, 40);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        if (
          shouldRestoreFocus.current &&
          previousActiveElement.current &&
          typeof previousActiveElement.current.focus === "function"
        ) {
          previousActiveElement.current.focus({ preventScroll: true });
        }
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : normalizedImages.length - 1));
  }, [normalizedImages.length]);

  const handleNext = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev < normalizedImages.length - 1 ? prev + 1 : 0));
  }, [normalizedImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Focus trap for Tab and Shift+Tab
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger if horizontal movement dominates and exceeds threshold
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!isOpen || normalizedImages.length === 0) {
    return null;
  }

  const currentImage = normalizedImages[currentIndex];
  const hasMultipleImages = normalizedImages.length > 1;

  return (
    <div
      id="image-gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Galeri foto ${title}` : "Galeri foto produk"}
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative z-10 flex w-full max-w-4xl max-h-[92vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-mist px-4 py-3 sm:px-6">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-ink sm:text-lg">
              {title || currentImage.title || "Detail Contoh Produk"}
            </h3>
            {hasMultipleImages && (
              <span
                className="text-xs font-medium text-slate"
                aria-live="polite"
              >
                {`${currentIndex + 1} / ${normalizedImages.length}`}
              </span>
            )}
          </div>

          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Tutup modal galeri"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-slate transition-colors hover:bg-mist/40 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Image viewport area */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-page-bg p-4 sm:p-6">
          <img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || `Gambar produk ${currentIndex + 1}`}
            className="max-h-[50vh] sm:max-h-[62vh] w-auto max-w-full rounded-lg object-contain shadow-sm select-none"
          />

          {/* Previous image button */}
          {hasMultipleImages && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Gambar sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 p-2.5 text-ink shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          {/* Next image button */}
          {hasMultipleImages && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Gambar berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 p-2.5 text-ink shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:right-4"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Footer with action buttons */}
        <div
          className={`flex flex-col-reverse gap-2 border-t border-mist p-4 sm:flex-row sm:items-center ${
            onCtaClick ? "sm:justify-between" : "sm:justify-end"
          } sm:px-6`}
        >
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-slate transition-colors hover:bg-page-bg hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Tutup
          </button>

          {onCtaClick && (
            <button
              type="button"
              onClick={() => {
                shouldRestoreFocus.current = false;
                if (typeof document !== "undefined") {
                  document.body.style.overflow = "";
                }
                onClose();
                onCtaClick(currentIndex);
                if (typeof window !== "undefined") {
                  window.location.hash = "#kalkulator";
                }
              }}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              <span>{ctaText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
