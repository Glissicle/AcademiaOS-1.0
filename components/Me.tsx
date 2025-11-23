import React, { useState, useEffect, useMemo } from 'react';
import type { MeData, EditableContent } from '../types';
import Card from './common/Card';
import ConfirmationModal from './common/ConfirmationModal';

interface MeProps {
  meData: MeData;
  setMeData: React.Dispatch<React.SetStateAction<MeData>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

// Extracted Section component to prevent re-creation on render
interface SectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const Section: React.FC<SectionProps> = ({ title, value, onChange, placeholder }) => (
  <Card>
    <h2 className="text-2xl font-serif text-[var(--text-header)] mb-4">{title}</h2>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-40 bg-[var(--bg-interactive-alpha)] p-3 rounded-md text-[var(--text-primary)] resize-y border border-[var(--border-primary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
      placeholder={placeholder}
    />
  </Card>
);

const Me: React.FC<MeProps> = ({ meData, setMeData, editableContent, setEditableContent }) => {
  const [localData, setLocalData] = useState<MeData>(meData);
  const [isClearModalOpen, setClearModalOpen] = useState(false);
  
  const isDirty = useMemo(() => JSON.stringify(localData) !== JSON.stringify(meData), [localData, meData]);

  useEffect(() => {
    // If external data changes (e.g., from another tab), update local state
    setLocalData(meData);
  }, [meData]);

  const handleInputChange = (field: keyof MeData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    setMeData(localData);
  };
  
  const handleDiscard = () => {
    setLocalData(meData);
  };

  const handleClearConfirm = () => {
    const clearedData = { values: '', vision: '', strengths: '', achievements: '' };
    setLocalData(clearedData);
    setMeData(clearedData);
  };

  return (
    <>
    <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearConfirm}
        title="Clear All Sections"
        message="Are you sure you want to clear all of your personal reflections? This action will be saved immediately and cannot be undone."
        confirmText="Clear All"
      />
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-4xl font-serif text-[var(--text-header)] mb-2">{editableContent.meTitle}</h1>
            <p className="text-[var(--text-secondary)]">{editableContent.meSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleDiscard} disabled={!isDirty} className="bg-[var(--bg-interactive)] hover:bg-[var(--border-secondary)] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Discard</button>
          <button onClick={handleSave} disabled={!isDirty} className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section 
            title={editableContent.meValuesTitle} 
            value={localData.values} 
            onChange={(val) => handleInputChange('values', val)} 
            placeholder="What principles guide you? (e.g., Curiosity, Integrity, Kindness...)" 
        />
        <Section 
            title={editableContent.meVisionTitle} 
            value={localData.vision} 
            onChange={(val) => handleInputChange('vision', val)} 
            placeholder="What is your long-term vision for yourself? What impact do you want to make?" 
        />
        <Section 
            title={editableContent.meStrengthsTitle} 
            value={localData.strengths} 
            onChange={(val) => handleInputChange('strengths', val)} 
            placeholder="What are you great at? Where do you have room to grow?" 
        />
        <Section 
            title={editableContent.meAchievementsTitle} 
            value={localData.achievements} 
            onChange={(val) => handleInputChange('achievements', val)} 
            placeholder="What are you proud of? Big or small, log your wins here." 
        />
      </div>
      
       <div className="pt-4 mt-4 border-t border-[var(--border-primary)]">
            <button
                onClick={() => setClearModalOpen(true)}
                className="text-[var(--danger-primary)] hover:underline"
            >
                Clear All Sections
            </button>
        </div>
    </div>
    </>
  );
};

export default Me;