import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SkillCategory, VerificationStatus, StudentSkill } from '../types';
import { StatusBadge, ProficiencyMeter } from '../components/StatusBadge';
import { AddSkillModal } from '../components/AddSkillModal';
import { SubmitEvidenceModal } from '../components/SubmitEvidenceModal';
import { VerificationRecordModal } from '../components/VerificationRecordModal';
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
  Calendar,
  Trash2,
  FileCode
} from 'lucide-react';

const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Technology & Programming',
  'Design & Creativity',
  'Data & Analytics',
  'Business & Entrepreneurship',
  'Communication',
  'Leadership & Collaboration',
];

export const MySkillsPage: React.FC = () => {
  const {
    studentSkills,
    currentUserId,
    evidence,
    assessmentSubmissions,
    assessments,
    verificationRecords,
    removeStudentSkill,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | VerificationStatus>('All');
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isSubmitEvidenceOpen, setIsSubmitEvidenceOpen] = useState(false);
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<string | undefined>();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Student skills
  const mySkills = studentSkills.filter((s) => s.studentId === currentUserId);

  // Filter skills
  const filteredSkills = mySkills.filter((sk) => {
    const matchesCat = selectedCategory === 'All' || sk.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || sk.verificationStatus === selectedStatus;
    const matchesSearch =
      sk.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sk.notes && sk.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesStatus && matchesSearch;
  });

  // Selected skill for detail pane
  const activeSkill = mySkills.find((s) => s.id === activeSkillId) || mySkills[0] || null;

  // Active skill's evidence
  const activeEvidence = activeSkill
    ? evidence.filter((e) => e.studentId === currentUserId && e.skillId === activeSkill.skillId)
    : [];

  // Active skill's assessments completed
  const activeSubmissions = activeSkill
    ? assessmentSubmissions.filter((sub) => {
        const asm = assessments.find((a) => a.id === sub.assessmentId);
        return sub.studentId === currentUserId && asm?.skillId === activeSkill.skillId;
      })
    : [];

  const selectedRecord = verificationRecords.find(
    (r) => r.id === selectedRecordId || r.referenceId === selectedRecordId
  ) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium">
            Academic Competencies • Level 1 to 5
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            My Documented Skills
          </h1>
          <p className="text-sm text-ink-light mt-1">
            Manage your verified passport competencies and track evidence progression.
          </p>
        </div>

        <button
          onClick={() => setIsAddSkillOpen(true)}
          className="px-4 py-2 bg-forest hover:bg-forest-deep text-paper text-xs font-medium rounded-sm transition-colors shadow-subtle flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill to Passport</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-paper-card border border-border p-4 rounded-sm space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documented skills or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-paper border border-border rounded-sm text-xs text-ink focus:outline-hidden focus:border-forest"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-muted font-medium text-[11px] uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="p-1.5 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Under review">Under Review</option>
              <option value="Evidence submitted">Evidence Submitted</option>
              <option value="Self-declared">Self-declared</option>
            </select>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-border-subtle scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-sm text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-forest text-paper font-medium shadow-xs'
                  : 'bg-paper text-ink-light hover:bg-paper-subtle border border-border-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Skills List (Left) & Deep Vertical Detail Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Skills Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredSkills.length === 0 ? (
            <div className="bg-paper-card border border-border rounded-sm p-12 text-center space-y-3">
              <Award className="w-8 h-8 text-ink-muted mx-auto" />
              <h3 className="font-serif text-lg font-medium text-ink">No skills matching your criteria</h3>
              <p className="text-xs text-ink-muted">
                Try clearing your search or category filter, or add a new skill to your passport.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 bg-paper border border-border text-xs text-ink rounded-sm hover:bg-paper-subtle mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredSkills.map((sk) => {
              const isSelected = activeSkill?.id === sk.id;
              return (
                <div
                  key={sk.id}
                  onClick={() => setActiveSkillId(sk.id)}
                  className={`p-5 bg-paper-card border rounded-sm transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-forest shadow-editorial ring-1 ring-forest/20'
                      : 'border-border hover:border-forest/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-ink-muted block">
                        {sk.category}
                      </span>
                      <h3 className="font-serif font-bold text-base text-ink">{sk.skillName}</h3>
                    </div>
                    <StatusBadge status={sk.verificationStatus} refId={sk.verificationRefId} />
                  </div>

                  {sk.notes && (
                    <p className="text-xs text-ink-light leading-relaxed line-clamp-2 mb-3">
                      {sk.notes}
                    </p>
                  )}

                  <div className="py-2 mb-3">
                    <ProficiencyMeter level={sk.proficiency} />
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-ink-muted">
                    <div className="flex items-center gap-3">
                      <span>{sk.evidenceCount} {sk.evidenceCount === 1 ? 'artifact' : 'artifacts'}</span>
                      <span>•</span>
                      <span>Updated {sk.lastUpdated}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {sk.verificationStatus === 'Verified' ? (
                        <span className="text-forest font-semibold flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Certified</span>
                        </span>
                      ) : (
                        <span className="text-ink-muted flex items-center gap-1">
                          <span>Inspect details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Skill Detail & Vertical Timeline Pane (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          {activeSkill ? (
            <div className="bg-paper-card border border-border rounded-sm shadow-editorial p-6 space-y-6">
              
              {/* Header */}
              <div className="pb-4 border-b border-border space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-forest">
                    {activeSkill.category}
                  </span>
                  <StatusBadge status={activeSkill.verificationStatus} refId={activeSkill.verificationRefId} />
                </div>
                <h2 className="font-serif text-2xl font-normal text-ink">
                  {activeSkill.skillName}
                </h2>
                <ProficiencyMeter level={activeSkill.proficiency} />
              </div>

              {/* Verified Attestation Card if Verified */}
              {activeSkill.verificationStatus === 'Verified' && activeSkill.verifiedBy && (
                <div className="p-3.5 bg-forest-surface border border-forest/20 rounded-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-forest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-forest" />
                      Academic Attestation
                    </span>
                    <span className="font-mono text-[10px] text-forest font-bold">
                      {activeSkill.verificationRefId}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-light">
                    Verified by <strong>{activeSkill.verifiedBy}</strong> ({activeSkill.verifiedByRole}) on {activeSkill.verifiedAt}.
                  </p>
                  <button
                    onClick={() => setSelectedRecordId(activeSkill.verificationRefId || null)}
                    className="text-[11px] font-medium text-forest hover:underline pt-1 block"
                  >
                    View Official Cryptographic Record →
                  </button>
                </div>
              )}

              {/* Context / Notes */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block mb-1">
                  Candidate Notes
                </span>
                <p className="text-xs text-ink-light bg-paper p-3 rounded-sm border border-border-subtle leading-relaxed">
                  {activeSkill.notes || 'No notes added for this skill.'}
                </p>
              </div>

              {/* Vertical Evidence Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
                    Evidence Timeline ({activeEvidence.length})
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSkillForEvidence(activeSkill.skillId);
                      setIsSubmitEvidenceOpen(true);
                    }}
                    className="text-[11px] text-forest hover:text-forest-deep font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Evidence</span>
                  </button>
                </div>

                {activeEvidence.length === 0 ? (
                  <div className="p-4 bg-paper border border-dashed border-border text-center text-xs text-ink-muted space-y-2">
                    <p>No evidence submitted for this skill yet.</p>
                    <button
                      onClick={() => {
                        setSelectedSkillForEvidence(activeSkill.skillId);
                        setIsSubmitEvidenceOpen(true);
                      }}
                      className="px-3 py-1.5 bg-paper-card border border-border text-ink text-xs font-medium rounded-sm hover:bg-paper"
                    >
                      + Submit Artifact
                    </button>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-sage-border ml-2 space-y-4 py-1">
                    {activeEvidence.map((ev) => (
                      <div key={ev.id} className="relative pl-5 group">
                        {/* Dot */}
                        <div
                          className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                            ev.status === 'Verified'
                              ? 'bg-forest border-paper'
                              : 'bg-paper-card border-terracotta'
                          }`}
                        />
                        
                        <div className="p-3 bg-paper border border-border rounded-sm space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-ink line-clamp-1">{ev.title}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-xs ${
                                ev.status === 'Verified'
                                  ? 'bg-forest/10 text-forest'
                                  : 'bg-terracotta/10 text-terracotta'
                              }`}
                            >
                              {ev.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-ink-light line-clamp-2 leading-relaxed">
                            {ev.contribution}
                          </p>

                          {ev.reviewerFeedback && (
                            <blockquote className="p-2 bg-paper-subtle border-l-2 border-forest text-[10px] italic text-ink-muted">
                              "{ev.reviewerFeedback}"
                            </blockquote>
                          )}

                          <div className="pt-1 flex items-center justify-between text-[10px] text-ink-faint">
                            <span>Completed: {ev.dateCompleted}</span>
                            {ev.url && (
                              <a
                                href={ev.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-forest hover:underline flex items-center gap-0.5"
                              >
                                View Artifact <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Assessments for this Skill */}
              {activeSubmissions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
                    Completed Assessments
                  </span>
                  {activeSubmissions.map((sub) => {
                    const asm = assessments.find((a) => a.id === sub.assessmentId);
                    return (
                      <div key={sub.id} className="p-3 bg-paper border border-border rounded-sm text-xs space-y-1">
                        <div className="flex justify-between font-medium text-ink">
                          <span>{asm?.title || 'Skill Assessment'}</span>
                          <span className="text-forest font-semibold">{sub.totalScore}/{sub.maxTotalScore} pts</span>
                        </div>
                        <p className="text-[11px] text-ink-muted italic">"{sub.overallFeedback}"</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    if (confirm(`Remove "${activeSkill.skillName}" from your passport?`)) {
                      removeStudentSkill(activeSkill.id);
                    }
                  }}
                  className="text-ink-muted hover:text-terracotta transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Skill</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSkillForEvidence(activeSkill.skillId);
                    setIsSubmitEvidenceOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-forest text-paper hover:bg-forest-deep rounded-sm font-medium text-xs transition-colors"
                >
                  Submit Evidence
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 bg-paper-card border border-border text-center text-xs text-ink-muted">
              Select a skill from the left to view timeline and verification details.
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
      />

      <SubmitEvidenceModal
        isOpen={isSubmitEvidenceOpen}
        onClose={() => setIsSubmitEvidenceOpen(false)}
        preselectedSkillId={selectedSkillForEvidence}
      />

      <VerificationRecordModal
        record={selectedRecord}
        onClose={() => setSelectedRecordId(null)}
      />
    </div>
  );
};
