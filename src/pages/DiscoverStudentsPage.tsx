import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SkillCategory, ProficiencyLevel } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  GraduationCap,
  Award,
  Layers,
  ArrowUpDown,
  BookOpen
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

export const DiscoverStudentsPage: React.FC = () => {
  const { users, studentSkills, evidence, assessmentSubmissions, skillDefinitions } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'verified_count' | 'name' | 'grad_year'>('verified_count');

  // Filter students who have public profiles
  const allStudents = users.filter((u) => u.role === 'student' && u.isPublicProfile !== false);

  const filteredStudents = allStudents.filter((st) => {
    const stSkills = studentSkills.filter((s) => s.studentId === st.id);
    const verifiedSkills = stSkills.filter((s) => s.verificationStatus === 'Verified');

    // Text search
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stSkills.some((sk) => sk.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const matchesCategory =
      selectedCategory === 'All' ||
      stSkills.some((sk) => sk.category === selectedCategory);

    // Specific skill filter
    const matchesSkill =
      selectedSkill === 'All' ||
      stSkills.some((sk) => sk.skillId === selectedSkill || sk.skillName === selectedSkill);

    // Verified only filter
    const matchesVerified = !verifiedOnly || verifiedSkills.length > 0;

    return matchesSearch && matchesCategory && matchesSkill && matchesVerified;
  });

  // Sorting
  filteredStudents.sort((a, b) => {
    if (sortBy === 'verified_count') {
      const aVerified = studentSkills.filter((s) => s.studentId === a.id && s.verificationStatus === 'Verified').length;
      const bVerified = studentSkills.filter((s) => s.studentId === b.id && s.verificationStatus === 'Verified').length;
      return bVerified - aVerified;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return (a.graduationYear || 2027) - (b.graduationYear || 2027);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-forest font-semibold flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-forest" />
            Talent Discovery Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            Discover Verified Students
          </h1>
          <p className="text-sm text-ink-light mt-1">
            Browse genuine university student capabilities backed by peer and faculty proof. Transparent sorting without algorithmic black-boxes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-muted">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 bg-paper border border-border rounded-sm text-ink text-xs focus:border-forest"
          >
            <option value="verified_count">Most Verified Skills</option>
            <option value="name">Alphabetical (Name)</option>
            <option value="grad_year">Graduation Year</option>
          </select>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-paper-card border border-border p-5 rounded-sm space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search bar (6 cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, skill, university, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-paper border border-border rounded-sm text-xs text-ink focus:outline-hidden focus:border-forest"
            />
          </div>

          {/* Specific Skill Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2 bg-paper border border-border rounded-sm text-xs text-ink focus:border-forest"
            >
              <option value="All">All Specific Skills</option>
              {skillDefinitions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Only Checkbox (3 cols) */}
          <div className="md:col-span-3 flex items-center justify-end">
            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-forest rounded"
              />
              <span>Verified Competencies Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
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

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-paper-card border border-border p-12 text-center space-y-3 rounded-sm">
            <GraduationCap className="w-8 h-8 text-ink-muted mx-auto" />
            <h3 className="font-serif text-lg font-medium text-ink">No candidates match your filters</h3>
            <p className="text-xs text-ink-muted">
              Try broadening your category or resetting the verified-only toggle.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSkill('All');
                setVerifiedOnly(false);
              }}
              className="px-3.5 py-1.5 bg-paper border border-border text-xs text-ink rounded-sm hover:bg-paper-subtle mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredStudents.map((st) => {
            const stSkills = studentSkills.filter((s) => s.studentId === st.id);
            const verifiedSkills = stSkills.filter((s) => s.verificationStatus === 'Verified');
            const stEvidence = evidence.filter((e) => e.studentId === st.id && e.status === 'Verified');

            return (
              <div
                key={st.id}
                className="bg-paper-card border border-border rounded-sm p-6 space-y-4 hover:shadow-editorial transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top user header */}
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-14 h-14 rounded-sm object-cover border border-border shrink-0"
                    />
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 bg-forest/10 border border-forest/20 text-forest text-[11px] font-bold rounded-sm">
                        {verifiedSkills.length} Verified
                      </span>
                      <span className="block font-mono text-[10px] text-ink-muted mt-1">
                        Class of {st.graduationYear}
                      </span>
                    </div>
                  </div>

                  {/* Name and Department */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-ink leading-tight">
                      {st.name}
                    </h3>
                    <p className="text-xs font-semibold text-forest mt-0.5">{st.headline}</p>
                    <p className="text-[11px] text-ink-muted mt-0.5">{st.university}</p>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-ink-light leading-relaxed line-clamp-2">
                    {st.bio}
                  </p>

                  {/* Top verified skills */}
                  <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
                      Demonstrated Competencies
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {stSkills.slice(0, 4).map((sk) => (
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
                      {stSkills.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-ink-muted">
                          +{stSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Featured project artifact */}
                  {stEvidence[0] && (
                    <div className="p-2.5 bg-paper border border-border-subtle rounded-sm text-xs space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-forest font-bold block">
                        Verified Project Artifact
                      </span>
                      <p className="font-semibold text-ink line-clamp-1">{stEvidence[0].title}</p>
                      <p className="text-[10px] text-ink-muted line-clamp-1 italic">
                        "{stEvidence[0].reviewerFeedback}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-ink-muted">
                    {stEvidence.length} {stEvidence.length === 1 ? 'artifact' : 'artifacts'}
                  </span>

                  <Link
                    to={`/passport/${st.id}`}
                    className="font-semibold text-forest hover:text-forest-deep flex items-center gap-1"
                  >
                    <span>Inspect Passport</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

