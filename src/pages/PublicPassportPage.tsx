import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { StatusBadge, ProficiencyMeter } from '../components/StatusBadge';
import { VerificationRecordModal } from '../components/VerificationRecordModal';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import {
  ShieldCheck,
  Printer,
  Share2,
  ExternalLink,
  Award,
  FileCode,
  CheckCircle2,
  Globe,
  Lock,
  Layers,
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const PublicPassportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users, studentSkills, evidence, assessmentSubmissions, assessments, verificationRecords, currentUser, updateUserProfile } = useStore();

  const [filterMode, setFilterMode] = useState<'all' | 'verified_only' | 'evidence' | 'assessments'>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find target student
  const student = users.find((u) => u.id === id) || users.find((u) => u.id === 'student-arpit') || users[0];
  const isOwner = currentUser.id === student.id;

  // Student's data
  const mySkills = studentSkills.filter((s) => s.studentId === student.id);
  const myEvidence = evidence.filter((e) => e.studentId === student.id);
  const mySubmissions = assessmentSubmissions.filter((sub) => sub.studentId === student.id);

  const verifiedSkills = mySkills.filter((s) => s.verificationStatus === 'Verified');
  const verifiedEvidence = myEvidence.filter((e) => e.status === 'Verified');

  const selectedRecord = verificationRecords.find(
    (r) => r.id === selectedRecordId || r.referenceId === selectedRecordId
  ) || null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Privacy check
  if (!student.isPublicProfile && !isOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-paper-subtle border border-border rounded-full flex items-center justify-center mx-auto text-ink-muted">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-normal text-ink">This Skills Passport is Private</h2>
        <p className="text-xs text-ink-muted">
          The candidate has set their profile visibility to private. Only authorized evaluators or the owner can view this document.
        </p>
        <Link to="/" className="inline-block px-4 py-2 bg-paper border border-border text-xs text-ink font-medium rounded-sm">
          Return to SkillProof Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner / Controls (no-print) */}
      <div className="no-print bg-paper-card border border-border p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-forest" />
          <span className="font-semibold text-ink">Public Skills Passport</span>
          <span className="text-ink-muted font-mono text-[11px]">/passport/{student.id}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isOwner && (
            <button
              onClick={() => updateUserProfile(student.id, { isPublicProfile: !student.isPublicProfile })}
              className="px-2.5 py-1.5 bg-paper border border-border text-ink rounded-sm hover:bg-paper-subtle flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-ink-muted" />
              <span>{student.isPublicProfile ? 'Profile: Public' : 'Profile: Private'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-paper border border-border hover:bg-paper-subtle text-ink rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-forest hover:bg-forest-deep text-paper font-medium rounded-sm flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Main Editorial Passport Document */}
      <div className="bg-paper-card border border-border rounded-sm shadow-editorial p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Passport Document Header */}
        <div className="pb-8 border-b-2 border-forest space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-sm bg-forest flex items-center justify-center text-paper font-serif font-bold text-lg">
                SP
              </div>
              <div>
                <span className="font-serif font-bold text-ink text-lg tracking-tight block leading-tight">
                  Collegiate Skills Passport
                </span>
                <span className="text-[10px] uppercase tracking-widest text-forest font-semibold">
                  Official Verification Standard
                </span>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="inline-block px-2.5 py-0.5 bg-forest/10 border border-forest/20 text-forest text-[11px] font-bold uppercase tracking-wider rounded-sm">
                Authentic Attestation
              </span>
              <span className="block font-mono text-[10px] text-ink-muted mt-1">
                Issued for {new Date().getFullYear()} • Academic Consortium
              </span>
            </div>
          </div>

          {/* Profile Bio Row */}
          <div className="flex flex-col md:flex-row items-start gap-6 pt-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-sm object-cover border-2 border-border shadow-subtle shrink-0"
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-serif text-3xl font-bold text-ink tracking-tight">
                  {student.name}
                </h1>
                <span className="font-mono text-xs text-ink-muted">
                  Class of {student.graduationYear || 2027}
                </span>
              </div>

              <p className="text-xs font-semibold text-forest uppercase tracking-wider">
                {student.headline}
              </p>

              <p className="text-xs text-ink-muted">
                {student.department} • <strong className="text-ink">{student.university}</strong>
              </p>

              <p className="text-xs text-ink-light leading-relaxed max-w-2xl pt-1">
                {student.bio}
              </p>

              {/* External links */}
              <div className="flex items-center gap-4 text-xs text-ink-muted pt-2 no-print">
                {student.githubUrl && (
                  <a href={student.githubUrl} target="_blank" rel="noreferrer" className="hover:text-forest flex items-center gap-1">
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {student.linkedinUrl && (
                  <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-forest flex items-center gap-1">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {student.portfolioUrl && (
                  <a href={student.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-forest flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Passport Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-paper border border-border rounded-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
              Verified Competencies
            </span>
            <span className="font-serif text-2xl font-bold text-forest">{verifiedSkills.length}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
              Documented Skills
            </span>
            <span className="font-serif text-2xl font-bold text-ink">{mySkills.length}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
              Verified Evidence
            </span>
            <span className="font-serif text-2xl font-bold text-ink">{verifiedEvidence.length}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
              Faculty Endorsements
            </span>
            <span className="font-serif text-2xl font-bold text-forest">
              {mySkills.filter((s) => s.verifiedBy).length}
            </span>
          </div>
        </div>

        {/* Filter Navigation (no-print) */}
        <div className="no-print flex items-center gap-2 border-b border-border pb-3 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors ${
              filterMode === 'all' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            All Competencies ({mySkills.length})
          </button>
          <button
            onClick={() => setFilterMode('verified_only')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors ${
              filterMode === 'verified_only' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Verified Only ({verifiedSkills.length})
          </button>
          <button
            onClick={() => setFilterMode('evidence')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors ${
              filterMode === 'evidence' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Evidence Artifacts ({myEvidence.length})
          </button>
          <button
            onClick={() => setFilterMode('assessments')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors ${
              filterMode === 'assessments' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Assessment Results ({mySubmissions.length})
          </button>
        </div>

        {/* Skills Section */}
        {(filterMode === 'all' || filterMode === 'verified_only') && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-ink pb-2 border-b border-border">
              {filterMode === 'verified_only' ? 'Verified Competencies' : 'Skills & Capabilities Inventory'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(filterMode === 'verified_only' ? verifiedSkills : mySkills).map((sk) => {
                const skillEvidence = myEvidence.filter((e) => e.skillId === sk.skillId);
                return (
                  <div
                    key={sk.id}
                    className={`p-4 bg-paper border rounded-sm space-y-3 ${
                      sk.verificationStatus === 'Verified' ? 'border-forest/40' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-forest block">
                          {sk.category}
                        </span>
                        <h4 className="font-serif font-bold text-base text-ink">{sk.skillName}</h4>
                      </div>
                      <StatusBadge status={sk.verificationStatus} refId={sk.verificationRefId} />
                    </div>

                    <ProficiencyMeter level={sk.proficiency} />

                    {sk.notes && (
                      <p className="text-xs text-ink-light line-clamp-2 leading-relaxed">
                        {sk.notes}
                      </p>
                    )}

                    {sk.verificationStatus === 'Verified' && sk.verifiedBy && (
                      <div
                        onClick={() => setSelectedRecordId(sk.verificationRefId || null)}
                        className="p-2.5 bg-forest-surface border border-forest/20 rounded-xs text-xs space-y-1 cursor-pointer hover:border-forest/50 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] text-forest font-bold">
                          <span>Verified by {sk.verifiedBy}</span>
                          <span className="font-mono">{sk.verificationRefId}</span>
                        </div>
                        <p className="text-[10px] text-ink-muted">{sk.verifiedByRole}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evidence Vault Section */}
        {(filterMode === 'all' || filterMode === 'evidence') && (
          <div className="space-y-6 pt-4">
            <h3 className="font-serif text-xl font-bold text-ink pb-2 border-b border-border">
              Inspected Project Artifacts & Evidence
            </h3>

            <div className="space-y-4">
              {myEvidence.map((ev) => (
                <div key={ev.id} className="p-4 bg-paper border border-border rounded-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-forest" />
                        <h4 className="font-serif font-bold text-base text-ink">{ev.title}</h4>
                      </div>
                      <span className="text-xs text-forest font-medium">Skill Target: {ev.skillName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm border ${
                          ev.status === 'Verified'
                            ? 'bg-forest/10 text-forest border-forest/20'
                            : 'bg-paper text-ink-muted border-border'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-paper-card p-3 rounded-sm border border-border-subtle text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-ink-muted block">
                      Candidate Contribution
                    </span>
                    <p className="text-ink-light leading-relaxed">{ev.contribution}</p>
                  </div>

                  {ev.reviewerFeedback && (
                    <blockquote className="p-3 bg-forest-surface border-l-2 border-forest text-xs italic text-ink-light">
                      "{ev.reviewerFeedback}" — <strong className="text-forest">{ev.reviewerName}</strong>
                    </blockquote>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
                    <span>Date: {ev.dateCompleted}</span>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Inspect Artifact Repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Results Section */}
        {(filterMode === 'all' || filterMode === 'assessments') && mySubmissions.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="font-serif text-xl font-bold text-ink pb-2 border-b border-border">
              Faculty Evaluated Assessments
            </h3>

            <div className="space-y-4">
              {mySubmissions.map((sub) => {
                const asm = assessments.find((a) => a.id === sub.assessmentId);
                return (
                  <div key={sub.id} className="p-4 bg-paper border border-border rounded-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-bold text-base text-ink">{asm?.title || 'Assessment'}</h4>
                        <p className="text-xs text-forest">Skill: {asm?.skillName}</p>
                      </div>
                      {sub.totalScore !== undefined && (
                        <span className="font-serif text-lg font-bold text-forest">
                          {sub.totalScore} / {sub.maxTotalScore} pts
                        </span>
                      )}
                    </div>
                    {sub.overallFeedback && (
                      <blockquote className="p-3 bg-forest-surface border-l-2 border-forest text-xs italic text-ink-light">
                        "{sub.overallFeedback}" — <strong>{sub.evaluatorName}</strong>
                      </blockquote>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Official Consortium Seal Footer */}
        <div className="pt-8 border-t-2 border-forest flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-forest flex items-center justify-center text-forest font-serif font-bold text-xs">
              SEAL
            </div>
            <div>
              <p className="font-semibold text-ink">SkillProof Cryptographic Attestation</p>
              <p className="text-[10px]">Verified under Collegiate Verification Standard v2.4</p>
            </div>
          </div>

          <div className="text-[10px] text-ink-faint text-center md:text-right max-w-sm">
            This passport records authentic evaluations conducted by accredited academic and industry reviewers. No automated generic badges are issued.
          </div>
        </div>

      </div>

      {/* Verification Record Seal Modal */}
      <VerificationRecordModal
        record={selectedRecord}
        onClose={() => setSelectedRecordId(null)}
      />
    </div>
  );
};
