import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Chapter {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export interface Book {
  id: number;
  title: string;
  thumbnail: string;
  chapters: Chapter[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';
  private selectedBookSubject = new BehaviorSubject<Book | null>(null);

  constructor(private http: HttpClient) {
    console.log('ApiService: Constructor called');
    console.log(`ApiService: API URL set to ${this.apiUrl}`);
  }

  // Observable for selected book
  selectedBook$ = this.selectedBookSubject.asObservable();

  /**
   * API: Get all books
   */
  getBooks(): Observable<Book[]> {
    console.log('ApiService: getBooks() called');
    console.log(`ApiService: Sending GET request to ${this.apiUrl}/books`);
    return this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
      // You can add more logging here if needed, such as response handling
      // For example, using tap from rxjs to log the response
      // tap((books) => console.log('ApiService: Received books:', books))
    );
  }

  /**
   * API: Get a specific book by ID
   * @param bookId The ID of the book to retrieve
   */
  getBook(bookId: number): Observable<Book> {
    console.log(`ApiService: getBook(${bookId}) called`);
    console.log(`ApiService: Sending GET request to ${this.apiUrl}/books/${bookId}`);
    return this.http.get<Book>(`${this.apiUrl}/books/${bookId}`).pipe(
      // tap((book) => console.log(`ApiService: Received book:`, book))
    );
  }

  /**
   * API: Add a chapter to a book
   * @param bookId The ID of the book to add a chapter to
   * @param chapter The chapter data to add
   */
  addChapter(bookId: number, chapter: Chapter): Observable<Chapter> {
    console.log(`ApiService: addChapter(${bookId}, ${JSON.stringify(chapter)}) called`);
    console.log(`ApiService: Sending POST request to ${this.apiUrl}/books/${bookId}/chapters with data:`, chapter);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Chapter>(
      `${this.apiUrl}/books/${bookId}/chapters`,
      chapter,
      { headers }
    ).pipe(
      // tap((newChapter) => console.log('ApiService: Added new chapter:', newChapter))
    );
  }

  /**
   * Select a book and update the current selection
   * @param book The book to select
   */
  selectBook(book: Book): void {
    console.log(`ApiService: selectBook() called with book ID: ${book.id}, Title: "${book.title}"`);
    this.selectedBookSubject.next(book);
    console.log('ApiService: Selected book updated in BehaviorSubject:', book);
  }

  /**
   * Get the currently selected book (synchronously)
   * @returns The currently selected book or null if none is selected
   */
  getSelectedBook(): Book | null {
    const currentBook = this.selectedBookSubject.value;
    console.log('ApiService: getSelectedBook() called. Current selected book:', currentBook);
    return currentBook;
  }
}
