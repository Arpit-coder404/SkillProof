import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useStore } from '../store/useStore';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-sage selection:text-ink">
      <Navbar />

      {/* Demo helper banner if in reviewer mode */}
      {(currentUser.role === 'mentor' || currentUser.role === 'faculty') && (
        <div className="bg-sage-light border-b border-sage-border py-2 px-4 text-center text-xs text-forest">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
            <span>
              Reviewer Mode Active: You are logged in as <strong>{currentUser.name}</strong> ({currentUser.role}). Review pending evidence submissions in the <strong>Review Submissions</strong> tab.
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-paper-subtle border-t border-border mt-auto py-10 text-xs text-ink-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-sm bg-forest flex items-center justify-center text-paper font-serif font-bold text-xs">
                  SP
                </div>
                <span className="font-serif font-bold text-ink text-base">SkillProof</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                "Don't just list your skills. Prove them." An evidence-backed skills passport designed for university students, faculty evaluators, and talent partners.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-forest font-medium pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                <span>Collegiate Verification Standard v2.4</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-ink mb-3 text-sm">Platform</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/skills" className="hover:text-forest transition-colors">Skills Inventory</Link></li>
                <li><Link to="/evidence" className="hover:text-forest transition-colors">Evidence Vault</Link></li>
                <li><Link to="/assessments" className="hover:text-forest transition-colors">Practical Assessments</Link></li>
                <li><Link to="/discover" className="hover:text-forest transition-colors">Discover Students</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-ink mb-3 text-sm">Governance</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/admin" className="hover:text-forest transition-colors">Academic Oversight Board</Link></li>
                <li><span className="text-ink-faint">Evaluation Rubrics & Standards</span></li>
                <li><span className="text-ink-faint">Anti-Inflation Verification Policy</span></li>
                <li><span className="text-ink-faint">Tamper-Proof Audit Logging</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-ink mb-3 text-sm">Demo Scenario</h4>
              <p className="text-[11px] text-ink-muted leading-relaxed mb-2">
                Test the complete flow: switch to Arpit → view pending requests → switch to Prof. David Chen → inspect & verify evidence → observe the public passport update!
              </p>
              <div className="p-2 bg-paper border border-border rounded-sm text-[10px] text-ink-light">
                <strong>Storage:</strong> LocalStorage Reactive Sync active. All edits and verifications persist.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 SkillProof Academic Consortium. All verified records cryptographically stamped.
            </div>
            <div className="flex items-center gap-4 text-ink-muted">
              <span>Editorial Design System</span>
              <span>•</span>
              <span>No AI-Generated Placeholders</span>
              <span>•</span>
              <span>WCAG AA Accessible</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
