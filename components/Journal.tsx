import React from 'react';
import type { JournalEntry, EditableContent } from '../types';
import Card from './common/Card';

interface JournalProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Journal: React.FC<JournalProps> = ({ entries, setEntries, editableContent, setEditableContent }) => {
  return (
    <div className="flex flex-col h-full space-y-4">
        <h1 className="text-4xl font-serif text-[var(--text-header)] mb-2">{editableContent.journalTitle}</h1>
        
        <Card className="flex-grow !p-0 overflow-hidden w-full min-h-[600px]">
            <iframe 
                src="https://dark-academia-productivity-753.created.app/journal"
                title="External Journal App"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        </Card>
    </div>
  );
};

export default Journal;