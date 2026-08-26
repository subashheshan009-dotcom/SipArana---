import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, type AppLanguage, type LanguageOption } from '@/data/translations';
import { soundFX } from '@/utils/audioUtils';

interface HeaderLanguageSelectorProps {
  /**
   * 'segmented': Primary languages (Sinhala, Tamil, English) as pills + 'More' dropdown for others
   * 'dropdown': Single compact modern button with rich categorized dropdown
   * 'auto': Responsive (segmented on md+, compact dropdown on mobile)
   */
  variant?: 'segmented' | 'dropdown' | 'auto';
  className?: string;
  align?: 'left' | 'right';
  idPrefix?: string;
}

// Primary national languages vs international languages
const PRIMARY_LANG_CODES: AppLanguage[] = ['si', 'ta', 'en'];

export default function HeaderLanguageSelector({
  variant = 'auto',
  className = '',
  align = 'right',
  idPrefix = 'header-lang'
}: HeaderLanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const primaryLanguages = SUPPORTED_LANGUAGES.filter((l) => PRIMARY_LANG_CODES.includes(l.code));
  const otherLanguages = SUPPORTED_LANGUAGES.filter((l) => !PRIMARY_LANG_CODES.includes(l.code));
  const isOtherActive = otherLanguages.some((l) => l.code === language);

  // Click outside listeners
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsMoreOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (langCode: AppLanguage) => {
    soundFX.playCorrect();
    setLanguage(langCode);
    setIsOpen(false);
    setIsMoreOpen(false);
  };

  /* -------------------------------------------------------------
   * RENDER HELPER: Language Option Row with Crisp Typography
   * ------------------------------------------------------------- */
  const renderLanguageRow = (lang: LanguageOption) => {
    const isSelected = language === lang.code;
    return (
      <button
        key={lang.code}
        type="button"
        id={`${idPrefix}-opt-${lang.code}`}
        onClick={() => handleSelectLanguage(lang.code)}
        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer ${
          isSelected
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base leading-none select-none flex-shrink-0">{lang.flag}</span>
          <div className="flex flex-col min-w-0">
            <span
              className={`text-xs font-black tracking-tight leading-snug truncate ${
                isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'
              }`}
              style={{
                // Prevent awkward non-latin script shifts
                fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"'
              }}
            >
              {lang.nativeName}
            </span>
            <span
              className={`text-[10px] font-semibold leading-none truncate ${
                isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              {lang.name}
            </span>
          </div>
        </div>

        {isSelected ? (
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
        ) : (
          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex-shrink-0">
            {lang.shortLabel}
          </span>
        )}
      </button>
    );
  };

  /* -------------------------------------------------------------
   * 1. COMPACT DROPDOWN VARIANT (Default for Layout / Dashboard Nav)
   * ------------------------------------------------------------- */
  const renderCompactDropdown = () => {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          id={`${idPrefix}-toggle-btn`}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs ${
            isOpen
              ? 'bg-blue-50 dark:bg-slate-800 border-blue-400 dark:border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
              : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300'
          }`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          title={`Active Language: ${activeLang.nativeName} (${activeLang.name})`}
        >
          <div className="flex items-center gap-1.5 leading-none">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm leading-none select-none flex-shrink-0">{activeLang.flag}</span>
            <span
              className="text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100 hidden sm:inline whitespace-nowrap leading-none pt-0.5"
              style={{ minHeight: '14px' }}
            >
              {activeLang.nativeName}
            </span>
          </div>

          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase leading-none hidden xs:inline-block">
            {activeLang.code}
          </span>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-2 w-64 sm:w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
          >
            {/* Header / Search Info */}
            <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('selectLanguage') || 'Select Language'}</span>
              </div>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                8 Languages
              </span>
            </div>

            {/* National Languages Section */}
            <div className="space-y-1">
              <div className="px-2.5 pt-1 pb-0.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>National (ශ්‍රී ලංකා)</span>
                <span>Primary</span>
              </div>
              {primaryLanguages.map((l) => renderLanguageRow(l))}
            </div>

            <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

            {/* Global Languages Section */}
            <div className="space-y-1">
              <div className="px-2.5 pt-1 pb-0.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>International (ගෝලීය)</span>
                <span>Global</span>
              </div>
              {otherLanguages.map((l) => renderLanguageRow(l))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 2. SEGMENTED PILLS VARIANT (Ideal for Auth Header / Prominent Bars)
   * ------------------------------------------------------------- */
  const renderSegmentedBar = () => {
    return (
      <div className={`flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-inner ${className}`}>
        {/* Primary 3 Languages: Sinhala, Tamil, English */}
        {primaryLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              id={`${idPrefix}-seg-${lang.code}`}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap leading-none select-none ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-blue-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700 scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="text-sm leading-none flex-shrink-0">{lang.flag}</span>
              <span
                className="text-xs font-bold leading-none tracking-tight pt-0.5"
                style={{
                  fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"'
                }}
              >
                {lang.nativeName}
              </span>
            </button>
          );
        })}

        {/* 'More Languages' Dropdown Pill */}
        <div className="relative" ref={moreDropdownRef}>
          <button
            type="button"
            id={`${idPrefix}-more-btn`}
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap leading-none select-none ${
              isOtherActive || isMoreOpen
                ? 'bg-blue-600 text-white shadow-xs scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
            }`}
            title="More global languages (Japanese, Hindi, Spanish, German, French)"
          >
            {isOtherActive ? (
              <>
                <span className="text-sm leading-none">{activeLang.flag}</span>
                <span className="text-xs font-bold leading-none pt-0.5">{activeLang.nativeName}</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs font-bold leading-none pt-0.5 hidden xs:inline">More</span>
              </>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMoreOpen && (
            <div
              className={`absolute ${
                align === 'right' ? 'right-0' : 'left-0'
              } mt-2 w-60 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
            >
              <div className="px-2.5 py-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                <span>Global Languages</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
              <div className="space-y-1">
                {otherLanguages.map((l) => renderLanguageRow(l))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------
   * 3. AUTO VARIANT (Responsive: Segmented on desktop, Compact on mobile)
   * ------------------------------------------------------------- */
  if (variant === 'segmented') {
    return renderSegmentedBar();
  }

  if (variant === 'dropdown') {
    return renderCompactDropdown();
  }

  // variant === 'auto'
  return (
    <>
      <div className="hidden md:block">
        {renderSegmentedBar()}
      </div>
      <div className="block md:hidden">
        {renderCompactDropdown()}
      </div>
    </>
  );
}
