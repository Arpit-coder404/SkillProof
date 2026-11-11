import React from 'react';
import { VerificationRecord } from '../types';
import { ShieldCheck, X, CheckCircle2, ExternalLink, Award } from 'lucide-react';

interface Props {
  record: VerificationRecord | null;
  onClose: () => void;
}

export const VerificationRecordModal: React.FC<Props> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-paper-card border border-border rounded-sm shadow-editorial overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Header Bar */}
        <div className="bg-forest px-6 py-4 flex items-center justify-between text-paper">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-forest-deep flex items-center justify-center text-muted-sage border border-sage/20">
              <ShieldCheck className="w-5 h-5 text-sage" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-sage font-medium block">
                Official Verification Record
              </span>
              <h3 className="font-serif text-lg font-normal tracking-tight text-white leading-tight">
                SkillProof Attestation
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-paper/70 hover:text-paper p-1 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Reference Stamp */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-ink-muted block">
                Verification Reference
              </span>
              <span className="font-mono text-base font-semibold text-forest tracking-wider">
                {record.referenceId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-ink-muted block">
                Date Verified
              </span>
              <span className="text-sm font-medium text-ink">
                {record.verifiedAt}
              </span>
            </div>
          </div>

          {/* Student & Skill */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-paper-subtle p-3.5 border border-border-subtle rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
                Student Candidate
              </span>
              <h4 className="font-medium text-ink">{record.studentName}</h4>
            </div>
            <div className="bg-paper-subtle p-3.5 border border-border-subtle rounded-sm">
              <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
                Demonstrated Competency
              </span>
              <h4 className="font-medium text-forest flex items-center gap-1.5">
                <Award className="w-4 h-4 text-forest" />
                {record.skillName}
              </h4>
            </div>
          </div>

          {/* Evidence Reviewed */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1.5">
              Assessed Evidence
            </span>
            <div className="p-3 bg-paper border border-border rounded-sm">
              <p className="text-sm font-medium text-ink">{record.evidenceTitle}</p>
            </div>
          </div>

          {/* Specific Criteria Checked */}
          {record.verifiedCriteria && record.verifiedCriteria.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-2">
                Criteria Confirmed by Evaluator
              </span>
              <ul className="space-y-2">
                {record.verifiedCriteria.map((criterion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-ink-light">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviewer Evaluation Comments */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1.5">
              Reviewer Notes & Feedback
            </span>
            <blockquote className="p-3.5 bg-forest-surface/60 border-l-2 border-forest text-xs italic text-ink-light leading-relaxed">
              "{record.comments}"
            </blockquote>
          </div>

          {/* Evaluator Signature block */}
          <div className="pt-4 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-ink-muted block">
                Verified By Reviewer
              </span>
              <p className="font-semibold text-ink">{record.reviewerName}</p>
              <p className="text-ink-muted text-[11px]">{record.reviewerRole}</p>
              <p className="text-ink-muted text-[11px]">{record.reviewerAffiliation}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-sage-light border border-sage-border rounded-sm text-forest font-medium text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographically Logged</span>
            </div>
          </div>

          {/* Legal / Policy Disclaimer */}
          <div className="text-[10px] text-ink-faint leading-tight pt-2 border-t border-border-subtle">
            <strong>Institutional Note:</strong> This record certifies that the named accredited reviewer evaluated the designated evidence against formal academic rubrics. SkillProof records peer-reviewed evidence and does not issue ungrounded assertions.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-paper-subtle px-6 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-paper-card border border-border hover:bg-paper text-ink text-xs font-medium rounded-sm transition-colors"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};

