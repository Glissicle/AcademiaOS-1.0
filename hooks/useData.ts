// FIX: Import the React namespace to make types like `React.SetStateAction` available.
import React, { useState, useEffect, useCallback } from 'react';
import type { User, AppData, Todo, Goal, Exam, Habit, Writing, Book, JournalEntry, MeData, Theme, CustomThemeColors, EditableContent, PlaylistItem } from '../types';

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

const DEFAULT_APP_DATA: AppData = {
    todos: [],
    goals: [],
    exams: [],
    habits: [],
    writings: [],
    books: [],
    journalEntries: [],
    meData: { values: '', vision: '', strengths: '', achievements: '' },
    playlist: [],
    spotifyUri: '',
    editableContent: DEFAULT_EDITABLE_CONTENT,
    theme: 'dark-academia',
    customColors: DEFAULT_CUSTOM_THEME,
};

// This hook centralizes all app data management.
// It uses localStorage, but separates data for guests and authenticated users.
export const useData = (user: User | null) => {
    const [data, setData] = useState<AppData>(DEFAULT_APP_DATA);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const storageKey = user ? `app-data-${user.uid}` : 'app-data-guest';

    // Load data from localStorage on initial render or user change
    useEffect(() => {
        setIsDataLoaded(false);
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                // Deep merge to ensure new default properties are added
                const parsed = JSON.parse(savedData);
                setData(prev => ({
                    ...prev,
                    ...parsed,
                    editableContent: {...DEFAULT_EDITABLE_CONTENT, ...parsed.editableContent},
                    customColors: {...DEFAULT_CUSTOM_THEME, ...parsed.customColors},
                }));
            } else {
                setData(DEFAULT_APP_DATA);
            }
        } catch (error) {
            console.error("Failed to load data from storage", error);
            setData(DEFAULT_APP_DATA);
        }
        setIsDataLoaded(true);
    }, [user, storageKey]);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (isDataLoaded) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(data));
            } catch (error) {
                console.error("Failed to save data to storage", error);
            }
        }
    }, [data, storageKey, isDataLoaded]);
    
    // Create individual setters for convenience, wrapped in useCallback
    const setTodos = useCallback((value: React.SetStateAction<Todo[]>) => setData(d => ({ ...d, todos: typeof value === 'function' ? value(d.todos) : value })), []);
    const setGoals = useCallback((value: React.SetStateAction<Goal[]>) => setData(d => ({ ...d, goals: typeof value === 'function' ? value(d.goals) : value })), []);
    const setExams = useCallback((value: React.SetStateAction<Exam[]>) => setData(d => ({ ...d, exams: typeof value === 'function' ? value(d.exams) : value })), []);
    const setHabits = useCallback((value: React.SetStateAction<Habit[]>) => setData(d => ({ ...d, habits: typeof value === 'function' ? value(d.habits) : value })), []);
    const setWritings = useCallback((value: React.SetStateAction<Writing[]>) => setData(d => ({ ...d, writings: typeof value === 'function' ? value(d.writings) : value })), []);
    const setBooks = useCallback((value: React.SetStateAction<Book[]>) => setData(d => ({ ...d, books: typeof value === 'function' ? value(d.books) : value })), []);
    const setJournalEntries = useCallback((value: React.SetStateAction<JournalEntry[]>) => setData(d => ({ ...d, journalEntries: typeof value === 'function' ? value(d.journalEntries) : value })), []);
    const setMeData = useCallback((value: React.SetStateAction<MeData>) => setData(d => ({ ...d, meData: typeof value === 'function' ? value(d.meData) : value })), []);
    const setPlaylist = useCallback((value: React.SetStateAction<PlaylistItem[]>) => setData(d => ({ ...d, playlist: typeof value === 'function' ? value(d.playlist) : value })), []);
    const setSpotifyUri = useCallback((value: React.SetStateAction<string>) => setData(d => ({ ...d, spotifyUri: typeof value === 'function' ? value(d.spotifyUri) : value })), []);
    const setEditableContent = useCallback((value: React.SetStateAction<EditableContent>) => setData(d => ({ ...d, editableContent: typeof value === 'function' ? value(d.editableContent) : value })), []);
    const setTheme = useCallback((value: React.SetStateAction<Theme>) => setData(d => ({ ...d, theme: typeof value === 'function' ? value(d.theme) : value })), []);
    const setCustomColors = useCallback((value: React.SetStateAction<CustomThemeColors>) => setData(d => ({ ...d, customColors: typeof value === 'function' ? value(d.customColors) : value })), []);


    return {
        isDataLoaded,
        ...data,
        setTodos,
        setGoals,
        setExams,
        setHabits,
        setWritings,
        setBooks,
        setJournalEntries,
        setMeData,
        setPlaylist,
        setSpotifyUri,
        setEditableContent,
        setTheme,
        setCustomColors,
    };
};