import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ProficiencyLevel } from '../types';
import { X, Award, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSkillModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { skillDefinitions, addStudentSkill, studentSkills, currentUserId } = useStore();

  const userSkillIds = studentSkills
    .filter((s) => s.studentId === currentUserId)
    .map((s) => s.skillId);

  const availableSkills = skillDefinitions.filter((s) => !userSkillIds.includes(s.id));

  const [selectedSkillId, setSelectedSkillId] = useState<string>(availableSkills[0]?.id || '');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    addStudentSkill(selectedSkillId, proficiency, notes);
    onClose();
  };

  const selectedDef = skillDefinitions.find((s) => s.id === selectedSkillId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-paper-card border border-border rounded-sm shadow-editorial overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-paper-subtle border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-forest" />
            <h3 className="font-serif text-lg font-medium text-ink">Add Skill to Passport</h3>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div>
            <label className="block font-medium text-ink mb-1.5 uppercase text-[11px] tracking-wider">
              Select Competency
            </label>
            {availableSkills.length > 0 ? (
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
                required
              >
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-paper border border-border text-ink-muted text-xs">
                You have already added all catalog skills to your passport!
              </div>
            )}
            {selectedDef && (
              <p className="mt-2 text-[11px] text-ink-muted leading-relaxed">
                {selectedDef.description}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-ink mb-1.5 uppercase text-[11px] tracking-wider">
              Self-Declared Starting Proficiency
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['Beginner', 'Developing', 'Intermediate', 'Advanced', 'Expert'] as ProficiencyLevel[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setProficiency(level)}
                  className={`p-2 text-center rounded-sm border transition-colors ${
                    proficiency === level
                      ? 'bg-forest text-paper border-forest font-semibold'
                      : 'bg-paper text-ink border-border hover:bg-paper-subtle'
                  }`}
                >
                  <span className="block text-[10px] leading-tight">{level}</span>
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-ink-faint">
              * Note: Self-declared skills remain marked as "Self-declared" until supported by verified evidence.
            </p>
          </div>

          <div>
            <label className="block font-medium text-ink mb-1.5 uppercase text-[11px] tracking-wider">
              Context & Relevance (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Used extensively for concurrent socket simulations in CS244..."
              rows={3}
              className="w-full p-2.5 bg-paper border border-border rounded-sm text-ink text-xs focus:outline-hidden focus:border-forest"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-paper border border-border text-ink rounded-sm hover:bg-paper-subtle font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSkillId}
              className="px-4 py-2 bg-forest text-paper hover:bg-forest-deep rounded-sm font-medium text-xs shadow-subtle disabled:opacity-50"
            >
              Add to Passport
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

