import { create } from "zustand";

export interface FilmResponse {
  films: Film[];
  page: number;
  totalResults: number;
}

export interface Film {
  id: number;
  imdbId: string;
  title: string;
  year: number;
  genre: string;
  director: string;
  plot: string;
  posterUrl: string;
  rating: number;
  runtime: number;
}

export interface WatchlistEntry {
  id: number;
  filmId: number;
  status: "want_to_watch" | "watched" | "currently_watching";
  userRating?: number;
  review?: string;
  watchedDate?: string;
  addedAt: string;
  film: Film;
}

interface FilmState {
  searchResults: Film[];
  watchlist: WatchlistEntry[];
  recommendations: Film[];
  currentFilm: Film | null;
  searchQuery: string;
  isSearching: boolean;

  // Actions
  setSearchResults: (films: Film[]) => void;
  setWatchlist: (watchlist: WatchlistEntry[]) => void;
  addToWatchlist: (entry: WatchlistEntry) => void;
  removeFromWatchlist: (filmId: number) => void;
  updateWatchlistEntry: (filmId: number, updates: Partial<WatchlistEntry>) => void;
  setRecommendations: (films: Film[]) => void;
  setCurrentFilm: (film: Film | null) => void;
  setSearchQuery: (query: string) => void;
  setSearching: (searching: boolean) => void;
  clearSearch: () => void;
}

export const useFilmStore = create<FilmState>((set, get) => ({
  searchResults: [],
  watchlist: [],
  recommendations: [],
  currentFilm: null,
  searchQuery: "",
  isSearching: false,

  setSearchResults: (films: Film[]) => {
    set({ searchResults: films });
  },

  setWatchlist: (watchlist: WatchlistEntry[]) => {
    set({ watchlist });
  },

  addToWatchlist: (entry: WatchlistEntry) => {
    const currentWatchlist = get().watchlist;
    const existingIndex = currentWatchlist.findIndex((item) => item.filmId === entry.filmId);

    if (existingIndex >= 0) {
      // Update existing entry
      const updatedWatchlist = [...currentWatchlist];
      updatedWatchlist[existingIndex] = entry;
      set({ watchlist: updatedWatchlist });
    } else {
      // Add new entry
      set({ watchlist: [...currentWatchlist, entry] });
    }
  },

  removeFromWatchlist: (filmId: number) => {
    const currentWatchlist = get().watchlist;
    set({
      watchlist: currentWatchlist.filter((item) => item.filmId !== filmId),
    });
  },

  updateWatchlistEntry: (filmId: number, updates: Partial<WatchlistEntry>) => {
    const currentWatchlist = get().watchlist;
    const updatedWatchlist = currentWatchlist.map((item) => (item.filmId === filmId ? { ...item, ...updates } : item));
    set({ watchlist: updatedWatchlist });
  },

  setRecommendations: (films: Film[]) => {
    set({ recommendations: films });
  },

  setCurrentFilm: (film: Film | null) => {
    set({ currentFilm: film });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSearching: (searching: boolean) => {
    set({ isSearching: searching });
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchQuery: "",
      isSearching: false,
    });
  },
}));
