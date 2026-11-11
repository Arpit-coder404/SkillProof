import React from 'react';
import { VerificationStatus, ProficiencyLevel } from '../types';
import { ShieldCheck, Clock, FileText, AlertCircle, Eye } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  refId?: string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  refId,
  className = '',
  showIcon = true,
}) => {
  switch (status) {
    case 'Verified':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium tracking-wide bg-forest/10 text-forest border border-forest/20 rounded-sm ${className}`}
          title={refId ? `Verified Ref: ${refId}` : 'Verified Competency'}
        >
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-forest" />}
          <span>Verified</span>
          {refId && <span className="font-mono text-[10px] text-forest/70 ml-0.5">#{refId.split('-').pop()}</span>}
        </span>
      );

    case 'Under review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium tracking-wide bg-terracotta/10 text-terracotta-dark border border-terracotta/20 rounded-sm ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-terracotta" />}
          <span>Under Review</span>
        </span>
      );

    case 'Evidence submitted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium tracking-wide bg-paper-subtle text-ink-light border border-border rounded-sm ${className}`}
        >
          {showIcon && <FileText className="w-3.5 h-3.5 text-ink-muted" />}
          <span>Evidence Submitted</span>
        </span>
      );

    case 'Needs improvement':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium tracking-wide bg-amber-50 text-amber-800 border border-amber-200 rounded-sm ${className}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-amber-700" />}
          <span>Needs Improvement</span>
        </span>
      );

    case 'Self-declared':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium tracking-wide bg-paper text-ink-muted border border-border-subtle rounded-sm ${className}`}
        >
          {showIcon && <Eye className="w-3.5 h-3.5 text-ink-muted" />}
          <span>Self-declared</span>
        </span>
      );
  }
};

export const ProficiencyMeter: React.FC<{ level: ProficiencyLevel; compact?: boolean }> = ({
  level,
  compact = false,
}) => {
  const levels: ProficiencyLevel[] = ['Beginner', 'Developing', 'Intermediate', 'Advanced', 'Expert'];
  const activeIndex = levels.indexOf(level);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted font-medium">{compact ? level : `Level: ${level}`}</span>
        {!compact && <span className="font-mono text-ink-faint text-[11px]">{activeIndex + 1}/5</span>}
      </div>
      <div className="flex items-center gap-1 h-1.5 w-full">
        {levels.map((lvl, idx) => {
          const filled = idx <= activeIndex;
          return (
            <div
              key={lvl}
              className={`h-full flex-1 rounded-[1px] transition-all duration-300 ${
                filled ? 'bg-forest' : 'bg-border'
              }`}
              title={lvl}
            />
          );
        })}
      </div>
    </div>
  );
};

