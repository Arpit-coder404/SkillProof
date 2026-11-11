import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserRole } from '../types';
import {
  Shield,
  Users,
  Award,
  FileCheck,
  History,
  Lock,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const {
    users,
    skillDefinitions,
    assessments,
    verificationRecords,
    auditLogs,
    resetToDefaultData,
    updateUserProfile,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'users' | 'skills' | 'audit' | 'assessments'>('users');
  const [searchUser, setSearchUser] = useState('');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-forest font-semibold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-forest" />
            Consortium Standards & Academic Governance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink mt-1">
            Academic Oversight Board
          </h1>
          <p className="text-sm text-ink-light mt-1">
            Governance dashboard for accredited reviewer credentials, rubric standards, and tamper-evident audit trails.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset entire system state back to default seed data?')) {
              resetToDefaultData();
            }
          }}
          className="px-3.5 py-2 bg-paper border border-border hover:bg-terracotta/10 text-terracotta-dark text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Database</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-paper border border-border rounded-sm p-1 text-xs max-w-md">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-1.5 rounded-xs font-medium transition-colors ${
            activeTab === 'users' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-1.5 rounded-xs font-medium transition-colors ${
            activeTab === 'skills' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Skills ({skillDefinitions.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex-1 py-1.5 rounded-xs font-medium transition-colors ${
            activeTab === 'assessments' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-1.5 rounded-xs font-medium transition-colors ${
            activeTab === 'audit' ? 'bg-forest text-paper shadow-xs' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-paper-card border border-border rounded-sm p-6 space-y-4 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <h3 className="font-serif text-lg font-medium text-ink">User Registry & Permissions</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or role..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-paper border border-border rounded-sm text-xs text-ink"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase font-bold text-ink-muted bg-paper-subtle">
                  <th className="p-3">User</th>
                  <th className="p-3">Academic Affiliation</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Visibility</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-paper-subtle/60 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-sm object-cover" />
                        <div>
                          <p className="font-semibold text-ink">{u.name}</p>
                          <p className="text-[10px] text-ink-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-ink font-medium">{u.university}</p>
                      <p className="text-[10px] text-ink-muted">{u.department}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 uppercase font-mono text-[10px] font-semibold bg-paper border border-border rounded-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-forest font-medium text-[11px]">
                        {u.isPublicProfile !== false ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role === 'student' && (
                        <button
                          onClick={() => {
                            updateUserProfile(u.id, { role: 'mentor' });
                            alert(`${u.name} has been promoted to accredited Mentor role.`);
                          }}
                          className="px-2 py-1 bg-paper border border-border hover:bg-forest/10 hover:text-forest text-[10px] rounded-xs font-medium"
                        >
                          Promote to Mentor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Skills Definitions */}
      {activeTab === 'skills' && (
        <div className="bg-paper-card border border-border rounded-sm p-6 space-y-4 shadow-subtle">
          <h3 className="font-serif text-lg font-medium text-ink pb-3 border-b border-border">
            Catalogued Skill Competency Standards ({skillDefinitions.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillDefinitions.map((sk) => (
              <div key={sk.id} className="p-4 bg-paper border border-border rounded-sm space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-forest tracking-wider block">
                  {sk.category}
                </span>
                <h4 className="font-serif font-bold text-base text-ink">{sk.name}</h4>
                <p className="text-ink-muted leading-relaxed text-[11px]">{sk.description}</p>
                <div className="pt-2 border-t border-border-subtle flex flex-wrap gap-1">
                  {sk.suggestedEvidence.map((ev, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-paper-card border border-border text-ink-light rounded-xs">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Assessments */}
      {activeTab === 'assessments' && (
        <div className="bg-paper-card border border-border rounded-sm p-6 space-y-4 shadow-subtle">
          <h3 className="font-serif text-lg font-medium text-ink pb-3 border-b border-border">
            Published Faculty Assessments ({assessments.length})
          </h3>

          <div className="space-y-3 text-xs">
            {assessments.map((asm) => (
              <div key={asm.id} className="p-4 bg-paper border border-border rounded-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest">{asm.category}</span>
                    <h4 className="font-serif font-bold text-base text-ink">{asm.title}</h4>
                    <p className="text-[11px] text-ink-muted">Creator: {asm.creatorName} ({asm.creatorRole})</p>
                  </div>
                  <span className="font-mono text-[10px] text-ink-muted">Deadline: {asm.deadline}</span>
                </div>
                <p className="text-ink-light text-[11px]">{asm.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Tamper-Evident Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-paper-card border border-border rounded-sm p-6 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-serif text-lg font-medium text-ink">Consortium Verification Audit Trail</h3>
              <p className="text-xs text-ink-muted">Append-only log of all attestation decisions and requests</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-forest font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Immutable Chain</span>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-paper border border-border-subtle rounded-sm text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-forest font-semibold">[{log.action}]</span>
                  <span className="text-ink-muted">{log.timestamp}</span>
                </div>
                <p className="text-ink text-[11px] font-sans">
                  <strong>{log.actorName}</strong> ({log.actorRole}): {log.details}
                </p>
                <div className="text-[10px] text-ink-faint">
                  Target: {log.targetType} #{log.targetId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

