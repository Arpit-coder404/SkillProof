import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { StatusBadge, ProficiencyMeter } from '../components/StatusBadge';
import { AddSkillModal } from '../components/AddSkillModal';
import { SubmitEvidenceModal } from '../components/SubmitEvidenceModal';
import { VerificationRecordModal } from '../components/VerificationRecordModal';
import {
  ShieldCheck,
  Award,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCode
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    studentSkills,
    evidence,
    verificationRequests,
    assessments,
    verificationRecords,
    auditLogs
  } = useStore();

  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isSubmitEvidenceOpen, setIsSubmitEvidenceOpen] = useState(false);
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<string | undefined>();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Student specific data
  const mySkills = studentSkills.filter((s) => s.studentId === currentUser.id);
  const myEvidence = evidence.filter((e) => e.studentId === currentUser.id);
  const myRequests = verificationRequests.filter((r) => r.studentId === currentUser.id);
  const myAudit = auditLogs.filter((a) => a.actorId === currentUser.id || a.targetId.includes(currentUser.id)).slice(0, 5);

  const verifiedSkillsCount = mySkills.filter((s) => s.verificationStatus === 'Verified').length;
  const pendingRequestsCount = myRequests.filter((r) => r.status === 'In Review' || r.status === 'Pending').length;
  const verifiedEvidenceCount = myEvidence.filter((e) => e.status === 'Verified').length;

  // Profile completion calculation
  const completionPercentage = Math.min(
    100,
    Math.round(
      (currentUser.bio ? 20 : 0) +
      (currentUser.headline ? 15 : 0) +
      (mySkills.length >= 3 ? 25 : mySkills.length * 8) +
      (verifiedSkillsCount >= 1 ? 25 : 0) +
      (myEvidence.length >= 2 ? 15 : myEvidence.length * 7)
    )
  );

  const selectedRecord = verificationRecords.find((r) => r.id === selectedRecordId || r.referenceId === selectedRecordId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium">
            Student Workspace • {currentUser.university}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            Good afternoon, {currentUser.name.split(' ')[0]}.
          </h1>
          <p className="text-sm text-ink-light mt-1">
            Your skills passport is taking shape with {verifiedSkillsCount} verified {verifiedSkillsCount === 1 ? 'competency' : 'competencies'}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddSkillOpen(true)}
            className="px-3.5 py-2 bg-paper-card border border-border hover:bg-paper text-ink text-xs font-medium rounded-sm transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-forest" />
            <span>Add Skill</span>
          </button>
          <button
            onClick={() => {
              setSelectedSkillForEvidence(undefined);
              setIsSubmitEvidenceOpen(true);
            }}
            className="px-3.5 py-2 bg-forest hover:bg-forest-deep text-paper text-xs font-medium rounded-sm transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Submit Evidence</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-paper-card p-4 border border-border rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
            Passport Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink">{completionPercentage}%</span>
            <span className="text-[10px] text-forest font-medium">Ready</span>
          </div>
          <div className="w-full bg-border h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-forest h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div className="bg-paper-card p-4 border border-border rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
            Documented Skills
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink">{mySkills.length}</span>
            <span className="text-[10px] text-ink-muted">in passport</span>
          </div>
        </div>

        <div className="bg-paper-card p-4 border border-border rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-forest block mb-1 font-semibold">
            Verified Skills
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-forest">{verifiedSkillsCount}</span>
            <span className="text-[10px] text-forest/80 font-medium">certified</span>
          </div>
        </div>

        <div className="bg-paper-card p-4 border border-border rounded-sm">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
            Evidence Submitted
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink">{myEvidence.length}</span>
            <span className="text-[10px] text-ink-muted">artifacts</span>
          </div>
        </div>

        <div className="bg-paper-card p-4 border border-border rounded-sm col-span-2 md:col-span-1">
          <span className="text-[11px] uppercase tracking-wider text-terracotta-dark block mb-1">
            Pending Reviews
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-terracotta">{pendingRequestsCount}</span>
            <span className="text-[10px] text-ink-muted">with faculty</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Left Column (7 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Skills Currently Being Developed */}
          <section className="bg-paper-card border border-border rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Skills Portfolio</h3>
                <p className="text-[11px] text-ink-muted">Demonstrated and developing competencies</p>
              </div>
              <Link to="/skills" className="text-xs text-forest hover:text-forest-deep font-medium flex items-center gap-1">
                <span>View all skills</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border-subtle">
              {mySkills.length === 0 ? (
                <div className="py-8 text-center text-xs text-ink-muted">
                  No skills documented yet. Add your first skill to start your passport.
                </div>
              ) : (
                mySkills.map((sk) => (
                  <div key={sk.id} className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/skills`} className="font-medium text-xs text-ink hover:text-forest transition-colors">
                          {sk.skillName}
                        </Link>
                        <StatusBadge status={sk.verificationStatus} refId={sk.verificationRefId} />
                      </div>
                      <p className="text-[11px] text-ink-muted line-clamp-1">{sk.notes || sk.category}</p>
                      <div className="w-48">
                        <ProficiencyMeter level={sk.proficiency} compact />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-ink-muted mr-1">
                        {sk.evidenceCount} {sk.evidenceCount === 1 ? 'evidence' : 'evidence'}
                      </span>
                      {sk.verificationStatus !== 'Verified' ? (
                        <button
                          onClick={() => {
                            setSelectedSkillForEvidence(sk.skillId);
                            setIsSubmitEvidenceOpen(true);
                          }}
                          className="px-2.5 py-1 bg-paper border border-border hover:border-forest/40 text-[11px] font-medium text-ink rounded-sm transition-colors"
                        >
                          + Evidence
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedRecordId(sk.verificationRefId || null)}
                          className="px-2.5 py-1 bg-forest/10 hover:bg-forest/15 border border-forest/20 text-[11px] font-medium text-forest rounded-sm transition-colors"
                        >
                          View Attestation
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Pending Verification Requests */}
          <section className="bg-paper-card border border-border rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Verification Workflow</h3>
                <p className="text-[11px] text-ink-muted">Status of submissions under faculty review</p>
              </div>
              <span className="text-xs font-mono text-ink-muted">{myRequests.length} Total</span>
            </div>

            {myRequests.length === 0 ? (
              <p className="text-xs text-ink-muted py-4">No active verification requests.</p>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-3.5 bg-paper border border-border-subtle rounded-sm flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-ink">{req.evidenceTitle}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-paper-card border border-border text-ink-muted rounded-xs">
                          {req.skillName}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        Assigned Reviewer: <strong className="text-ink">{req.reviewerName}</strong>
                      </p>
                      {req.studentNote && (
                        <p className="text-[11px] text-ink-light italic">"{req.studentNote}"</p>
                      )}
                      <span className="text-[10px] text-ink-faint block">Requested: {req.requestDate}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded-sm border ${
                          req.status === 'Verified'
                            ? 'bg-forest/10 text-forest border-forest/20'
                            : req.status === 'In Review'
                            ? 'bg-terracotta/10 text-terracotta-dark border-terracotta/20'
                            : 'bg-paper text-ink-muted border-border'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recently Added Evidence */}
          <section className="bg-paper-card border border-border rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">Recent Evidence Artifacts</h3>
                <p className="text-[11px] text-ink-muted">Code repositories, prototypes, and papers</p>
              </div>
              <Link to="/evidence" className="text-xs text-forest hover:text-forest-deep font-medium flex items-center gap-1">
                <span>Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {myEvidence.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-3.5 bg-paper border border-border-subtle rounded-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-forest" />
                      <span className="font-medium text-xs text-ink">{ev.title}</span>
                    </div>
                    <p className="text-[11px] text-ink-light line-clamp-2">{ev.contribution}</p>
                    <div className="flex items-center gap-3 text-[10px] text-ink-muted pt-1">
                      <span>Type: {ev.type}</span>
                      <span>•</span>
                      <span>Skill: {ev.skillName}</span>
                      {ev.url && (
                        <>
                          <span>•</span>
                          <a href={ev.url} target="_blank" rel="noreferrer" className="text-forest hover:underline flex items-center gap-0.5">
                            Artifact <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-sm border ${
                      ev.status === 'Verified'
                        ? 'bg-forest/10 text-forest border-forest/20'
                        : 'bg-paper text-ink-muted border-border'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Next Actions */}
          <section className="p-5 bg-paper-subtle border border-border rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <TrendingUp className="w-4 h-4 text-forest" />
              <h4 className="font-serif font-medium text-sm">Recommended Next Actions</h4>
            </div>
            <ul className="space-y-2 text-xs text-ink-light">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                <span>
                  Submit evidence for <strong>Cross-Functional Team Leadership</strong> to progress from Self-declared to Evidence Submitted.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                <span>
                  Attempt the <strong>Distributed Consensus Safety Challenge</strong> assessment to add a high-rigor systems attestation.
                </span>
              </li>
            </ul>
          </section>

        </div>

        {/* Side Column (5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Passport Preview Card */}
          <div className="bg-paper-card border border-border rounded-sm p-5 space-y-4 shadow-subtle">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold block">
                  Public Skills Passport
                </span>
                <h4 className="font-serif font-bold text-base text-ink mt-0.5">{currentUser.name}</h4>
                <p className="text-[11px] text-ink-muted">{currentUser.department}</p>
              </div>
              <span className="px-2 py-0.5 bg-forest/10 text-forest text-[10px] font-bold rounded-sm border border-forest/20">
                Live
              </span>
            </div>

            <div className="p-3 bg-paper border border-border-subtle rounded-sm text-xs space-y-2">
              <div className="flex justify-between text-ink-muted text-[11px]">
                <span>Status:</span>
                <span className="text-forest font-semibold">Active & Shareable</span>
              </div>
              <div className="flex justify-between text-ink-muted text-[11px]">
                <span>Verified Badges:</span>
                <span className="text-ink font-semibold">{verifiedSkillsCount}</span>
              </div>
              <div className="flex justify-between text-ink-muted text-[11px]">
                <span>Reviewed Evidence:</span>
                <span className="text-ink font-semibold">{verifiedEvidenceCount}</span>
              </div>
            </div>

            <Link
              to={`/passport/${currentUser.id}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-paper border border-border hover:bg-paper-subtle text-forest text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Preview Public Profile</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-paper-card border border-border rounded-sm p-5 space-y-3">
            <h4 className="font-serif font-semibold text-sm text-ink pb-2 border-b border-border">
              Quick Actions
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setIsAddSkillOpen(true)}
                className="w-full text-left p-2 hover:bg-paper-subtle rounded-sm flex items-center justify-between transition-colors text-ink"
              >
                <span>Add new skill to passport</span>
                <Plus className="w-3.5 h-3.5 text-ink-muted" />
              </button>
              <button
                onClick={() => {
                  setSelectedSkillForEvidence(undefined);
                  setIsSubmitEvidenceOpen(true);
                }}
                className="w-full text-left p-2 hover:bg-paper-subtle rounded-sm flex items-center justify-between transition-colors text-ink"
              >
                <span>Submit evidence artifact</span>
                <FileText className="w-3.5 h-3.5 text-ink-muted" />
              </button>
              <Link
                to="/assessments"
                className="w-full text-left p-2 hover:bg-paper-subtle rounded-sm flex items-center justify-between transition-colors text-ink block"
              >
                <span>Browse skill assessments</span>
                <Award className="w-3.5 h-3.5 text-ink-muted" />
              </Link>
              <Link
                to="/discover"
                className="w-full text-left p-2 hover:bg-paper-subtle rounded-sm flex items-center justify-between transition-colors text-ink block"
              >
                <span>Explore student directory</span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              </Link>
            </div>
          </div>

          {/* Upcoming Assessment Deadlines */}
          <div className="bg-paper-card border border-border rounded-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-serif font-semibold text-sm text-ink">
                Available Assessments
              </h4>
              <Link to="/assessments" className="text-[11px] text-forest hover:underline">
                All ({assessments.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {assessments.slice(0, 2).map((asm) => (
                <div key={asm.id} className="p-2.5 bg-paper border border-border-subtle rounded-sm space-y-1.5 text-xs">
                  <Link to="/assessments" className="font-medium text-ink hover:text-forest transition-colors block">
                    {asm.title}
                  </Link>
                  <p className="text-[11px] text-ink-muted">Skill: {asm.skillName}</p>
                  <div className="flex items-center justify-between text-[10px] text-ink-muted pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-terracotta" />
                      <span>Due {asm.deadline}</span>
                    </span>
                    <span className="font-medium text-forest">{asm.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

