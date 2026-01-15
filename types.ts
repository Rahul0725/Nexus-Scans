export interface Chapter {
  id: string;
  number: string;
  title: string;
  releaseDate: string;
}

export interface Comic {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl: string;
  rating: number;
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  type: 'Manhwa' | 'Manga' | 'Manhua';
  author: string;
  artist: string;
  genres: string[];
  chapters: Chapter[];
  isHot?: boolean;
  isNew?: boolean;
}

export interface SearchState {
  query: string;
  isAiSearch: boolean;
  isLoading: boolean;
  results: Comic[];
}
