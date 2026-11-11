import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserRole } from '../types';
import { UserCheck, ChevronDown, RefreshCw, Users, Shield, Briefcase, GraduationCap } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUserId, currentUser, users, setCurrentUser, resetToDefaultData } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const students = users.filter((u) => u.role === 'student');
  const reviewers = users.filter((u) => u.role === 'mentor' || u.role === 'faculty');
  const others = users.filter((u) => u.role === 'organization' || u.role === 'admin');

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="w-3.5 h-3.5 text-forest" />;
      case 'faculty':
      case 'mentor':
        return <UserCheck className="w-3.5 h-3.5 text-terracotta" />;
      case 'organization':
        return <Briefcase className="w-3.5 h-3.5 text-ink-muted" />;
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-forest-deep" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return 'bg-forest/10 text-forest border-forest/20';
      case 'faculty':
        return 'bg-sage-light text-forest-deep border-sage-border';
      case 'mentor':
        return 'bg-terracotta/10 text-terracotta-dark border-terracotta/20';
      case 'organization':
        return 'bg-ink/5 text-ink-light border-border';
      case 'admin':
        return 'bg-paper-accent text-ink border-border-dark';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-paper border border-border hover:border-forest/40 rounded-sm text-xs transition-colors shadow-subtle"
        title="Switch demo user or role"
      >
        <span className="flex items-center gap-1.5 font-medium text-ink">
          {getRoleIcon(currentUser.role)}
          <span className="max-w-[120px] truncate">{currentUser.name}</span>
        </span>
        <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-[2px] border ${getRoleBadge(currentUser.role)}`}>
          {currentUser.role}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-80 bg-paper-card border border-border shadow-lift rounded-sm z-50 p-2 text-xs">
            <div className="px-2 py-1.5 mb-1.5 border-b border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Role & Profile Switcher</p>
                <p className="text-[11px] text-ink-muted">Test candidate, reviewer, and admin flows</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Reset all demo data back to default initial state?')) {
                    resetToDefaultData();
                    setIsOpen(false);
                  }
                }}
                className="text-ink-muted hover:text-terracotta flex items-center gap-1 text-[11px] transition-colors"
                title="Reset local storage"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Students */}
            <div className="mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint px-2 py-1 block">
                Student Candidates
              </span>
              <div className="space-y-0.5">
                {students.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setCurrentUser(st.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-sm flex items-center justify-between transition-colors ${
                      currentUserId === st.id ? 'bg-forest/10 font-semibold text-forest' : 'hover:bg-paper-subtle text-ink'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate font-medium">{st.name}</div>
                      <div className="text-[10px] text-ink-muted truncate">{st.headline}</div>
                    </div>
                    {currentUserId === st.id && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviewers */}
            <div className="mb-2 pt-2 border-t border-border-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint px-2 py-1 block">
                Mentors & Faculty (Reviewers)
              </span>
              <div className="space-y-0.5">
                {reviewers.map((rev) => (
                  <button
                    key={rev.id}
                    onClick={() => {
                      setCurrentUser(rev.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-sm flex items-center justify-between transition-colors ${
                      currentUserId === rev.id ? 'bg-forest/10 font-semibold text-forest' : 'hover:bg-paper-subtle text-ink'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate font-medium flex items-center gap-1">
                        <span>{rev.name}</span>
                        <span className="text-[9px] uppercase px-1 py-0.2 bg-paper border border-border text-ink-muted rounded">
                          {rev.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-ink-muted truncate">{rev.headline}</div>
                    </div>
                    {currentUserId === rev.id && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Organizations & Admin */}
            <div className="pt-2 border-t border-border-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint px-2 py-1 block">
                Talent & Oversight
              </span>
              <div className="space-y-0.5">
                {others.map((oth) => (
                  <button
                    key={oth.id}
                    onClick={() => {
                      setCurrentUser(oth.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-sm flex items-center justify-between transition-colors ${
                      currentUserId === oth.id ? 'bg-forest/10 font-semibold text-forest' : 'hover:bg-paper-subtle text-ink'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate font-medium">{oth.name}</div>
                      <div className="text-[10px] text-ink-muted truncate">{oth.headline}</div>
                    </div>
                    {currentUserId === oth.id && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
