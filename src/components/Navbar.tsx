import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationDrawer } from './NotificationDrawer';
import {
  Compass,
  FileCheck,
  Award,
  Layers,
  Search,
  BarChart3,
  ExternalLink,
  ShieldAlert,
  ClipboardList,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useStore();
  const isStudent = currentUser.role === 'student';
  const isReviewer = currentUser.role === 'mentor' || currentUser.role === 'faculty';
  const isAdmin = currentUser.role === 'admin';

  const navLinks = [
    {
      label: 'Landing',
      path: '/',
      show: true,
    },
    {
      label: 'Dashboard',
      path: isReviewer ? '/mentor' : isAdmin ? '/admin' : '/dashboard',
      show: true,
    },
    {
      label: 'My Skills',
      path: '/skills',
      show: isStudent,
    },
    {
      label: 'Evidence Vault',
      path: '/evidence',
      show: isStudent,
    },
    {
      label: 'Assessments',
      path: '/assessments',
      show: true,
    },
    {
      label: 'Review Submissions',
      path: '/mentor',
      show: isReviewer || isAdmin,
    },
    {
      label: 'Discover Students',
      path: '/discover',
      show: true,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      show: isStudent,
    },
    {
      label: 'Standards & Admin',
      path: '/admin',
      show: isAdmin || isReviewer,
    },
  ].filter((item) => item.show);

  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-sm bg-forest flex items-center justify-center text-paper shadow-subtle group-hover:bg-forest-deep transition-colors">
                <span className="font-serif font-bold text-base tracking-tighter">SP</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-tight font-semibold text-ink leading-none">
                  SkillProof
                </span>
                <span className="text-[9px] uppercase tracking-widest text-ink-muted font-medium mt-0.5">
                  Academic Skills Passport
                </span>
              </div>
            </Link>

            {/* Main Nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'bg-paper-card text-forest border border-border shadow-xs font-semibold'
                        : 'text-ink-light hover:text-ink hover:bg-paper-subtle'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {isStudent && (
              <Link
                to={`/passport/${currentUser.id}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-forest bg-forest/10 hover:bg-forest/15 border border-forest/20 rounded-sm transition-colors"
                title="View shareable public profile"
              >
                <span>View Public Passport</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}

            <NotificationDrawer />
            <div className="h-4 w-px bg-border mx-0.5" />
            <RoleSwitcher />
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="lg:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-border-subtle scrollbar-none">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-sm transition-colors ${
                  isActive
                    ? 'bg-paper-card text-forest border border-border font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

