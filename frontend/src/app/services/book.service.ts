import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private dbUrl = 'http://localhost:3000/books';
  private books: Book[] = [];
  private booksSubject: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

  books$: Observable<Book[]> = this.booksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchBooks(); // Fetch books at service initialization
  }

  fetchBooks(): void {
    this.http.get<Book[]>(this.dbUrl).pipe(
      tap((books) => {
        console.log('Books fetched from backend:', books); // Debug log
        this.books = books;
        this.booksSubject.next(this.books); // Notify subscribers
      })
    ).subscribe({
      error: (err) => console.error('Error fetching books:', err),
    });
  }

  getBooks(): Observable<Book[]> {
    return this.books$;
  }

  addBook(book: Book): void {
    this.http.post<Book>(this.dbUrl, book).pipe(
      tap((newBook) => {
        console.log('New book added:', newBook); // Debug log
        this.books.push(newBook); // Add to local cache
        this.booksSubject.next(this.books); // Notify subscribers
      })
    ).subscribe();
  }
}
