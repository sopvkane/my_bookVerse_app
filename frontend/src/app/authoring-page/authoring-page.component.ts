import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-authoring-page',
  templateUrl: './authoring-page.component.html',
  styleUrls: ['./authoring-page.component.scss'],
})
export class AuthoringPageComponent {
  chapter = {
    title: '',
    content: '',
    prompt: '',
    images: [] as File[],
    sounds: [] as File[],
  };

  constructor(private bookService: BookService) {}

  onFileSelected(event: Event, type: 'image' | 'sound') {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      if (type === 'image') {
        this.chapter.images.push(...Array.from(files));
      } else if (type === 'sound') {
        this.chapter.sounds.push(...Array.from(files));
      }
    }
  }

  saveChapter() {
    // Generate thumbnail or use a placeholder
    const thumbnail = this.chapter.images.length > 0
      ? URL.createObjectURL(this.chapter.images[0])
      : 'assets/images/placeholder-book.jpg';

    // Create a new book object with the prompt
    const newBook: Book = {
      id: 0, // Will be assigned by the service
      title: this.chapter.title,
      content: this.chapter.content,
      thumbnail: thumbnail,
      imageUrl: thumbnail,
      images: this.chapter.images.map((file) => URL.createObjectURL(file)),
      sounds: this.chapter.sounds.map((file) => URL.createObjectURL(file)),
      prompt: this.chapter.prompt
    };

    // Add the book
    this.bookService.addBook(newBook);
    console.log('Chapter saved:', newBook);

    // Reset the form
    this.chapter = {
      title: '',
      content: '',
      prompt: '',
      images: [] as File[],
      sounds: [] as File[],
    };
  }
}
