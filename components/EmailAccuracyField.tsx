'use client';

import React from 'react';
import { Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { validateEmail } from '@/lib/emailValidation';

interface EmailAccuracyFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  label?: string;
  showFeedback?: boolean;
  disabled?: boolean;
}

export default function EmailAccuracyField({
  value,
  onChange,
  placeholder = 'votre-nom@exemple.com',
  required = false,
  className = '',
  inputClassName = '',
  label,
  showFeedback = true,
  disabled = false,
}: EmailAccuracyFieldProps) {
  const validation = validateEmail(value);
  const hasValue = value.trim().length > 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-[#9a958a] block font-medium">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
          {hasValue && showFeedback && (
            <span
              className={`text-[10px] font-medium flex items-center gap-1 ${
                validation.isValid
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {validation.isValid ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Email valide</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>À vérifier</span>
                </>
              )}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <Mail
          className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition ${
            !hasValue
              ? 'text-[#666]'
              : validation.isValid
              ? 'text-emerald-400'
              : 'text-amber-400'
          }`}
        />
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="email"
          spellCheck={false}
          className={`w-full pl-9.5 pr-8 py-2.5 bg-[#161616] border text-xs text-white placeholder-[#666] rounded focus:outline-none transition font-sans ${
            !hasValue
              ? 'border-[#333] focus:border-[#d4af37]'
              : validation.isValid
              ? 'border-emerald-600/70 focus:border-emerald-400'
              : 'border-amber-600/70 focus:border-amber-400'
          } ${inputClassName}`}
        />
        {hasValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
          </div>
        )}
      </div>

      {/* Real-time hint or typo suggestion */}
      {hasValue && showFeedback && (
        <div className="text-[11px] pt-0.5 animate-fade-in">
          {validation.suggestedEmail && (
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Vouliez-vous dire </span>
              <button
                type="button"
                onClick={() => onChange(validation.suggestedEmail!)}
                className="font-bold underline hover:text-white cursor-pointer"
              >
                {validation.suggestedEmail}
              </button>
              <span>?</span>
            </div>
          )}

          {!validation.isValid && !validation.suggestedEmail && validation.errorMessage && (
            <p className="text-amber-400/90 flex items-center gap-1 text-[11px]">
              <span>•</span>
              <span>{validation.errorMessage}</span>
            </p>
          )}

          {validation.isValid && !validation.suggestedEmail && (
            <p className="text-emerald-400/90 text-[10px] flex items-center gap-1">
              <span>✓ Syntaxe et structure de domaine validées</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
