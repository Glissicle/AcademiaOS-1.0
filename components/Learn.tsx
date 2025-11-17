import React, { useState } from 'react';
import Card from './common/Card';
import type { EditableContent } from '../types';
import InlineEditable from './common/InlineEditable';

type AiSite = 'perplexity' | 'google' | 'openai';

const SITES: Record<AiSite, { name: string; url: string }> = {
  perplexity: { name: 'Perplexity', url: 'https://www.perplexity.ai/' },
  google: { name: 'Google AI Studio', url: 'https://aistudio.google.com/prompts/new_chat' },
  openai: { name: 'ChatGPT', url: 'https://chat.openai.com/' },
};

interface LearnProps {
    editableContent: EditableContent;
    setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Learn: React.FC<LearnProps> = ({ editableContent, setEditableContent }) => {
    const [activeSite, setActiveSite] = useState<AiSite>('google');

    const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
        setEditableContent(prev => ({ ...prev, [key]: newValue }));
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <InlineEditable as="h1" initialValue={editableContent.learnTitle} onSave={handleContentSave('learnTitle')} className="text-4xl font-serif text-[var(--text-header)] mb-2" />
            
            <div className="flex border-b border-[var(--border-primary)]">
                {Object.keys(SITES).map((key) => {
                    const siteKey = key as AiSite;
                    return (
                        <button 
                            key={siteKey} 
                            onClick={() => setActiveSite(siteKey)}
                            className={`py-2 px-4 font-medium transition-colors ${
                              activeSite === siteKey
                                ? 'border-b-2 border-[var(--accent-secondary)] text-[var(--accent-secondary-hover)]' 
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {SITES[siteKey].name}
                        </button>
                    );
                })}
            </div>
            
            <Card className="flex-grow flex flex-col p-2 sm:p-3">
                <iframe
                    key={activeSite}
                    src={SITES[activeSite].url}
                    className="w-full h-full border-0 rounded-md bg-white" // Added bg-white for better loading appearance
                    title={SITES[activeSite].name}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups" // Added sandbox for security
                />
            </Card>
            <div className="text-center text-sm text-[var(--text-muted)] pb-2">
                Content not loading?{' '}
                <a href={SITES[activeSite].url} target="_blank" rel="noopener noreferrer" className="underline text-[var(--accent-secondary)] hover:text-[var(--accent-secondary-hover)] transition-colors">
                    Open {SITES[activeSite].name} in a new tab.
                </a>
            </div>
        </div>
    );
};

export default Learn;