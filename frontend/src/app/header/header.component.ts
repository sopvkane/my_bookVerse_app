import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedBookService } from '../services/selected-book.service';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  userName: string = 'Sophie Kane'; // Replace with actual user data
  userProfileImage: string = 'assets/Images/profile.png';
  dropdownOpen: boolean = false;
  currentIndex: number = 0; // Tracks the current carousel index

  constructor(
    private bookService: BookService,
    private selectedBookService: SelectedBookService,
    private router: Router // Inject the Router for navigation
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(
      (data: Book[]) => {
        console.log('Books fetched from the backend:', data); // Debug log
        this.books = data;
        if (this.books.length > 0) {
          this.currentIndex = 0; // Start at the first book
        }
      },
      (error) => {
        console.error('Error fetching books:', error); // Log any errors
      }
    );
  
    this.selectedBookService.selectedBook$.subscribe((book: Book | null) => {
      this.selectedBook = book;
    });
  }
  

  /**
   * Selects a book from the carousel and updates the main content.
   * @param book The book to select.
   */
  selectBook(book: Book): void {
    this.selectedBook = book;
    this.selectedBookService.setSelectedBook(book);
  }

  /**
   * Checks if a book is currently selected.
   * @param book The book to check.
   * @returns True if the book is selected, false otherwise.
   */
  isSelected(book: Book): boolean {
    return this.selectedBook?.id === book.id;
  }

  /**
   * Toggles the dropdown menu visibility.
   */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Navigates to the user's profile page.
   */
  navigateToProfile(): void {
    this.router.navigate(['/profile']); // Navigate to profile page
    this.dropdownOpen = false;
  }

  /**
   * Navigates to the create new book page.
   */
  navigateToCreate(): void {
    this.router.navigate(['/create']); // Navigate to authoring page
    this.dropdownOpen = false;
  }

  /**
   * Handles image load errors by setting a fallback image.
   * @param event The error event triggered when the image fails to load.
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder-book.jpg'; // Fallback image
  }

  /**
   * Navigates to the previous slide in the carousel.
   */
  previousSlide(): void {
    if (this.books.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.books.length) % this.books.length;
    // Do not update selectedBook to prevent main content change
  }

  /**
   * Navigates to the next slide in the carousel.
   */
  nextSlide(): void {
    if (this.books.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.books.length;
    // Do not update selectedBook to prevent main content change
  }

  getPreviousIndex(): number {
    return (this.currentIndex - 1 + this.books.length) % this.books.length;
  }

  getNextIndex(): number {
    return (this.currentIndex + 1) % this.books.length;
  }

  hasPreviousBook(): boolean {
    return this.books.length > 1;
  }

  hasNextBook(): boolean {
    return this.books.length > 1;
  }
}
