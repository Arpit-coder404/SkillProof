import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { VerificationRequest, AssessmentSubmission } from '../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  ChevronRight,
  FileText,
  UserCheck,
  XCircle,
  Check,
  HelpCircle,
  Sliders
} from 'lucide-react';

export const MentorDashboardPage: React.FC = () => {
  const {
    currentUser,
    verificationRequests,
    evidence,
    assessmentSubmissions,
    assessments,
    processVerification,
    evaluateAssessmentSubmission,
  } = useStore();

  const isReviewer = currentUser.role === 'mentor' || currentUser.role === 'faculty' || currentUser.role === 'admin';

  // Requests assigned to current reviewer (or all for admin)
  const myPendingRequests = verificationRequests.filter(
    (r) => (r.reviewerId === currentUser.id || currentUser.role === 'admin') && r.status === 'In Review'
  );
  const myCompletedRequests = verificationRequests.filter(
    (r) => (r.reviewerId === currentUser.id || currentUser.role === 'admin') && r.status !== 'In Review'
  );

  // Submissions for assessments authored by this reviewer
  const myAuthoredAssessments = assessments.filter(
    (a) => a.creatorId === currentUser.id || currentUser.role === 'admin'
  );
  const pendingSubmissions = assessmentSubmissions.filter((s) => {
    const asm = assessments.find((a) => a.id === s.assessmentId);
    return (asm?.creatorId === currentUser.id || currentUser.role === 'admin') && s.status === 'Submitted';
  });

  const [activeTab, setActiveTab] = useState<'requests' | 'assessments' | 'history'>('requests');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(myPendingRequests[0]?.id || null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(pendingSubmissions[0]?.id || null);

  // Verification decision form state
  const [decisionNotes, setDecisionNotes] = useState('');
  const [criteriaChecked, setCriteriaChecked] = useState<Record<string, boolean>>({
    'Code Quality & Architectural Correctness': true,
    'Independent Personal Contribution Validated': true,
    'Edge Case Resilience & Test Coverage': true,
    'Clear Technical Documentation': true,
  });

  // Assessment grading form state
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [overallAssessmentFeedback, setOverallAssessmentFeedback] = useState('');

  const activeRequest = verificationRequests.find((r) => r.id === selectedRequestId);
  const targetEvidence = activeRequest ? evidence.find((e) => e.id === activeRequest.evidenceId) : null;

  const activeSubmission = assessmentSubmissions.find((s) => s.id === selectedSubmissionId);
  const activeSubmissionAssessment = activeSubmission ? assessments.find((a) => a.id === activeSubmission.assessmentId) : null;

  // Handle Verification Review Decision
  const handleProcessDecision = (decision: 'Verified' | 'Revision Requested' | 'Declined') => {
    if (!activeRequest) return;

    if (activeRequest.studentId === currentUser.id) {
      alert('Security violation: You cannot verify your own evidence.');
      return;
    }

    if (!decisionNotes.trim()) {
      alert('Please provide evaluation comments explaining your decision.');
      return;
    }

    const selectedCriteria = Object.keys(criteriaChecked).filter((k) => criteriaChecked[k]);

    processVerification(activeRequest.id, decision, decisionNotes, selectedCriteria);

    if (decision === 'Verified') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#234B3C', '#DCE5DC', '#D77A45'],
        });
      } catch (e) {
        // confetti fallback
      }
    }

    setDecisionNotes('');
    setSelectedRequestId(null);
  };

  // Handle Assessment Grading
  const handleGradeAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission || !activeSubmissionAssessment) return;

    const scoresList = activeSubmissionAssessment.rubric.map((crit) => ({
      criterionId: crit.id,
      criterionName: crit.name,
      score: rubricScores[crit.id] ?? crit.maxScore,
      maxScore: crit.maxScore,
    }));

    evaluateAssessmentSubmission(activeSubmission.id, scoresList, overallAssessmentFeedback);
    setOverallAssessmentFeedback('');
    setSelectedSubmissionId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-forest font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-forest" />
            Accredited Evaluator Workspace
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            Review & Attestation Center
          </h1>
          <p className="text-sm text-ink-light mt-1">
            Logged in as <strong className="text-ink">{currentUser.name}</strong> ({currentUser.headline || currentUser.role}).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-paper border border-border rounded-sm p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-xs font-medium transition-colors ${
              activeTab === 'requests' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Evidence Verifications ({myPendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-3 py-1.5 rounded-xs font-medium transition-colors ${
              activeTab === 'assessments' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Pending Assessments ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xs font-medium transition-colors ${
              activeTab === 'history' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Completed History ({myCompletedRequests.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Verification Requests */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Incoming Submissions List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-2">
              Incoming Evidence ({myPendingRequests.length})
            </span>

            {myPendingRequests.length === 0 ? (
              <div className="bg-paper-card border border-border p-8 text-center text-xs text-ink-muted rounded-sm">
                No pending verification requests at this time. All caught up!
              </div>
            ) : (
              myPendingRequests.map((req) => {
                const isSelected = activeRequest?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setDecisionNotes('');
                    }}
                    className={`p-4 bg-paper-card border rounded-sm transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-forest ring-1 ring-forest/20 shadow-editorial'
                        : 'border-border hover:border-forest/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forest">{req.studentName}</span>
                      <span className="text-[10px] font-mono text-ink-muted">{req.requestDate}</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-ink line-clamp-1">
                      {req.evidenceTitle}
                    </h4>

                    <span className="inline-block text-[10px] uppercase font-mono px-1.5 py-0.2 bg-paper text-ink-muted border border-border rounded-xs">
                      Competency: {req.skillName}
                    </span>

                    {req.studentNote && (
                      <p className="text-[11px] text-ink-light italic line-clamp-2">
                        "{req.studentNote}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Dedicated Review Screen (7 cols) */}
          <div className="lg:col-span-7">
            {activeRequest && targetEvidence ? (
              <div className="bg-paper-card border border-border rounded-sm shadow-editorial p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="pb-4 border-b border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest">
                      Verification Review • Request {activeRequest.id}
                    </span>
                    <span className="text-xs text-ink-muted">
                      Candidate: <strong className="text-ink">{activeRequest.studentName}</strong>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-normal text-ink">
                    {targetEvidence.title}
                  </h2>

                  <div className="flex items-center gap-3 text-xs text-ink-muted pt-1">
                    <span>Medium: <strong>{targetEvidence.type}</strong></span>
                    <span>•</span>
                    <span>Competency: <strong className="text-forest">{targetEvidence.skillName}</strong></span>
                    <span>•</span>
                    <span>Completed: {targetEvidence.dateCompleted}</span>
                  </div>
                </div>

                {/* Candidate Contribution Statement */}
                <div className="space-y-1.5 bg-paper p-4 rounded-sm border border-border-subtle">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                    Candidate Self-Declared Personal Contribution
                  </span>
                  <p className="text-xs text-ink-light leading-relaxed">
                    {targetEvidence.contribution}
                  </p>
                </div>

                {/* Artifact Link */}
                {targetEvidence.url && (
                  <div className="p-3 bg-paper-subtle border border-border rounded-sm flex items-center justify-between text-xs">
                    <span className="text-ink-muted">Supporting Artifact Repository / URL:</span>
                    <a
                      href={targetEvidence.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-forest font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <span>Open Candidate Artifact</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Rubric Criteria Checklist */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                    Evaluator Verification Criteria Checklist
                  </span>
                  <div className="space-y-2 text-xs">
                    {Object.keys(criteriaChecked).map((crit) => (
                      <label key={crit} className="flex items-center gap-2.5 cursor-pointer text-ink-light">
                        <input
                          type="checkbox"
                          checked={criteriaChecked[crit]}
                          onChange={(e) =>
                            setCriteriaChecked({ ...criteriaChecked, [crit]: e.target.checked })
                          }
                          className="w-4 h-4 accent-forest rounded"
                        />
                        <span>{crit}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reviewer Feedback Input */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-ink">
                    Official Evaluator Evaluation Notes *
                  </label>
                  <p className="text-[10px] text-ink-muted">
                    Your notes will be permanently sealed into the student's verification certificate and public skills passport.
                  </p>
                  <textarea
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="e.g. Verified log consistency checks, split-brain survival tests, and asynchronous event loops. Code exhibits advanced understanding of Raft consensus."
                    rows={4}
                    className="w-full p-3 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleProcessDecision('Declined')}
                      className="px-3.5 py-2 bg-paper border border-border hover:bg-terracotta/10 text-terracotta-dark text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Evidence</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProcessDecision('Revision Requested')}
                      className="px-3.5 py-2 bg-paper border border-border hover:bg-amber-50 text-amber-800 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Request Revision</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProcessDecision('Verified')}
                    className="px-5 py-2.5 bg-forest hover:bg-forest-deep text-paper text-xs font-semibold rounded-sm transition-colors shadow-editorial flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Cryptographically Seal Verification</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-12 bg-paper-card border border-border rounded-sm text-center text-xs text-ink-muted">
                Select a verification request from the left column to inspect evidence and submit attestation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Assessments to Grade */}
      {activeTab === 'assessments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-2">
              Ungraded Submissions ({pendingSubmissions.length})
            </span>

            {pendingSubmissions.length === 0 ? (
              <div className="bg-paper-card border border-border p-8 text-center text-xs text-ink-muted rounded-sm">
                No ungraded student assessment submissions right now.
              </div>
            ) : (
              pendingSubmissions.map((sub) => {
                const isSelected = activeSubmission?.id === sub.id;
                const asm = assessments.find((a) => a.id === sub.assessmentId);

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className={`p-4 bg-paper-card border rounded-sm transition-all cursor-pointer space-y-2 ${
                      isSelected ? 'border-forest ring-1 ring-forest/20 shadow-editorial' : 'border-border hover:border-forest/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forest">{sub.studentName}</span>
                      <span className="text-[10px] font-mono text-ink-muted">{sub.submissionDate}</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-ink line-clamp-1">
                      {asm?.title || 'Assessment'}
                    </h4>

                    <p className="text-[11px] text-ink-light line-clamp-2 italic">
                      "{sub.notes}"
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:col-span-7">
            {activeSubmission && activeSubmissionAssessment ? (
              <form onSubmit={handleGradeAssessment} className="bg-paper-card border border-border rounded-sm shadow-editorial p-6 sm:p-8 space-y-6 text-xs">
                <div className="pb-4 border-b border-border space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">
                    Assessment Evaluation • {activeSubmissionAssessment.title}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Candidate: {activeSubmission.studentName}
                  </h3>
                </div>

                {/* Candidate notes and URL */}
                <div className="bg-paper p-3.5 rounded-sm border border-border-subtle space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                    Submission Details
                  </span>
                  <a
                    href={activeSubmission.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest hover:underline font-medium break-all flex items-center gap-1"
                  >
                    <span>{activeSubmission.projectUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-[11px] text-ink-light pt-1">{activeSubmission.notes}</p>
                </div>

                {/* Rubric Input Fields */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                    Rubric Scoring
                  </span>

                  {activeSubmissionAssessment.rubric.map((crit) => (
                    <div key={crit.id} className="p-3 bg-paper border border-border rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-ink">{crit.name}</p>
                          <p className="text-[11px] text-ink-muted">{crit.description}</p>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <input
                            type="number"
                            min={0}
                            max={crit.maxScore}
                            value={rubricScores[crit.id] ?? crit.maxScore}
                            onChange={(e) =>
                              setRubricScores({ ...rubricScores, [crit.id]: Number(e.target.value) })
                            }
                            className="w-12 p-1 bg-paper-card border border-border rounded text-center font-bold text-forest"
                          />
                          <span className="text-ink-muted">/ {crit.maxScore}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall Feedback */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-ink">
                    Overall Faculty Feedback & Recommendations
                  </label>
                  <textarea
                    value={overallAssessmentFeedback}
                    onChange={(e) => setOverallAssessmentFeedback(e.target.value)}
                    placeholder="Provide constructive feedback on what the student excelled at and areas for architectural growth..."
                    rows={3}
                    className="w-full p-2.5 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-forest hover:bg-forest-deep text-paper text-xs font-semibold rounded-sm shadow-subtle flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit Formal Evaluation</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-12 bg-paper-card border border-border rounded-sm text-center text-xs text-ink-muted">
                Select an ungraded assessment submission from the left.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Completed History */}
      {activeTab === 'history' && (
        <div className="bg-paper-card border border-border rounded-sm p-6 space-y-4">
          <h3 className="font-serif text-lg font-medium text-ink pb-3 border-b border-border">
            Accreditation Audit History ({myCompletedRequests.length})
          </h3>

          <div className="divide-y divide-border-subtle">
            {myCompletedRequests.map((req) => (
              <div key={req.id} className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{req.studentName}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-paper border border-border text-ink-muted rounded-xs">
                      {req.skillName}
                    </span>
                  </div>
                  <p className="font-medium text-ink-light">{req.evidenceTitle}</p>
                  {req.decisionNote && (
                    <p className="text-[11px] text-ink-muted italic">"{req.decisionNote}"</p>
                  )}
                  <span className="text-[10px] text-ink-faint block">Completed on {req.completedAt}</span>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-sm border shrink-0 ${
                    req.status === 'Verified'
                      ? 'bg-forest/10 text-forest border-forest/20'
                      : 'bg-paper text-ink-muted border-border'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
