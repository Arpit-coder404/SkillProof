import { create } from 'zustand';
import {
  User,
  SkillDefinition,
  StudentSkill,
  EvidenceItem,
  Assessment,
  AssessmentSubmission,
  VerificationRequest,
  VerificationRecord,
  Notification,
  AuditLog,
  ProficiencyLevel,
  EvidenceStatus
} from '../types';
import {
  INITIAL_USERS,
  SKILL_DEFINITIONS,
  INITIAL_STUDENT_SKILLS,
  INITIAL_EVIDENCE,
  INITIAL_ASSESSMENTS,
  INITIAL_ASSESSMENT_SUBMISSIONS,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_VERIFICATION_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';

const STORAGE_KEY = 'skillproof_store_v1';

interface AppState {
  // Current user / active session
  currentUserId: string;
  currentUser: User;

  // Collections
  users: User[];
  skillDefinitions: SkillDefinition[];
  studentSkills: StudentSkill[];
  evidence: EvidenceItem[];
  assessments: Assessment[];
  assessmentSubmissions: AssessmentSubmission[];
  verificationRequests: VerificationRequest[];
  verificationRecords: VerificationRecord[];
  notifications: Notification[];
  auditLogs: AuditLog[];

  // Actions
  setCurrentUser: (userId: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  
  // Student skills
  addStudentSkill: (skillId: string, proficiency: ProficiencyLevel, notes?: string) => StudentSkill;
  updateStudentSkill: (id: string, updates: Partial<StudentSkill>) => void;
  removeStudentSkill: (id: string) => void;

  // Evidence
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'dateSubmitted' | 'status'>, submitNow?: boolean, reviewerId?: string, note?: string) => EvidenceItem;
  updateEvidence: (id: string, updates: Partial<EvidenceItem>) => void;
  deleteEvidence: (id: string) => void;
  submitEvidenceForVerification: (evidenceId: string, reviewerId: string, studentNote?: string) => void;

  // Assessments
  createAssessment: (assessment: Omit<Assessment, 'id' | 'creatorId' | 'creatorName' | 'creatorRole'>) => Assessment;
  submitAssessment: (assessmentId: string, projectUrl: string, notes: string) => AssessmentSubmission;
  evaluateAssessmentSubmission: (submissionId: string, rubricScores: { criterionId: string; criterionName: string; score: number; maxScore: number; feedback?: string }[], overallFeedback: string) => void;

  // Verification Review Workflow
  processVerification: (
    requestId: string,
    decision: 'Verified' | 'Revision Requested' | 'Declined',
    comments: string,
    verifiedCriteria?: string[]
  ) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reset
  resetToDefaultData: () => void;
}

// Helper to load or initialize from localStorage
const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const user = parsed.users?.find((u: User) => u.id === parsed.currentUserId) || INITIAL_USERS[0];
      return {
        ...parsed,
        currentUser: user,
      };
    }
  } catch (err) {
    console.error('Failed to load SkillProof state from localStorage', err);
  }
  return {
    currentUserId: INITIAL_USERS[0].id,
    currentUser: INITIAL_USERS[0],
    users: INITIAL_USERS,
    skillDefinitions: SKILL_DEFINITIONS,
    studentSkills: INITIAL_STUDENT_SKILLS,
    evidence: INITIAL_EVIDENCE,
    assessments: INITIAL_ASSESSMENTS,
    assessmentSubmissions: INITIAL_ASSESSMENT_SUBMISSIONS,
    verificationRequests: INITIAL_VERIFICATION_REQUESTS,
    verificationRecords: INITIAL_VERIFICATION_RECORDS,
    notifications: INITIAL_NOTIFICATIONS,
    auditLogs: INITIAL_AUDIT_LOGS,
  };
};

export const useStore = create<AppState>((set, get) => {
  const initial = loadPersistedState();

  const syncStorage = (state: Partial<AppState>) => {
    try {
      const current = get();
      const payload = {
        currentUserId: state.currentUserId ?? current.currentUserId,
        users: state.users ?? current.users,
        skillDefinitions: state.skillDefinitions ?? current.skillDefinitions,
        studentSkills: state.studentSkills ?? current.studentSkills,
        evidence: state.evidence ?? current.evidence,
        assessments: state.assessments ?? current.assessments,
        assessmentSubmissions: state.assessmentSubmissions ?? current.assessmentSubmissions,
        verificationRequests: state.verificationRequests ?? current.verificationRequests,
        verificationRecords: state.verificationRecords ?? current.verificationRecords,
        notifications: state.notifications ?? current.notifications,
        auditLogs: state.auditLogs ?? current.auditLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  return {
    ...initial,

    setCurrentUser: (userId: string) => {
      const user = get().users.find((u) => u.id === userId);
      if (!user) return;
      set({ currentUserId: userId, currentUser: user });
      syncStorage({ currentUserId: userId });
    },

    updateUserProfile: (userId: string, updates: Partial<User>) => {
      const updatedUsers = get().users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
      const updatedCurrentUser = get().currentUserId === userId ? { ...get().currentUser, ...updates } : get().currentUser;
      set({ users: updatedUsers, currentUser: updatedCurrentUser });
      syncStorage({ users: updatedUsers });
    },

    addStudentSkill: (skillId: string, proficiency: ProficiencyLevel, notes?: string) => {
      const skillDef = get().skillDefinitions.find((s) => s.id === skillId);
      const studentId = get().currentUserId;
      const today = new Date().toISOString().split('T')[0];

      // Check if already exists
      const existing = get().studentSkills.find((ss) => ss.studentId === studentId && ss.skillId === skillId);
      if (existing) {
        get().updateStudentSkill(existing.id, { proficiency, notes, lastUpdated: today });
        return existing;
      }

      const newStudentSkill: StudentSkill = {
        id: `ss-${studentId}-${Date.now()}`,
        studentId,
        skillId,
        skillName: skillDef ? skillDef.name : 'Custom Skill',
        category: skillDef ? skillDef.category : 'Technology & Programming',
        proficiency,
        verificationStatus: 'Self-declared',
        dateAdded: today,
        lastUpdated: today,
        notes,
        evidenceCount: 0,
      };

      const updated = [newStudentSkill, ...get().studentSkills];
      set({ studentSkills: updated });
      syncStorage({ studentSkills: updated });
      return newStudentSkill;
    },

    updateStudentSkill: (id: string, updates: Partial<StudentSkill>) => {
      const updated = get().studentSkills.map((ss) =>
        ss.id === id ? { ...ss, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : ss
      );
      set({ studentSkills: updated });
      syncStorage({ studentSkills: updated });
    },

    removeStudentSkill: (id: string) => {
      const target = get().studentSkills.find((s) => s.id === id);
      if (!target) return;
      const updated = get().studentSkills.filter((s) => s.id !== id);
      set({ studentSkills: updated });
      syncStorage({ studentSkills: updated });
    },

    addEvidence: (evidenceData, submitNow = false, reviewerId, note) => {
      const current = get();
      const student = current.currentUser;
      const today = new Date().toISOString().split('T')[0];
      const evidenceId = `ev-${student.id}-${Date.now()}`;

      const reviewer = reviewerId ? current.users.find((u) => u.id === reviewerId) : undefined;
      const status: EvidenceStatus = submitNow && reviewerId ? 'Under review' : submitNow ? 'Submitted' : 'Draft';

      const newEvidence: EvidenceItem = {
        ...evidenceData,
        id: evidenceId,
        studentId: student.id,
        dateSubmitted: today,
        status,
        reviewerId: reviewer?.id,
        reviewerName: reviewer?.name,
        reviewerRole: reviewer?.headline || reviewer?.role,
      };

      const updatedEvidence = [newEvidence, ...current.evidence];

      // Update skill evidence count and status
      const updatedStudentSkills = current.studentSkills.map((ss) => {
        if (ss.studentId === student.id && ss.skillId === evidenceData.skillId) {
          const currentCount = ss.evidenceCount || 0;
          let newStatus = ss.verificationStatus;
          if (ss.verificationStatus === 'Self-declared') {
            newStatus = submitNow ? 'Under review' : 'Evidence submitted';
          }
          return {
            ...ss,
            evidenceCount: currentCount + 1,
            verificationStatus: newStatus,
            lastUpdated: today,
          };
        }
        return ss;
      });

      let updatedVerificationRequests = current.verificationRequests;
      let updatedNotifications = current.notifications;
      let updatedAuditLogs = current.auditLogs;

      if (submitNow && reviewerId && reviewer) {
        const newReq: VerificationRequest = {
          id: `vr-${Date.now()}`,
          studentId: student.id,
          studentName: student.name,
          evidenceId: newEvidence.id,
          evidenceTitle: newEvidence.title,
          skillId: newEvidence.skillId,
          skillName: newEvidence.skillName,
          reviewerId: reviewer.id,
          reviewerName: reviewer.name,
          requestDate: today,
          status: 'In Review',
          studentNote: note,
        };
        updatedVerificationRequests = [newReq, ...updatedVerificationRequests];

        // Notification for reviewer
        const notif: Notification = {
          id: `notif-${Date.now()}`,
          userId: reviewer.id,
          title: `New Verification Request: ${newEvidence.skillName}`,
          message: `${student.name} requested verification for "${newEvidence.title}".`,
          type: 'verification',
          read: false,
          createdAt: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          link: `/mentor/review/${newReq.id}`,
        };
        updatedNotifications = [notif, ...updatedNotifications];

        // Audit Log
        const log: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorId: student.id,
          actorName: student.name,
          actorRole: student.role,
          action: 'SUBMIT_VERIFICATION_REQUEST',
          targetType: 'EVIDENCE',
          targetId: newEvidence.id,
          details: `Requested verification from ${reviewer.name} for ${newEvidence.title}.`,
        };
        updatedAuditLogs = [log, ...updatedAuditLogs];
      }

      set({
        evidence: updatedEvidence,
        studentSkills: updatedStudentSkills,
        verificationRequests: updatedVerificationRequests,
        notifications: updatedNotifications,
        auditLogs: updatedAuditLogs,
      });

      syncStorage({
        evidence: updatedEvidence,
        studentSkills: updatedStudentSkills,
        verificationRequests: updatedVerificationRequests,
        notifications: updatedNotifications,
        auditLogs: updatedAuditLogs,
      });

      return newEvidence;
    },

    updateEvidence: (id: string, updates: Partial<EvidenceItem>) => {
      const updated = get().evidence.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
      set({ evidence: updated });
      syncStorage({ evidence: updated });
    },

    deleteEvidence: (id: string) => {
      const target = get().evidence.find((e) => e.id === id);
      if (!target) return;
      const updated = get().evidence.filter((e) => e.id !== id);
      
      // Decrement count on skill
      const updatedSkills = get().studentSkills.map((ss) => {
        if (ss.studentId === target.studentId && ss.skillId === target.skillId) {
          const newCount = Math.max(0, (ss.evidenceCount || 1) - 1);
          return {
            ...ss,
            evidenceCount: newCount,
            verificationStatus: newCount === 0 && ss.verificationStatus !== 'Verified' ? 'Self-declared' : ss.verificationStatus,
          };
        }
        return ss;
      });

      set({ evidence: updated, studentSkills: updatedSkills });
      syncStorage({ evidence: updated, studentSkills: updatedSkills });
    },

    submitEvidenceForVerification: (evidenceId: string, reviewerId: string, studentNote?: string) => {
      const current = get();
      const evidence = current.evidence.find((e) => e.id === evidenceId);
      const reviewer = current.users.find((u) => u.id === reviewerId);
      if (!evidence || !reviewer) return;

      const today = new Date().toISOString().split('T')[0];

      // Update evidence status
      const updatedEvidence = current.evidence.map((e) =>
        e.id === evidenceId
          ? {
              ...e,
              status: 'Under review' as EvidenceStatus,
              reviewerId: reviewer.id,
              reviewerName: reviewer.name,
              reviewerRole: reviewer.headline || reviewer.role,
            }
          : e
      );

      // Create Verification Request
      const newReq: VerificationRequest = {
        id: `vr-${Date.now()}`,
        studentId: evidence.studentId,
        studentName: current.users.find((u) => u.id === evidence.studentId)?.name || 'Student',
        evidenceId: evidence.id,
        evidenceTitle: evidence.title,
        skillId: evidence.skillId,
        skillName: evidence.skillName,
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        requestDate: today,
        status: 'In Review',
        studentNote,
      };

      // Update student skill status
      const updatedSkills = current.studentSkills.map((ss) =>
        ss.studentId === evidence.studentId && ss.skillId === evidence.skillId && ss.verificationStatus !== 'Verified'
          ? { ...ss, verificationStatus: 'Under review' as const, lastUpdated: today }
          : ss
      );

      // Notification to reviewer
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: reviewer.id,
        title: `Verification Request: ${evidence.skillName}`,
        message: `${newReq.studentName} requested your verification on "${evidence.title}".`,
        type: 'verification',
        read: false,
        createdAt: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        link: `/mentor/review/${newReq.id}`,
      };

      // Audit Log
      const auditLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: current.currentUserId,
        actorName: current.currentUser.name,
        actorRole: current.currentUser.role,
        action: 'REQUEST_VERIFICATION',
        targetType: 'EVIDENCE',
        targetId: evidenceId,
        details: `Requested verification from ${reviewer.name} for ${evidence.title}.`,
      };

      set({
        evidence: updatedEvidence,
        verificationRequests: [newReq, ...current.verificationRequests],
        studentSkills: updatedSkills,
        notifications: [notif, ...current.notifications],
        auditLogs: [auditLog, ...current.auditLogs],
      });

      syncStorage({
        evidence: updatedEvidence,
        verificationRequests: [newReq, ...current.verificationRequests],
        studentSkills: updatedSkills,
        notifications: [notif, ...current.notifications],
        auditLogs: [auditLog, ...current.auditLogs],
      });
    },

    createAssessment: (assessmentData) => {
      const current = get();
      const creator = current.currentUser;
      const newAssessment: Assessment = {
        ...assessmentData,
        id: `asm-${Date.now()}`,
        creatorId: creator.id,
        creatorName: creator.name,
        creatorRole: creator.headline || creator.role,
        submissionsCount: 0,
      };

      const updated = [newAssessment, ...current.assessments];
      set({ assessments: updated });
      syncStorage({ assessments: updated });
      return newAssessment;
    },

    submitAssessment: (assessmentId: string, projectUrl: string, notes: string) => {
      const current = get();
      const student = current.currentUser;
      const assessment = current.assessments.find((a) => a.id === assessmentId);
      const today = new Date().toISOString().split('T')[0];

      const newSubmission: AssessmentSubmission = {
        id: `sub-${student.id}-${Date.now()}`,
        assessmentId,
        studentId: student.id,
        studentName: student.name,
        submissionDate: today,
        status: 'Submitted',
        projectUrl,
        notes,
      };

      const updatedSubmissions = [newSubmission, ...current.assessmentSubmissions];
      const updatedAssessments = current.assessments.map((a) =>
        a.id === assessmentId ? { ...a, submissionsCount: (a.submissionsCount || 0) + 1 } : a
      );

      // Notify the assessment creator if available
      let updatedNotifications = current.notifications;
      if (assessment?.creatorId) {
        const notif: Notification = {
          id: `notif-${Date.now()}`,
          userId: assessment.creatorId,
          title: `Assessment Submission: ${assessment.title}`,
          message: `${student.name} submitted their response for evaluation.`,
          type: 'assessment',
          read: false,
          createdAt: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          link: `/mentor`,
        };
        updatedNotifications = [notif, ...updatedNotifications];
      }

      set({
        assessmentSubmissions: updatedSubmissions,
        assessments: updatedAssessments,
        notifications: updatedNotifications,
      });

      syncStorage({
        assessmentSubmissions: updatedSubmissions,
        assessments: updatedAssessments,
        notifications: updatedNotifications,
      });

      return newSubmission;
    },

    evaluateAssessmentSubmission: (submissionId, rubricScores, overallFeedback) => {
      const current = get();
      const reviewer = current.currentUser;
      const sub = current.assessmentSubmissions.find((s) => s.id === submissionId);
      if (!sub) return;

      const totalScore = rubricScores.reduce((acc, curr) => acc + curr.score, 0);
      const maxTotalScore = rubricScores.reduce((acc, curr) => acc + curr.maxScore, 0);
      const today = new Date().toISOString().split('T')[0];

      const updatedSubmissions = current.assessmentSubmissions.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'Evaluated' as const,
              evaluatorId: reviewer.id,
              evaluatorName: reviewer.name,
              evaluatedAt: today,
              rubricScores,
              totalScore,
              maxTotalScore,
              overallFeedback,
            }
          : s
      );

      // Notify student
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: sub.studentId,
        title: `Assessment Evaluated: ${totalScore} / ${maxTotalScore} pts`,
        message: `${reviewer.name} graded your assessment submission with comprehensive feedback.`,
        type: 'assessment',
        read: false,
        createdAt: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        link: `/assessments`,
      };

      set({
        assessmentSubmissions: updatedSubmissions,
        notifications: [notif, ...current.notifications],
      });

      syncStorage({
        assessmentSubmissions: updatedSubmissions,
        notifications: [notif, ...current.notifications],
      });
    },

    processVerification: (requestId, decision, comments, verifiedCriteria = []) => {
      const current = get();
      const reviewer = current.currentUser;
      const req = current.verificationRequests.find((r) => r.id === requestId);
      if (!req) return;

      // Security check: Reviewer cannot verify their own evidence
      if (req.studentId === reviewer.id) {
        alert('Reviewers cannot verify their own evidence submissions.');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const isApproved = decision === 'Verified';
      const referenceId = isApproved ? `SKP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}` : undefined;

      // 1. Update verification request
      const updatedRequests = current.verificationRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: isApproved ? ('Verified' as const) : decision === 'Revision Requested' ? ('Revision Requested' as const) : ('Declined' as const),
              completedAt: today,
              decisionNote: comments,
            }
          : r
      );

      // 2. Update evidence item
      const newEvidenceStatus: EvidenceStatus = isApproved ? 'Verified' : decision === 'Revision Requested' ? 'Needs revision' : 'Declined';
      const updatedEvidence = current.evidence.map((e) =>
        e.id === req.evidenceId
          ? {
              ...e,
              status: newEvidenceStatus,
              reviewerFeedback: comments,
              reviewedAt: today,
              reviewerId: reviewer.id,
              reviewerName: reviewer.name,
              reviewerRole: reviewer.headline || reviewer.role,
              verificationRefId: referenceId,
            }
          : e
      );

      // 3. Update student skill
      const updatedSkills = current.studentSkills.map((ss) => {
        if (ss.studentId === req.studentId && ss.skillId === req.skillId) {
          if (isApproved) {
            return {
              ...ss,
              verificationStatus: 'Verified' as const,
              verifiedAt: today,
              verifiedBy: reviewer.name,
              verifiedByRole: reviewer.headline || reviewer.role,
              verificationRefId: referenceId,
              lastUpdated: today,
            };
          } else if (decision === 'Revision Requested') {
            return {
              ...ss,
              verificationStatus: 'Needs improvement' as const,
              lastUpdated: today,
            };
          }
        }
        return ss;
      });

      // 4. Create permanent verification record if approved
      let updatedRecords = current.verificationRecords;
      if (isApproved && referenceId) {
        const newRecord: VerificationRecord = {
          id: `vrec-${Date.now()}`,
          referenceId,
          evidenceId: req.evidenceId,
          evidenceTitle: req.evidenceTitle,
          skillId: req.skillId,
          skillName: req.skillName,
          studentId: req.studentId,
          studentName: req.studentName,
          reviewerId: reviewer.id,
          reviewerName: reviewer.name,
          reviewerRole: reviewer.headline || reviewer.role,
          reviewerAffiliation: reviewer.university || 'Independent Verifier',
          verifiedAt: today,
          comments,
          verifiedCriteria,
        };
        updatedRecords = [newRecord, ...updatedRecords];
      }

      // 5. Notify student
      const notifTitle = isApproved ? `Skill Verified: ${req.skillName}` : `Verification Update: ${decision}`;
      const notifMsg = isApproved
        ? `${reviewer.name} verified your evidence "${req.evidenceTitle}". Reference ID: ${referenceId}`
        : `${reviewer.name} reviewed your evidence "${req.evidenceTitle}": "${comments}"`;

      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: req.studentId,
        title: notifTitle,
        message: notifMsg,
        type: 'verification',
        read: false,
        createdAt: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        link: isApproved ? `/skills` : `/evidence`,
      };

      // 6. Record audit log
      const auditLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: reviewer.id,
        actorName: reviewer.name,
        actorRole: reviewer.role,
        action: `DECISION_${decision.toUpperCase().replace(/\s+/g, '_')}`,
        targetType: 'VERIFICATION_REQUEST',
        targetId: requestId,
        details: `Reviewer ${reviewer.name} marked request ${requestId} as ${decision}. ${referenceId ? `Ref ID: ${referenceId}` : ''}`,
      };

      set({
        verificationRequests: updatedRequests,
        evidence: updatedEvidence,
        studentSkills: updatedSkills,
        verificationRecords: updatedRecords,
        notifications: [notif, ...current.notifications],
        auditLogs: [auditLog, ...current.auditLogs],
      });

      syncStorage({
        verificationRequests: updatedRequests,
        evidence: updatedEvidence,
        studentSkills: updatedSkills,
        verificationRecords: updatedRecords,
        notifications: [notif, ...current.notifications],
        auditLogs: [auditLog, ...current.auditLogs],
      });
    },

    markNotificationAsRead: (id: string) => {
      const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      set({ notifications: updated });
      syncStorage({ notifications: updated });
    },

    markAllNotificationsAsRead: () => {
      const userId = get().currentUserId;
      const updated = get().notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
      set({ notifications: updated });
      syncStorage({ notifications: updated });
    },

    resetToDefaultData: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({
        currentUserId: INITIAL_USERS[0].id,
        currentUser: INITIAL_USERS[0],
        users: INITIAL_USERS,
        skillDefinitions: SKILL_DEFINITIONS,
        studentSkills: INITIAL_STUDENT_SKILLS,
        evidence: INITIAL_EVIDENCE,
        assessments: INITIAL_ASSESSMENTS,
        assessmentSubmissions: INITIAL_ASSESSMENT_SUBMISSIONS,
        verificationRequests: INITIAL_VERIFICATION_REQUESTS,
        verificationRecords: INITIAL_VERIFICATION_RECORDS,
        notifications: INITIAL_NOTIFICATIONS,
        auditLogs: INITIAL_AUDIT_LOGS,
      });
    },
  };
});
