import React, { useState } from 'react';
import Card from './common/Card';
import type { EditableContent, PlaylistItem } from '../types';

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

interface MusicProps {
  spotifyUri: string;
  setSpotifyUri: (uri: string) => void;
  playlist: PlaylistItem[];
  setPlaylist: React.Dispatch<React.SetStateAction<PlaylistItem[]>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Music: React.FC<MusicProps> = ({ spotifyUri, setSpotifyUri, playlist, setPlaylist, editableContent, setEditableContent }) => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const [songTitle, setSongTitle] = useState('');

  const getEmbedUrl = (linkOrUri: string): string | null => {
    if (!linkOrUri) return null;
    try {
      // Handle standard URLs: https://open.spotify.com/track/4cOdK2wGLETOMs3AKxbNkA
      if (linkOrUri.includes('open.spotify.com')) {
        const url = new URL(linkOrUri);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          const type = pathParts[pathParts.length - 2];
          const id = pathParts[pathParts.length - 1];
          if (['track', 'playlist', 'album', 'artist', 'episode'].includes(type)) {
             return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
          }
        }
      }
      // Handle URIs: spotify:track:4cOdK2wGLETOMs3AKxbNkA
      const uriParts = linkOrUri.split(':');
      if (uriParts.length === 3 && uriParts[0] === 'spotify') {
        const [_, type, id] = uriParts;
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
      }
    } catch (e) {
      console.error("Invalid Spotify URL or URI", e);
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(spotifyUri);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (spotifyLink.trim() && songTitle.trim()) {
        const newPlaylistItem: PlaylistItem = {
            id: Date.now().toString(),
            title: songTitle,
            spotifyUri: spotifyLink,
        };
        setPlaylist([newPlaylistItem, ...playlist]);
        setSpotifyUri(spotifyLink);
        setSpotifyLink('');
        setSongTitle('');
    } else if (spotifyLink.trim()) {
        setSpotifyUri(spotifyLink);
        setSpotifyLink('');
    }
  };
  
  const playFromPlaylist = (uri: string) => {
    setSpotifyUri(uri);
  };

  const deleteFromPlaylist = (idToDelete: string) => {
    setPlaylist(playlist.filter(item => item.id !== idToDelete));
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif text-[var(--text-header)] mb-2">{editableContent.musicTitle}</h1>
        <p className="text-[var(--text-secondary)]">{editableContent.musicSubtitle}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="spotify-link" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Spotify URL or URI</label>
              <input
                id="spotify-link"
                type="text"
                value={spotifyLink}
                onChange={(e) => setSpotifyLink(e.target.value)}
                placeholder="Paste link here..."
                className="w-full bg-[var(--bg-interactive)]/50 p-3 rounded-md border border-[var(--border-secondary)]"
              />
            </div>
            <div>
              <label htmlFor="song-title" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Song Title & Artist</label>
              <input
                id="song-title"
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="e.g., Clair de Lune - Claude Debussy"
                className="w-full bg-[var(--bg-interactive)]/50 p-3 rounded-md border border-[var(--border-secondary)]"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-start pt-2">
            <p className="text-xs text-[var(--text-muted)] sm:max-w-md">
                To add a song to your playlist, fill in both fields. To just load a song or playlist, only the URL is needed.
            </p>
            <button
              type="submit"
              className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-3 px-6 rounded-md transition-colors w-full sm:w-auto"
            >
              Add & Load
            </button>
          </div>
        </form>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-1">
          {embedUrl ? (
            <iframe
              key={spotifyUri} // Forces re-render on URI change.
              style={{ borderRadius: '12px' }}
              src={embedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
            ></iframe>
          ) : (
             <div className="text-center text-[var(--text-muted)] p-10 h-[352px] flex flex-col justify-center">
                <p>Your Spotify player will appear here.</p>
                <p>Paste a link above to get started.</p>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-1 flex flex-col">
            <h2 className="text-2xl font-serif text-[var(--text-header)] mb-4">My Study Playlist</h2>
            {playlist.length > 0 ? (
                <ul className="space-y-2 overflow-y-auto max-h-[300px] pr-2">
                    {playlist.map(item => (
                        <li key={item.id} className="flex items-center justify-between bg-[var(--bg-interactive-alpha-2)] p-3 rounded-md group">
                            <span className="truncate pr-2">{item.title}</span>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button onClick={() => playFromPlaylist(item.spotifyUri)} className="text-[var(--text-secondary)] hover:text-[var(--accent-secondary-hover)] transition-colors" aria-label={`Play ${item.title}`}>
                                  <PlayIcon />
                                </button>
                                <button onClick={() => deleteFromPlaylist(item.id)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)] transition-colors" aria-label={`Delete ${item.title}`}>
                                  <DeleteIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-[var(--text-muted)] p-10 flex-grow flex items-center justify-center">
                    <p>Your playlist is empty. Add songs using the form above.</p>
                </div>
            )}
        </Card>
      </div>

    </div>
  );
};

export default Music;