import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { EvidenceType } from '../types';
import { X, FileUp, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { GithubIcon, FigmaIcon } from './BrandIcons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedSkillId?: string;
}

const EVIDENCE_TYPES: EvidenceType[] = [
  'GitHub Repository',
  'Live Project',
  'Figma Prototype',
  'Technical Document / PDF',
  'Design / Code Image',
  'Certification',
  'Video Walkthrough',
  'Competition Award',
  'Case Study',
  'Faculty Endorsement',
];

export const SubmitEvidenceModal: React.FC<Props> = ({ isOpen, onClose, preselectedSkillId }) => {
  const { studentSkills, currentUserId, users, addEvidence } = useStore();

  const userSkills = studentSkills.filter((s) => s.studentId === currentUserId);
  const reviewers = users.filter((u) => u.role === 'mentor' || u.role === 'faculty');

  const [skillId, setSkillId] = useState<string>(preselectedSkillId || userSkills[0]?.skillId || '');
  const [type, setType] = useState<EvidenceType>('GitHub Repository');
  const [title, setTitle] = useState('');
  const [contribution, setContribution] = useState('');
  const [url, setUrl] = useState('');
  const [dateCompleted, setDateCompleted] = useState(new Date().toISOString().split('T')[0]);
  const [submitNow, setSubmitNow] = useState(true);
  const [reviewerId, setReviewerId] = useState<string>(reviewers[0]?.id || '');
  const [studentNote, setStudentNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillId || !title.trim() || !contribution.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    const targetSkill = userSkills.find((s) => s.skillId === skillId);
    const skillName = targetSkill ? targetSkill.skillName : 'General Skill';

    addEvidence(
      {
        studentId: currentUserId,
        skillId,
        skillName,
        title,
        type,
        contribution,
        url: url.trim() ? url.trim() : undefined,
        dateCompleted,
      },
      submitNow,
      submitNow ? reviewerId : undefined,
      studentNote
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-paper-card border border-border rounded-sm shadow-editorial overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-paper-subtle border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-forest" />
            <h3 className="font-serif text-lg font-medium text-ink">Submit Evidence Artifact</h3>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Target Skill */}
          <div>
            <label className="block font-medium text-ink mb-1 uppercase text-[11px] tracking-wider">
              Associated Skill *
            </label>
            {userSkills.length > 0 ? (
              <select
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
                required
              >
                {userSkills.map((s) => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.category})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-terracotta text-xs">
                You must add at least one skill to your passport first.
              </div>
            )}
          </div>

          {/* Evidence Type */}
          <div>
            <label className="block font-medium text-ink mb-1 uppercase text-[11px] tracking-wider">
              Evidence Medium *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {EVIDENCE_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-2 text-left rounded-sm border transition-colors ${
                    type === t
                      ? 'bg-forest/10 border-forest text-forest font-semibold'
                      : 'bg-paper text-ink-light border-border hover:bg-paper-subtle'
                  }`}
                >
                  <span className="block text-[11px] truncate">{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium text-ink mb-1 uppercase text-[11px] tracking-wider">
              Evidence Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Key-Value Store with Jepsen Fault Injection"
              className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
              required
            />
          </div>

          {/* Personal Contribution */}
          <div>
            <label className="block font-medium text-ink mb-1 uppercase text-[11px] tracking-wider">
              Specific Personal Contribution *
            </label>
            <p className="text-[10px] text-ink-muted mb-1.5">
              Explain clearly what YOU engineered or designed, especially if working in a team or lab.
            </p>
            <textarea
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              placeholder="e.g. Architected the leader election state machine in Python 3.12 asyncio; wrote the deterministic test harness simulating packet drops."
              rows={3}
              className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
              required
            />
          </div>

          {/* URL & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-ink mb-1 uppercase text-[11px] tracking-wider">
                Artifact URL (GitHub, Figma, Demo)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
              />
            </div>
            <div>
              <label className="block font-medium text-ink mb-1 uppercase text-[11px] tracking-wider">
                Date Completed
              </label>
              <input
                type="date"
                value={dateCompleted}
                onChange={(e) => setDateCompleted(e.target.value)}
                className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
              />
            </div>
          </div>

          {/* Verification Request Toggle */}
          <div className="p-3.5 bg-paper-subtle border border-border rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-ink text-xs block">Request Verification Review</span>
                <span className="text-[11px] text-ink-muted">
                  Send this directly to an accredited faculty member or mentor for rubric review.
                </span>
              </div>
              <input
                type="checkbox"
                checked={submitNow}
                onChange={(e) => setSubmitNow(e.target.checked)}
                className="w-4 h-4 accent-forest rounded"
              />
            </div>

            {submitNow && (
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <div>
                  <label className="block font-medium text-ink mb-1 text-[11px]">
                    Select Accredited Reviewer
                  </label>
                  <select
                    value={reviewerId}
                    onChange={(e) => setReviewerId(e.target.value)}
                    className="w-full p-2 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
                  >
                    {reviewers.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.headline}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-ink mb-1 text-[11px]">
                    Note to Reviewer (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    placeholder="e.g. Please check the network partition test logs in test_raft.py"
                    className="w-full p-2 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-paper border border-border text-ink rounded-sm hover:bg-paper-subtle font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-forest text-paper hover:bg-forest-deep rounded-sm font-medium text-xs shadow-subtle"
            >
              {submitNow ? 'Submit for Verification' : 'Save as Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
