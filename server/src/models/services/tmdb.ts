export interface ConfigurationImages {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
}

interface MovieGenre {
    id: number;
    name: string;
}

interface MovieListItem {
    backdrop_path: string;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    title: string;
    genre_ids: number[];
    vote_average: number;
}

interface CastMember {
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    profile_path: string;
    character: string;
}

export interface Configuration {
    images: ConfigurationImages;
}

export interface MovieDetails {
    backdrop_path: string;
    genres: MovieGenre[];
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    tagline: string;
    title: string;
    vote_average: number;
    vote_count: number;
}

export interface MovieImage {
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    width: number;
}

export interface MovieImages {
    backdrops: MovieImage[];
    logos: MovieImage[];
    posters: MovieImage[];
    id: number;
}

export interface MovieList {
    page: number;
    results: MovieListItem[];
    total_pages: number;
    total_results: number;
}

export interface MovieCredits {
    id: number;
    cast: CastMember[];
}

export interface MovieGenresList {
    genres: MovieGenre[];
}
