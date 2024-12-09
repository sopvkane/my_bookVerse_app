import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class SelectedBookService {
  private selectedBookSubject = new BehaviorSubject<Book | null>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly API_URL = 'http://localhost:3000/books'; // Use environment variable

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    this.isLoadingSubject.next(true);
    return this.http.get<Book[]>(this.API_URL).pipe(
      tap(() => this.isLoadingSubject.next(false)),
      catchError((error) => {
        console.error('Error fetching books:', error);
        this.isLoadingSubject.next(false);
        throw error;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  setSelectedBook(book: Book): void {
    this.selectedBookSubject.next(book);
  }
}
