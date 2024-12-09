// Example: src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/auth'; // Update with your auth API endpoint

  constructor(private http: HttpClient, private logger: LoggingService) {
    this.logger.log('AuthService: Constructor called');
  }

  /**
   * Logs in a user.
   * @param email The user's email.
   * @param password The user's password.
   */
  login(email: string, password: string): Observable<User> {
    this.logger.log(`AuthService: Attempting to log in user with email: ${email}`);
    return this.http.post<User>(`${this.authUrl}/login`, { email, password }).pipe(
      tap((user) => {
        this.logger.log('AuthService: User logged in successfully:', user);
        // Optionally, store user data in local storage or a service
      }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    this.logger.log('AuthService: Logging out user');
    // Implement logout logic, such as clearing tokens or user data
  }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   */
  private handleError(error: HttpErrorResponse) {
    this.logger.error('AuthService: Server Error:', error);
    // Customize error handling as needed
    return throwError('An error occurred during authentication.');
  }
}
