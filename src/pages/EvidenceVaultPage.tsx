import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { EvidenceType, EvidenceStatus } from '../types';
import { SubmitEvidenceModal } from '../components/SubmitEvidenceModal';
import { VerificationRecordModal } from '../components/VerificationRecordModal';
import { FigmaIcon, GithubIcon } from '../components/BrandIcons';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileCode,
  Globe,
  FileCheck2,
  Trash2,
  Filter,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

const EVIDENCE_TYPE_ICONS: Record<EvidenceType, React.ReactNode> = {
  'GitHub Repository': <FileCode className="w-4 h-4 text-forest" />,
  'Live Project': <Globe className="w-4 h-4 text-forest" />,
  'Figma Prototype': <FigmaIcon className="w-4 h-4 text-terracotta" />,
  'Technical Document / PDF': <FileText className="w-4 h-4 text-ink-muted" />,
  'Design / Code Image': <FileText className="w-4 h-4 text-ink-muted" />,
  'Certification': <FileCheck2 className="w-4 h-4 text-forest" />,
  'Video Walkthrough': <Globe className="w-4 h-4 text-forest" />,
  'Competition Award': <ShieldCheck className="w-4 h-4 text-terracotta" />,
  'Case Study': <FileText className="w-4 h-4 text-ink-muted" />,
  'Faculty Endorsement': <UserCheck className="w-4 h-4 text-forest" />,
};

export const EvidenceVaultPage: React.FC = () => {
  const {
    evidence,
    currentUserId,
    studentSkills,
    users,
    deleteEvidence,
    submitEvidenceForVerification,
    verificationRecords
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Verification request modal state
  const [requestTargetEvidenceId, setRequestTargetEvidenceId] = useState<string | null>(null);
  const [selectedReviewerId, setSelectedReviewerId] = useState<string>('');
  const [requestNote, setRequestNote] = useState('');

  const myEvidence = evidence.filter((e) => e.studentId === currentUserId);
  const reviewers = users.filter((u) => u.role === 'mentor' || u.role === 'faculty');

  // Filtered evidence
  const filteredEvidence = myEvidence.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.contribution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.skillName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || ev.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || ev.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedRecord = verificationRecords.find(
    (r) => r.id === selectedRecordId || r.referenceId === selectedRecordId
  ) || null;

  const handleOpenVerificationPrompt = (evId: string) => {
    setRequestTargetEvidenceId(evId);
    setSelectedReviewerId(reviewers[0]?.id || '');
    setRequestNote('');
  };

  const handleConfirmVerificationRequest = () => {
    if (!requestTargetEvidenceId || !selectedReviewerId) return;
    submitEvidenceForVerification(requestTargetEvidenceId, selectedReviewerId, requestNote);
    setRequestTargetEvidenceId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium">
            Proof & Artifact Repository
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            Evidence Vault
          </h1>
          <p className="text-sm text-ink-light mt-1">
            Store, document, and submit concrete artifacts that substantiate your competencies.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2 bg-forest hover:bg-forest-deep text-paper text-xs font-medium rounded-sm transition-colors shadow-subtle flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Deposit New Evidence</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-paper-card border border-border p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search artifacts, skills, or contribution details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-paper border border-border rounded-sm text-xs text-ink focus:outline-hidden focus:border-forest"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted text-[11px] uppercase tracking-wider">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-1.5 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
            >
              <option value="All">All Types</option>
              <option value="GitHub Repository">GitHub Repository</option>
              <option value="Live Project">Live Project</option>
              <option value="Figma Prototype">Figma Prototype</option>
              <option value="Technical Document / PDF">Technical PDF</option>
              <option value="Case Study">Case Study</option>
              <option value="Faculty Endorsement">Faculty Endorsement</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted text-[11px] uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Under review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-full bg-paper-card border border-border p-12 text-center space-y-3 rounded-sm">
            <FileText className="w-8 h-8 text-ink-muted mx-auto" />
            <h3 className="font-serif text-lg font-medium text-ink">No evidence artifacts found</h3>
            <p className="text-xs text-ink-muted">
              Add your first concrete project, repository, or document to support your skills.
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 bg-forest text-paper text-xs font-medium rounded-sm hover:bg-forest-deep mt-2"
            >
              + Deposit Artifact
            </button>
          </div>
        ) : (
          filteredEvidence.map((ev) => {
            return (
              <div
                key={ev.id}
                className="bg-paper-card border border-border rounded-sm p-5 space-y-4 hover:shadow-editorial transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-paper border border-border rounded-sm">
                        {EVIDENCE_TYPE_ICONS[ev.type] || <FileText className="w-4 h-4 text-ink-muted" />}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">
                        {ev.type}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm border ${
                        ev.status === 'Verified'
                          ? 'bg-forest/10 text-forest border-forest/20'
                          : ev.status === 'Under review'
                          ? 'bg-terracotta/10 text-terracotta-dark border-terracotta/20'
                          : ev.status === 'Draft'
                          ? 'bg-paper text-ink-muted border-border'
                          : 'bg-paper-subtle text-ink-light border-border'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  {/* Title & Target Skill */}
                  <div>
                    <h3 className="font-serif font-bold text-base text-ink line-clamp-2 leading-snug">
                      {ev.title}
                    </h3>
                    <span className="inline-block mt-1 text-[11px] text-forest font-medium">
                      Skill: {ev.skillName}
                    </span>
                  </div>

                  {/* Student Contribution Statement */}
                  <div className="bg-paper p-3 rounded-sm border border-border-subtle space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
                      Candidate Contribution
                    </span>
                    <p className="text-xs text-ink-light leading-relaxed line-clamp-3">
                      {ev.contribution}
                    </p>
                  </div>

                  {/* Reviewer Feedback if present */}
                  {ev.reviewerFeedback && (
                    <div className="p-3 bg-forest-surface/80 border-l-2 border-forest rounded-sm text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-forest font-semibold">
                        <span>Reviewer Evaluation</span>
                        {ev.verificationRefId && (
                          <span className="font-mono">{ev.verificationRefId}</span>
                        )}
                      </div>
                      <p className="text-[11px] italic text-ink-light line-clamp-2">
                        "{ev.reviewerFeedback}"
                      </p>
                      <span className="text-[10px] text-ink-muted block font-medium">
                        — {ev.reviewerName}
                      </span>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[10px] text-ink-faint pt-1">
                    <span>Completed: {ev.dateCompleted}</span>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Open Resource</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`Delete evidence "${ev.title}"?`)) {
                        deleteEvidence(ev.id);
                      }
                    }}
                    className="p-1 text-ink-muted hover:text-terracotta transition-colors"
                    title="Delete evidence artifact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {ev.status === 'Verified' && ev.verificationRefId ? (
                      <button
                        onClick={() => setSelectedRecordId(ev.verificationRefId || null)}
                        className="px-2.5 py-1 bg-forest/10 hover:bg-forest/15 border border-forest/20 text-forest text-xs font-medium rounded-sm flex items-center gap-1 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Inspect Seal</span>
                      </button>
                    ) : ev.status === 'Draft' || ev.status === 'Submitted' ? (
                      <button
                        onClick={() => handleOpenVerificationPrompt(ev.id)}
                        className="px-2.5 py-1 bg-forest text-paper hover:bg-forest-deep text-xs font-medium rounded-sm transition-colors shadow-subtle"
                      >
                        Request Review
                      </button>
                    ) : (
                      <span className="text-[11px] text-ink-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-terracotta" />
                        <span>Under faculty review</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Request Verification Modal */}
      {requestTargetEvidenceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-paper-card border border-border rounded-sm shadow-editorial p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Request Verification</h3>
                <p className="text-xs text-ink-muted">Send this evidence to an accredited faculty reviewer</p>
              </div>
              <button
                onClick={() => setRequestTargetEvidenceId(null)}
                className="text-ink-muted hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-ink mb-1 text-[11px] uppercase tracking-wider">
                  Select Accredited Reviewer
                </label>
                <select
                  value={selectedReviewerId}
                  onChange={(e) => setSelectedReviewerId(e.target.value)}
                  className="w-full p-2.5 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
                >
                  {reviewers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.headline}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1 text-[11px] uppercase tracking-wider">
                  Note to Reviewer
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="e.g. Please check the network partition test logs and asyncio state machine implementation..."
                  rows={3}
                  className="w-full p-2.5 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRequestTargetEvidenceId(null)}
                className="px-3.5 py-1.5 bg-paper border border-border text-ink rounded-sm hover:bg-paper-subtle font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerificationRequest}
                className="px-4 py-1.5 bg-forest text-paper hover:bg-forest-deep rounded-sm font-medium shadow-subtle"
              >
                Dispatch Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      <SubmitEvidenceModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      {/* Verification Record Seal Modal */}
      <VerificationRecordModal
        record={selectedRecord}
        onClose={() => setSelectedRecordId(null)}
      />
    </div>
  );
};
