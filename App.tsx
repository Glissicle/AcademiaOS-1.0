import React, { useState, useEffect } from 'react';
import type { View, Theme, CustomThemeColors, EditableContent, Todo, Goal, Exam, Habit, Writing, Book, JournalEntry, MeData, PlaylistItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Study from './components/Study';
import WritingComponent from './components/Writing';
import Books from './components/Books';
import Learn from './components/Learn';
import Pomodoro from './components/Pomodoro';
import Journal from './components/Journal';
import Me from './components/Me';
import Music from './components/Music';

const DEFAULT_CUSTOM_THEME: CustomThemeColors = {
  '--bg-primary': '#1c1917',
  '--bg-secondary': '#292524',
  '--bg-interactive': '#44403c',
  '--border-primary': '#44403c',
  '--border-secondary': '#57534e',
  '--text-primary': '#e7e5e4',
  '--text-secondary': '#a8a29e',
  '--text-muted': '#78716c',
  '--text-header': '#fde68a',
  '--accent-primary': '#d97706',
  '--accent-primary-hover': '#b45309',
  '--accent-secondary': '#f59e0b',
};

const DEFAULT_EDITABLE_CONTENT: EditableContent = {
    appTitle: 'AcademiaOS',
    sidebarSubtitle: 'Your Personal Hub',
    dashboardGreeting: "Here's your snapshot for today.",
    dashboardQuickActionsTitle: 'Quick Actions',
    dashboardDeadlinesTitle: 'Upcoming Deadlines',
    dashboardFocusTitle: "Today's Focus",
    dashboardGoalsTitle: 'Goal Progress',
    studyHubTitle: 'Study Hub',
    writingTitle: 'My Writings',
    booksTitle: 'Reading List',
    learnTitle: 'Expand Your Mind',
    journalTitle: 'Past Entries',
    meTitle: 'About Me',
    meSubtitle: 'Your personal space for reflection and growth.',
    meValuesTitle: 'Core Values',
    meVisionTitle: 'Personal Vision',
    meStrengthsTitle: 'Strengths & Weaknesses',
    meAchievementsTitle: 'Achievements',
    musicTitle: 'Music Hub',
    musicSubtitle: 'Set the mood with your favorite tracks from Spotify.',
};


const App: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [exams, setExams] = useLocalStorage<Exam[]>('exams', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [writings, setWritings] = useLocalStorage<Writing[]>('writings', []);
  const [books, setBooks] = useLocalStorage<Book[]>('books', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [meData, setMeData] = useLocalStorage<MeData>('meData', { values: '', vision: '', strengths: '', achievements: '' });
  const [spotifyUri, setSpotifyUri] = useLocalStorage<string>('spotifyUri', '');
  const [playlist, setPlaylist] = useLocalStorage<PlaylistItem[]>('playlist', []);
  const [editableContent, setEditableContent] = useLocalStorage<EditableContent>('editableContent', DEFAULT_EDITABLE_CONTENT);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark-academia');
  const [customColors, setCustomColors] = useLocalStorage<CustomThemeColors>('customColors', DEFAULT_CUSTOM_THEME);
  
  const [view, setView] = useState<View>('Dashboard');
  const userName = "Mashael";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'custom') {
      root.removeAttribute('data-theme');
      for (const [key, value] of Object.entries(customColors)) {
        root.style.setProperty(key, value as string);
      }
    } else {
       const defaultKeys = ['--bg-primary', '--bg-secondary', '--bg-interactive', '--border-primary', '--border-secondary', '--text-primary', '--text-secondary', '--text-muted', '--text-header', '--accent-primary', '--accent-primary-hover', '--accent-secondary'];
      for (const key of defaultKeys) {
        root.style.removeProperty(key);
      }
      root.setAttribute('data-theme', theme);
    }
  }, [theme, customColors]);

  const renderView = () => {
    switch (view) {
      case 'Dashboard':
        return <Dashboard 
                  userName={userName} 
                  todos={todos} 
                  setTodos={setTodos}
                  goals={goals} 
                  exams={exams} 
                  setView={setView} 
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                />;
      case 'Study':
        return <Study todos={todos} setTodos={setTodos} goals={goals} setGoals={setGoals} exams={exams} setExams={setExams} habits={habits} setHabits={setHabits} editableContent={editableContent} setEditableContent={setEditableContent} />;
      case 'Writing':
        return <WritingComponent writings={writings} setWritings={setWritings} editableContent={editableContent} setEditableContent={setEditableContent} />;
      case 'Books':
        return <Books books={books} setBooks={setBooks} editableContent={editableContent} setEditableContent={setEditableContent} />;
      case 'Learn':
        return <Learn editableContent={editableContent} setEditableContent={setEditableContent} />;
      case 'Pomodoro':
        return <Pomodoro />;
      case 'Journal':
        return <Journal entries={journalEntries} setEntries={setJournalEntries} editableContent={editableContent} setEditableContent={setEditableContent} />;
      case 'Me':
        return <Me meData={meData} setMeData={setMeData} editableContent={editableContent} setEditableContent={setEditableContent} />;
      case 'Music':
        return <Music 
                    spotifyUri={spotifyUri} 
                    setSpotifyUri={setSpotifyUri} 
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                    editableContent={editableContent} 
                    setEditableContent={setEditableContent} 
                />;
      default:
        return <Dashboard 
                  userName={userName} 
                  todos={todos} 
                  setTodos={setTodos}
                  goals={goals} 
                  exams={exams} 
                  setView={setView} 
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      <Sidebar 
        view={view} 
        setView={setView} 
        theme={theme} 
        setTheme={setTheme}
        customColors={customColors}
        setCustomColors={setCustomColors}
        editableContent={editableContent}
        setEditableContent={setEditableContent}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;