import React, { useState, useEffect } from 'react';
import { generateLearningContent, generateCurrentEventsContent } from '../services/geminiService';
import Card from './common/Card';
import type { EditableContent } from '../types';
import InlineEditable from './common/InlineEditable';

interface LearnResult {
  articles: { title: string; link: string; snippet: string; }[];
  videos: { title: string; link: string; description: string; }[];
}

interface LearnProps {
    editableContent: EditableContent;
    setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const YoutubeIcon = () => (
    <svg xmlns="http://www.w.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.73,18.78 17.93,18.84C17.13,18.91 16.44,18.94 15.84,18.94L15,19C12.81,19 11.2,18.84 10.17,18.56C9.27,18.31 8.69,17.73 8.44,16.83C8.31,16.36 8.22,15.73 8.16,14.93C8.09,14.13 8.06,13.44 8.06,12.84L8,12C8,9.81 8.16,8.2 8.44,7.17C8.69,6.27 9.27,5.69 10.17,5.44C10.64,5.31 11.27,5.22 12.07,5.16C12.87,5.09 13.56,5.06 14.16,5.06L15,5C17.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
    </svg>
);

const ArticleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-[var(--accent-secondary)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 22.25H4a2 2 0 0 1-2-2V3.75a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16.5a2 2 0 0 1-2 2zM8.25 8.625a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25z" />
    </svg>
);

const LoadingSpinner: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-center items-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-secondary)]"></div>
      <p className="ml-4 text-[var(--text-secondary)]">{text}</p>
    </div>
);

const ResultsDisplay: React.FC<LearnResult> = ({ articles, videos }) => (
    <div className="space-y-8">
        {(articles?.length === 0 && videos?.length === 0) && (
            <Card>
                <p className="text-center text-[var(--text-muted)] p-4">No results found for this topic.</p>
            </Card>
        )}
        {articles?.length > 0 && (
            <div>
                <h3 className="text-2xl font-serif text-[var(--text-header)] mb-4">Recommended Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article, i) => (
                        <a href={article.link} target="_blank" rel="noopener noreferrer" key={`article-${i}`}>
                            <Card className="h-full flex flex-col hover:border-[var(--border-accent)]">
                                <h4 className="font-bold text-[var(--text-primary)]"><ArticleIcon/>{article.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mt-2 flex-grow">{article.snippet}</p>
                            </Card>
                        </a>
                    ))}
                </div>
            </div>
        )}
        {videos?.length > 0 && (
            <div>
                <h3 className="text-2xl font-serif text-[var(--text-header)] mb-4">Recommended Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video, i) => (
                       <a href={video.link} target="_blank" rel="noopener noreferrer" key={`video-${i}`}>
                            <Card className="h-full flex flex-col hover:border-[var(--border-accent)]">
                                <h4 className="font-bold text-[var(--text-primary)]"><YoutubeIcon/>{video.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mt-2 flex-grow">{video.description}</p>
                            </Card>
                        </a>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const Learn: React.FC<LearnProps> = ({ editableContent, setEditableContent }) => {
  const [topic, setTopic] = useState('');
  
  // State for search results
  const [searchResults, setSearchResults] = useState<LearnResult | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // State for default current events
  const [currentEvents, setCurrentEvents] = useState<LearnResult | null>(null);
  const [isCurrentEventsLoading, setIsCurrentEventsLoading] = useState(true);
  const [currentEventsError, setCurrentEventsError] = useState('');
  
  useEffect(() => {
    const fetchCurrentEvents = async () => {
        setIsCurrentEventsLoading(true);
        setCurrentEventsError('');
        try {
            const response = await generateCurrentEventsContent();
            setCurrentEvents(response);
        } catch (err: any) {
            setCurrentEventsError(err.message || 'An error occurred while fetching current events.');
        } finally {
            setIsCurrentEventsLoading(false);
        }
    };
    fetchCurrentEvents();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSearchLoading(true);
    setSearchError('');
    setSearchResults(null);
    
    try {
      const response = await generateLearningContent(topic);
      setSearchResults(response);
    } catch (err: any) {
      setSearchError(err.message || 'An error occurred while generating content.');
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };
  
  return (
    <div className="space-y-8">
      <InlineEditable as="h1" initialValue={editableContent.learnTitle} onSave={handleContentSave('learnTitle')} className="text-4xl font-serif text-[var(--text-header)] mb-6" />
      <Card className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to learn about today?"
            className="flex-grow bg-[var(--bg-interactive)]/50 p-3 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
            disabled={isSearchLoading}
          />
          <button
            type="submit"
            className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-[var(--bg-interactive)]"
            disabled={isSearchLoading}
          >
            {isSearchLoading ? 'Researching...' : 'Search'}
          </button>
        </form>
      </Card>
      
      {isSearchLoading && <LoadingSpinner text="Finding the best resources for you..." />}
      {searchError && <Card><p className="text-[var(--danger-primary)] p-4 text-center">{searchError}</p></Card>}
      
      {searchResults && (
        <div className="space-y-4">
            <h2 className="text-3xl font-serif text-[var(--text-header)]">Search Results for "{topic}"</h2>
            <ResultsDisplay articles={searchResults.articles} videos={searchResults.videos} />
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h2 className="text-3xl font-serif text-[var(--text-header)] border-t border-[var(--border-primary)] pt-8">Explore Current Events</h2>
        {isCurrentEventsLoading && <LoadingSpinner text="Loading current events..." />}
        {currentEventsError && <Card><p className="text-[var(--danger-primary)] p-4 text-center">{currentEventsError}</p></Card>}
        {currentEvents && <ResultsDisplay articles={currentEvents.articles} videos={currentEvents.videos} />}
      </div>
    </div>
  );
};

export default Learn;
