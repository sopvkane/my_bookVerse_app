// Example: src/app/services/user.service.ts

import { Injectable } from '@angular/core';
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
export class UserService {
  private currentUser: User | null = null;

  constructor(private logger: LoggingService) {
    this.logger.log('UserService: Constructor called');
  }

  /**
   * Sets the current user.
   * @param user The user to set as current.
   */
  setCurrentUser(user: User): void {
    this.logger.log(`UserService: Setting current user: ${user.name}`);
    this.currentUser = user;
  }

  /**
   * Retrieves the current user.
   */
  getCurrentUser(): User | null {
    this.logger.log('UserService: getCurrentUser() called');
    return this.currentUser;
  }

  /**
   * Clears the current user.
   */
  clearCurrentUser(): void {
    this.logger.log('UserService: Clearing current user');
    this.currentUser = null;
  }
}
