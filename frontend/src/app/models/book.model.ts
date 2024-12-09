// src/app/models/book.model.ts

export interface Word {
  text: string;
  startIndex: number;
}

export interface Book {
  id: number;               // Added: Unique identifier for the book
  title: string;            // Existing
  content: string;          // Existing
  images: string[];         // Added: Array of image URLs or paths
  sounds: string[];         // Added: Array of sound URLs or paths
  thumbnail: string;        // Added: URL or path to the thumbnail image
  imageUrl: string;         // Existing (ensure it's distinct from 'images' if necessary)
  words?: Word[];
  prompt?: string;           // Existing: Optional property for word tracking
  // Add any other properties your application requires
}
