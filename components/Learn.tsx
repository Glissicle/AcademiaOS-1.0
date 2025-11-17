import React from 'react';
import Card from './common/Card';
import type { EditableContent } from '../types';
import InlineEditable from './common/InlineEditable';

// Simple SVG icons for visual flair
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const PerplexityIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 6.25h2.5v7.5h-2.5zm0 10h2.5v2.5h-2.5z"/></svg>;
const GoogleIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400 fill-current"><path d="M12.0001 1.73335C10.589 1.73335 9.20088 2.14623 7.96675 2.92623L12.0001 8.94002L16.0335 2.92623C14.7993 2.14623 13.4112 1.73335 12.0001 1.73335ZM4.6433 4.6433C3.39414 5.89246 2.5322 7.4533 2.14623 9.16669H8.94002L4.6433 4.6433ZM1.73335 12.0001C1.73335 13.4112 2.14623 14.7993 2.92623 16.0335L8.94002 12.0001L2.92623 7.96675C2.14623 9.20088 1.73335 10.589 1.73335 12.0001ZM12.0001 22.2667C13.4112 22.2667 14.7993 21.8538 16.0335 21.0738L12.0001 15.06L7.96675 21.0738C9.20088 21.8538 10.589 22.2667 12.0001 22.2667ZM19.3568 19.3568C20.6059 18.1076 21.4679 16.5468 21.8538 14.8334H15.06L19.3568 19.3568ZM22.2667 12.0001C22.2667 10.589 21.8538 9.20088 21.0738 7.96675L15.06 12.0001L21.0738 16.0335C21.8538 14.7993 22.2667 13.4112 22.2667 12.0001Z"/></svg>;
const OpenAiIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400 fill-current"><path d="m11.12 1.05-.907 1.037c-3.084 3.52-3.084 9.213 0 12.733l.907 1.037c.36.41.87.65 1.41.65s1.05-.24 1.41-.65l.907-1.037c3.084-3.52 3.084-9.213 0-12.733l-.907-1.037c-.36-.41-.87-.65-1.41-.65s-1.05.24-1.41.65Zm-5.01 5.43c-1.39 1.58-2.18 3.54-2.18 5.62 0 2.08.79 4.04 2.18 5.62l.907 1.037c.36.41.87.65 1.41.65s1.05-.24 1.41-.65l.907-1.037c1.39-1.58 2.18-3.54 2.18-5.62 0-2.08-.79-4.04-2.18-5.62l-.907-1.037c-.36-.41-.87-.65-1.41-.65s-1.05.24-1.41-.65ZM17.89 6.48l-.907 1.037c1.39 1.58 2.18 3.54 2.18 5.62s-.79 4.04-2.18 5.62l.907 1.037c.36.41.87.65 1.41.65s1.05-.24 1.41-.65l.907-1.037c3.084-3.52 3.084-9.213 0-12.733l-.907-1.037c-.36-.41-.87-.65-1.41-.65s-1.05.24-1.41-.65Z"/></svg>;


const SITES = [
  { 
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    icon: <PerplexityIcon />,
    description: "An AI-powered search engine that gives direct answers to questions with cited sources. Great for research."
  },
  { 
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com/prompts/new_chat',
    icon: <GoogleIcon />,
    description: "A professional web-based tool for prototyping and running prompts with Google's latest Gemini models."
  },
  { 
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    icon: <OpenAiIcon />,
    description: "The classic conversational AI from OpenAI. Excellent for creative writing, brainstorming, and general queries."
  },
];

interface LearnProps {
    editableContent: EditableContent;
    setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const LaunchCard: React.FC<{ site: typeof SITES[0] }> = ({ site }) => (
    <Card className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-3">
            {site.icon}
            <h2 className="text-xl font-serif text-[var(--text-header)]">{site.name}</h2>
        </div>
        <p className="text-[var(--text-secondary)] flex-grow mb-6">{site.description}</p>
        <a 
            href={site.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-auto bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors text-center flex items-center justify-center"
        >
            Launch {site.name} <ExternalLinkIcon />
        </a>
    </Card>
);

const Learn: React.FC<LearnProps> = ({ editableContent, setEditableContent }) => {
    const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
        setEditableContent(prev => ({ ...prev, [key]: newValue }));
    };

    return (
        <div className="space-y-6">
            <InlineEditable as="h1" initialValue={editableContent.learnTitle} onSave={handleContentSave('learnTitle')} className="text-4xl font-serif text-[var(--text-header)] mb-2" />
            
            <p className="text-[var(--text-secondary)] max-w-3xl border-l-4 border-[var(--border-accent)] pl-4">
                These powerful AI tools can't be embedded directly due to their own security policies. Use this launchpad to open them in a new tab for your research and learning.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {SITES.map(site => (
                    <LaunchCard key={site.name} site={site} />
                ))}
            </div>
        </div>
    );
};

export default Learn;
