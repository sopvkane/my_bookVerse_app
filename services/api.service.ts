// frontend/src/app/services/api.service.ts

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
  private apiUrl = 'http://127.0.0.1:8000/api';
  private selectedBookSubject = new BehaviorSubject<Book | null>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  getBook(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${bookId}`);
  }

  addChapter(bookId: number, chapter: Chapter): Observable<Chapter> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Chapter>(
      `${this.apiUrl}/books/${bookId}/chapters`,
      chapter,
      { headers }
    );
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload/image`, formData);
  }

  selectBook(book: Book): void {
    this.selectedBookSubject.next(book);
  }
}
