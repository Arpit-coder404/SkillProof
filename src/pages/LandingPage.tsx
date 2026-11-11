import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { StatusBadge, ProficiencyMeter } from '../components/StatusBadge';
import { VerificationRecordModal } from '../components/VerificationRecordModal';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  FileCode,
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Users,
  Compass,
  CheckCheck,
  Search,
  Eye
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { users, studentSkills, evidence, verificationRecords, setCurrentUser } = useStore();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Sample student for hero preview: Arpit Pujani
  const previewStudent = users.find((u) => u.id === 'student-arpit') || users[0];
  const previewSkills = studentSkills.filter((ss) => ss.studentId === previewStudent.id).slice(0, 3);
  const previewEvidence = evidence.filter((e) => e.studentId === previewStudent.id && e.status === 'Verified').slice(0, 2);

  const selectedRecord = verificationRecords.find((r) => r.id === selectedRecordId || r.referenceId === selectedRecordId) || null;

  return (
    <div className="space-y-20 md:space-y-28">
      {/* Hero Section */}
      <section className="pt-10 md:pt-16 pb-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-light border border-sage-border rounded-sm text-forest text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>Collegiate Verification Standard for Practical Abilities</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink font-normal leading-[1.08] tracking-tight">
                Your skills deserve <br />
                <span className="italic font-serif">more than a bullet point.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-light font-normal leading-relaxed max-w-xl">
                Build a portfolio of real abilities, backed by verifiable code repositories, prototypes, rigorous faculty assessments, and accredited mentor evaluations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/dashboard"
                  onClick={() => setCurrentUser('student-arpit')}
                  className="px-6 py-3 bg-forest hover:bg-forest-deep text-paper text-sm font-medium rounded-sm transition-colors shadow-subtle flex items-center gap-2"
                >
                  <span>Build your skills passport</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/discover"
                  className="px-6 py-3 bg-paper-card border border-border hover:bg-paper text-ink text-sm font-medium rounded-sm transition-colors shadow-subtle flex items-center gap-2"
                >
                  <span>Explore verified profiles</span>
                  <Search className="w-4 h-4 text-ink-muted" />
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-ink-muted border-t border-border-subtle max-w-lg">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-forest" />
                  <span>Real project artifacts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-forest" />
                  <span>Faculty rubrics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-forest" />
                  <span>Tamper-evident records</span>
                </div>
              </div>
            </div>

            {/* Right: Authentic Passport Preview Document (Editorial style) */}
            <div className="lg:col-span-5">
              <div className="relative bg-paper-card border border-border rounded-sm shadow-editorial p-6 sm:p-7 space-y-5">
                {/* Header ribbon */}
                <div className="flex items-start justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={previewStudent.avatar}
                      alt={previewStudent.name}
                      className="w-12 h-12 rounded-sm object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-base text-ink leading-tight">
                        {previewStudent.name}
                      </h3>
                      <p className="text-[11px] text-ink-muted">{previewStudent.department}</p>
                      <p className="text-[10px] text-forest font-medium">{previewStudent.university}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-forest/10 border border-forest/20 text-forest text-[10px] font-semibold uppercase tracking-wider rounded-sm">
                      Verified Passport
                    </span>
                    <span className="block font-mono text-[9px] text-ink-muted mt-1">ID: SKP-2027-STU</span>
                  </div>
                </div>

                {/* Passport Skills snapshot */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                    Verified Competencies
                  </span>

                  {previewSkills.map((sk) => (
                    <div key={sk.id} className="p-3 bg-paper border border-border-subtle rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-ink">{sk.skillName}</span>
                        <StatusBadge status={sk.verificationStatus} refId={sk.verificationRefId} />
                      </div>
                      <ProficiencyMeter level={sk.proficiency} compact />
                    </div>
                  ))}
                </div>

                {/* Evidence Artifact Reference */}
                <div className="pt-2 border-t border-border-subtle space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                    Assessed Evidence Sample
                  </span>
                  {previewEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedRecordId(ev.verificationRefId || null)}
                      className="p-2.5 bg-forest-surface border border-forest/20 rounded-sm hover:border-forest/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-forest truncate mr-2">
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{ev.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-forest/70 group-hover:text-forest shrink-0">
                          Inspect Seal →
                        </span>
                      </div>
                      <p className="text-[10px] text-ink-muted mt-1 line-clamp-1 italic">
                        "{ev.reviewerFeedback}"
                      </p>
                      <div className="text-[9px] text-forest/80 mt-1 font-medium">
                        Verified by {ev.reviewerName}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Passport Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-ink-muted border-t border-border">
                  <span>Public URL: /passport/student-arpit</span>
                  <Link
                    to="/passport/student-arpit"
                    className="text-forest hover:text-forest-deep font-medium flex items-center gap-1"
                  >
                    <span>Full Passport</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 1: The Problem — Claim vs Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
            The Fundamental Dilemma
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
            A resume tells people what you claim. <br />
            <span className="italic">Evidence shows what you can do.</span>
          </h2>
          <p className="text-sm text-ink-light leading-relaxed">
            Every candidate lists "Python", "UI/UX Design", and "Leadership" on their CV. Without contextual proof and mentor evaluations, recruiters face an opaque wall of self-assertions.
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Resume Card */}
          <div className="bg-paper-card border border-border p-6 md:p-8 rounded-sm space-y-4 relative opacity-85">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Traditional Student Resume
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-paper text-ink-muted border border-border">
                Unverifiable Claim
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs text-ink-light bg-paper p-4 rounded-sm border border-border-subtle">
              <p className="text-ink font-bold">SKILLS & COMPETENCIES</p>
              <ul className="space-y-1.5 list-disc list-inside text-ink-muted">
                <li>Python, Distributed Systems, Concurrency, Docker, React, PostgreSQL</li>
                <li>Led cross-functional team of 6 engineers on capstone project</li>
                <li>Strong analytical problem-solving and communication abilities</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 text-xs text-ink-muted">
              <p className="flex items-center gap-2 text-ink-light">
                <span className="text-terracotta font-bold">✕</span> No way to see real commit history or asynchronous test harness.
              </p>
              <p className="flex items-center gap-2 text-ink-light">
                <span className="text-terracotta font-bold">✕</span> No faculty rubric confirming concurrency invariants or network partition survival.
              </p>
              <p className="flex items-center gap-2 text-ink-light">
                <span className="text-terracotta font-bold">✕</span> Self-declared proficiency with zero third-party evaluation.
              </p>
            </div>
          </div>

          {/* SkillProof Passport Card */}
          <div className="bg-paper-card border-2 border-forest/30 p-6 md:p-8 rounded-sm space-y-4 shadow-editorial relative">
            <div className="flex items-center justify-between pb-3 border-b border-forest/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest" />
                SkillProof Verified Passport
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-forest/10 text-forest border border-forest/20 font-bold">
                Evidence-Backed Proof
              </span>
            </div>

            <div className="space-y-3 p-4 bg-forest-surface border border-forest/20 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-ink">Python & Distributed Systems</h4>
                  <p className="text-[11px] text-ink-muted">Level: Advanced • Verified by Dr. Eleanor Vance</p>
                </div>
                <span className="font-mono text-[10px] text-forest font-semibold">SKP-2026-88192</span>
              </div>
              <div className="text-xs text-ink-light leading-relaxed">
                <strong>Assessed Artifact:</strong> Raft Consensus Protocol in Python 3.12 with asyncio test harness proving safety under 30% random message loss.
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-ink-light">
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-forest shrink-0" />
                <span>Direct inspectable link to runnable GitHub repository and automated tests.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-forest shrink-0" />
                <span>Formally graded against 4 criteria: Safety Invariant, Concurrency Rigor, Test Depth, Docs.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-forest shrink-0" />
                <span>Signed attestation by faculty lab director with documented review comments.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="bg-paper-subtle py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              The Verification Lifecycle
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
              How SkillProof transforms claims into credentials.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-paper-card p-6 border border-border rounded-sm space-y-3">
              <span className="font-serif text-2xl text-terracotta font-semibold">01</span>
              <h3 className="font-medium text-sm text-ink">Demonstrate Ability</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Build real software, design systems, conduct statistical user research, or tackle university challenges.
              </p>
            </div>

            <div className="bg-paper-card p-6 border border-border rounded-sm space-y-3">
              <span className="font-serif text-2xl text-terracotta font-semibold">02</span>
              <h3 className="font-medium text-sm text-ink">Submit Evidence</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Deposit GitHub repos, live deployments, Figma files, or technical whitepapers with explicit contribution statements.
              </p>
            </div>

            <div className="bg-paper-card p-6 border border-border rounded-sm space-y-3">
              <span className="font-serif text-2xl text-terracotta font-semibold">03</span>
              <h3 className="font-medium text-sm text-ink">Review by Mentors</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Accredited faculty and industry mentors evaluate submissions against structured academic rubrics.
              </p>
            </div>

            <div className="bg-paper-card p-6 border border-border rounded-sm space-y-3">
              <span className="font-serif text-2xl text-forest font-semibold">04</span>
              <h3 className="font-medium text-sm text-ink">Share Public Passport</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Export and share your tamper-evident skills passport with talent acquisition teams, venture funds, and admissions boards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Explore Skill Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Broad Academic Domains
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
              Structured competency frameworks.
            </h2>
          </div>
          <Link
            to="/skills"
            className="text-xs font-semibold text-forest hover:text-forest-deep flex items-center gap-1.5"
          >
            <span>Explore all defined skills</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Technology & Programming',
              description: 'Distributed systems, concurrent algorithms, full-stack microservices, cloud resilience, and automated testing.',
              skills: ['Python Programming', 'Distributed Systems', 'Full-Stack Web Dev'],
            },
            {
              title: 'Design & Creativity',
              description: 'Component token systems, cognitive usability walkthroughs, high-fidelity prototypes, and WCAG AA accessibility.',
              skills: ['Design Systems', 'User Research', 'Interaction Design'],
            },
            {
              title: 'Data & Analytics',
              description: 'Hierarchical Bayesian modeling, causal inference, geospatial visualization, and reproducible notebooks.',
              skills: ['Statistical Modeling', 'Data Visualization', 'Hypothesis Testing'],
            },
            {
              title: 'Business & Entrepreneurship',
              description: 'Unit economics modeling, product requirement specifications, TAM estimation, and venture diligence.',
              skills: ['Product Strategy', 'Financial Modeling', 'Market Discovery'],
            },
            {
              title: 'Communication',
              description: 'OpenAPI developer documentation, technical writing, scientific communication, and research synthesis.',
              skills: ['Technical Writing', 'API Specifications', 'Research Papers'],
            },
            {
              title: 'Leadership & Collaboration',
              description: 'Cross-functional engineering leadership, sprint facilitation, agile velocity, and team mentorship.',
              skills: ['Team Leadership', 'Agile Orchestration', 'Peer Mentorship'],
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className="p-6 bg-paper-card border border-border rounded-sm hover:border-forest/40 transition-colors space-y-4"
            >
              <h3 className="font-serif text-lg font-medium text-ink">{cat.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {cat.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-paper text-[11px] text-ink-light border border-border rounded-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Featured Verified Profiles */}
      <section className="bg-paper-subtle py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-forest">
                Exemplary Passports
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Featured student passports.
              </h2>
            </div>
            <Link
              to="/discover"
              className="text-xs font-semibold text-forest hover:text-forest-deep flex items-center gap-1.5"
            >
              <span>View all student profiles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {users
              .filter((u) => u.role === 'student')
              .slice(0, 3)
              .map((st) => {
                const userSkills = studentSkills.filter((s) => s.studentId === st.id);
                const verifiedCount = userSkills.filter((s) => s.verificationStatus === 'Verified').length;

                return (
                  <div
                    key={st.id}
                    className="bg-paper-card border border-border rounded-sm p-6 space-y-4 hover:shadow-editorial transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-12 h-12 rounded-sm object-cover border border-border"
                        />
                        <span className="px-2 py-0.5 bg-forest/10 text-forest text-[10px] font-semibold uppercase tracking-wider rounded-sm border border-forest/20">
                          {verifiedCount} Verified
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-base text-ink">{st.name}</h3>
                        <p className="text-[11px] text-ink-muted line-clamp-1">{st.headline}</p>
                        <p className="text-[10px] text-forest font-medium">{st.university}</p>
                      </div>

                      <p className="text-xs text-ink-light leading-relaxed line-clamp-2">
                        {st.bio}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                        <span className="text-[10px] uppercase tracking-wider text-ink-faint block">
                          Top Verified Competencies
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {userSkills.map((sk) => (
                            <span
                              key={sk.id}
                              className={`text-[10px] px-2 py-0.5 rounded-xs border ${
                                sk.verificationStatus === 'Verified'
                                  ? 'bg-forest/10 text-forest border-forest/20 font-medium'
                                  : 'bg-paper text-ink-muted border-border'
                              }`}
                            >
                              {sk.skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <Link
                        to={`/passport/${st.id}`}
                        className="text-xs font-semibold text-forest hover:text-forest-deep flex items-center gap-1"
                      >
                        <span>Inspect Passport</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[10px] font-mono text-ink-muted">Class of {st.graduationYear}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Section 5: Verification Explained — Institutional Grounding */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-paper-card border border-border rounded-sm p-8 md:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              Academic Integrity Charter
            </span>
            <h2 className="font-serif text-3xl text-ink font-normal">
              What does verification actually mean on SkillProof?
            </h2>
            <p className="text-sm text-ink-light leading-relaxed">
              SkillProof is built on a transparent, non-inflationary standard. We do not generate automatic badges or opaque algorithmic rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-ink flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-forest" />
                Evidence-Specific
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Verification confirms that an accredited reviewer inspected designated artifacts (code, prototypes, benchmarks) under explicit criteria.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-ink flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-forest" />
                Accountable Reviewers
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Every verification records the reviewer's identity, academic title, and evaluation feedback. Reviewers cannot verify their own submissions.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-ink flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-forest" />
                No Universal Claims
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                We certify that specific work was rigorously validated against rubric milestones—empowering talent partners to judge context and quality directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-forest text-paper rounded-sm p-8 md:p-14 text-center space-y-6 shadow-editorial">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal max-w-xl mx-auto leading-tight">
            Make your genuine abilities visible to the world.
          </h2>
          <p className="text-sm text-sage max-w-lg mx-auto leading-relaxed">
            Stop relying on bullet points. Build an evidence-backed skills passport that faculty verify and recruiters trust.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              onClick={() => setCurrentUser('student-arpit')}
              className="px-6 py-3 bg-paper text-forest hover:bg-paper-card text-sm font-semibold rounded-sm transition-colors shadow-subtle flex items-center gap-2"
            >
              <span>Start building your passport</span>
              <ArrowRight className="w-4 h-4 text-forest" />
            </Link>
            <Link
              to="/discover"
              className="px-6 py-3 bg-forest-deep text-paper hover:bg-forest-deep/80 text-sm font-medium rounded-sm border border-sage/20 transition-colors"
            >
              <span>Browse university talent</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal for viewing verification record if clicked */}
      <VerificationRecordModal
        record={selectedRecord}
        onClose={() => setSelectedRecordId(null)}
      />
    </div>
  );
};

