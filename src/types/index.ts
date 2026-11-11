export type UserRole = 'student' | 'mentor' | 'faculty' | 'organization' | 'admin';

export type SkillCategory = 
  | 'Technology & Programming'
  | 'Design & Creativity'
  | 'Data & Analytics'
  | 'Business & Entrepreneurship'
  | 'Communication'
  | 'Leadership & Collaboration';

export type ProficiencyLevel = 
  | 'Beginner'
  | 'Developing'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert';

export type VerificationStatus = 
  | 'Self-declared'
  | 'Evidence submitted'
  | 'Under review'
  | 'Verified'
  | 'Needs improvement';

export type EvidenceType = 
  | 'GitHub Repository'
  | 'Live Project'
  | 'Figma Prototype'
  | 'Technical Document / PDF'
  | 'Design / Code Image'
  | 'Certification'
  | 'Video Walkthrough'
  | 'Competition Award'
  | 'Case Study'
  | 'Faculty Endorsement';

export type EvidenceStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under review'
  | 'Verified'
  | 'Needs revision'
  | 'Declined';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  headline: string;
  university: string;
  department: string;
  graduationYear?: number;
  bio: string;
  location?: string;
  isPublicProfile?: boolean;
  publicSkillsOnly?: boolean;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  suggestedEvidence: string[];
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  verificationStatus: VerificationStatus;
  dateAdded: string;
  lastUpdated: string;
  notes?: string;
  evidenceCount: number;
  verifiedAt?: string;
  verifiedBy?: string;
  verifiedByRole?: string;
  verificationRefId?: string;
}

export interface EvidenceItem {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  title: string;
  type: EvidenceType;
  contribution: string; // What the student specifically built/contributed
  url?: string;
  fileName?: string;
  fileSize?: string;
  thumbnailUrl?: string;
  dateCompleted: string;
  dateSubmitted: string;
  status: EvidenceStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewerRole?: string;
  reviewerFeedback?: string;
  reviewedAt?: string;
  verificationRefId?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface Assessment {
  id: string;
  title: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  creatorId: string;
  creatorName: string;
  creatorRole: string;
  description: string;
  instructions: string;
  requirements: string[];
  rubric: RubricCriterion[];
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  deadline?: string;
  starterKitUrl?: string;
  submissionsCount?: number;
}

export interface RubricScoreItem {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  status: 'Draft' | 'Submitted' | 'Evaluated';
  projectUrl: string;
  notes: string;
  evaluatorId?: string;
  evaluatorName?: string;
  evaluatedAt?: string;
  overallFeedback?: string;
  rubricScores?: RubricScoreItem[];
  totalScore?: number;
  maxTotalScore?: number;
}

export interface VerificationRequest {
  id: string;
  studentId: string;
  studentName: string;
  evidenceId: string;
  evidenceTitle: string;
  skillId: string;
  skillName: string;
  reviewerId: string;
  reviewerName: string;
  requestDate: string;
  status: 'Pending' | 'In Review' | 'Verified' | 'Revision Requested' | 'Declined';
  studentNote?: string;
  completedAt?: string;
  decisionNote?: string;
}

export interface VerificationRecord {
  id: string;
  referenceId: string; // e.g. SKP-2026-9814
  evidenceId: string;
  evidenceTitle: string;
  skillId: string;
  skillName: string;
  studentId: string;
  studentName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerAffiliation: string;
  verifiedAt: string;
  comments: string;
  verifiedCriteria: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'verification' | 'assessment' | 'info' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}

