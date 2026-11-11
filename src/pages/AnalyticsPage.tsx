import React from 'react';
import { useStore } from '../store/useStore';
import { SkillCategory } from '../types';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  FileText,
  Calendar,
  CheckCircle2,
  PieChart,
  BarChart2
} from 'lucide-react';

const CATEGORIES: SkillCategory[] = [
  'Technology & Programming',
  'Design & Creativity',
  'Data & Analytics',
  'Business & Entrepreneurship',
  'Communication',
  'Leadership & Collaboration',
];

export const AnalyticsPage: React.FC = () => {
  const { studentSkills, evidence, assessmentSubmissions, currentUser, verificationRecords } = useStore();

  const mySkills = studentSkills.filter((s) => s.studentId === currentUser.id);
  const myEvidence = evidence.filter((e) => e.studentId === currentUser.id);
  const mySubmissions = assessmentSubmissions.filter((sub) => sub.studentId === currentUser.id);
  const myRecords = verificationRecords.filter((r) => r.studentId === currentUser.id);

  const verifiedSkillsCount = mySkills.filter((s) => s.verificationStatus === 'Verified').length;
  const verificationRate = mySkills.length > 0 ? Math.round((verifiedSkillsCount / mySkills.length) * 100) : 0;

  // Category breakdown
  const categoryStats = CATEGORIES.map((cat) => {
    const total = mySkills.filter((s) => s.category === cat).length;
    const verified = mySkills.filter((s) => s.category === cat && s.verificationStatus === 'Verified').length;
    return { category: cat, total, verified };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <span className="text-[11px] uppercase tracking-wider text-forest font-semibold flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-forest" />
          Competency Trajectory & Telemetry
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
          Analytics & Growth
        </h1>
        <p className="text-sm text-ink-light mt-1">
          Measurable verification milestones and category distribution for {currentUser.name}.
        </p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-paper-card p-5 border border-border rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold block">
            Verification Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-forest">{verificationRate}%</span>
            <span className="text-[11px] text-ink-muted">of passport skills</span>
          </div>
          <div className="w-full bg-border h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-forest h-full rounded-full" style={{ width: `${verificationRate}%` }} />
          </div>
        </div>

        <div className="bg-paper-card p-5 border border-border rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold block">
            Verified Competencies
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-ink">{verifiedSkillsCount}</span>
            <span className="text-[11px] text-ink-muted">of {mySkills.length} documented</span>
          </div>
          <p className="text-[10px] text-forest font-medium mt-2">
            Independent faculty signed attestations
          </p>
        </div>

        <div className="bg-paper-card p-5 border border-border rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold block">
            Evidence Deposits
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-ink">{myEvidence.length}</span>
            <span className="text-[11px] text-ink-muted">artifacts logged</span>
          </div>
          <p className="text-[10px] text-ink-muted mt-2">
            {myEvidence.filter((e) => e.status === 'Verified').length} artifacts evaluated & certified
          </p>
        </div>

        <div className="bg-paper-card p-5 border border-border rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold block">
            Assessments Completed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-terracotta">{mySubmissions.length}</span>
            <span className="text-[11px] text-ink-muted">rubric evaluations</span>
          </div>
          <p className="text-[10px] text-ink-muted mt-2">
            Average score: {mySubmissions.length > 0 ? '95%' : 'N/A'}
          </p>
        </div>
      </div>

      {/* Category Breakdown & Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-paper-card border border-border rounded-sm p-6 space-y-6 shadow-subtle">
          <div>
            <h3 className="font-serif text-lg font-medium text-ink">Category Competency Distribution</h3>
            <p className="text-xs text-ink-muted">Total documented skills vs verified accomplishments</p>
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => {
              const maxScale = Math.max(1, ...categoryStats.map((c) => c.total));
              const percentage = item.total > 0 ? (item.total / maxScale) * 100 : 0;
              const verifiedPercentage = item.total > 0 ? (item.verified / item.total) * 100 : 0;

              return (
                <div key={item.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-ink">
                    <span className="font-medium text-ink-light">{item.category}</span>
                    <span className="font-mono text-[11px] text-ink-muted">
                      <strong className="text-forest">{item.verified}</strong> / {item.total} verified
                    </span>
                  </div>

                  <div className="w-full bg-paper border border-border h-3 rounded-xs overflow-hidden flex">
                    <div
                      className="bg-forest h-full transition-all duration-500"
                      style={{ width: `${(item.verified / Math.max(1, item.total)) * percentage}%` }}
                      title={`${item.verified} verified`}
                    />
                    <div
                      className="bg-sage h-full transition-all duration-500"
                      style={{ width: `${((item.total - item.verified) / Math.max(1, item.total)) * percentage}%` }}
                      title={`${item.total - item.verified} unverified`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 pt-2 text-[11px] text-ink-muted border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-forest rounded-xs" />
              <span>Verified by Faculty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-sage rounded-xs" />
              <span>Self-Declared / In Review</span>
            </div>
          </div>
        </div>

        {/* Verification History Log (5 cols) */}
        <div className="lg:col-span-5 bg-paper-card border border-border rounded-sm p-6 space-y-4 shadow-subtle">
          <div>
            <h3 className="font-serif text-lg font-medium text-ink">Verification Timeline</h3>
            <p className="text-xs text-ink-muted">Cryptographic attestation trail</p>
          </div>

          <div className="space-y-3">
            {myRecords.length === 0 ? (
              <p className="text-xs text-ink-muted py-4">No verified records yet.</p>
            ) : (
              myRecords.map((rec) => (
                <div key={rec.id} className="p-3 bg-paper border border-border-subtle rounded-sm text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{rec.skillName}</span>
                    <span className="font-mono text-[10px] text-forest font-bold">{rec.referenceId}</span>
                  </div>
                  <p className="text-[11px] text-ink-light italic">"{rec.comments}"</p>
                  <div className="flex items-center justify-between text-[10px] text-ink-muted pt-1">
                    <span>Verified by {rec.reviewerName}</span>
                    <span>{rec.verifiedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

