import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectedBookService } from '../services/selected-book.service';
import { SentimentService } from '../services/sentiment.service';
import { TtsService } from '../services/tts.service';
import { ImageGenerationService } from '../services/image-generation.service';
import { SoundscapeService } from '../services/soundscape.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit, OnDestroy {
  selectedBook: any;
  sentimentScore: string = 'neutral';
  words: { text: string; sentimentColor: string }[] = [];
  currentWordIndex: number = -1;
  bgImageUrl: string = '';
  illustrationImageUrl: string = '';

  isLoadingBackground: boolean = false;
  isLoadingIllustration: boolean = false;
  backgroundError: string = '';
  illustrationError: string = '';

  private subscriptions: Subscription[] = [];
  private soundscapeAudio: HTMLAudioElement | null = null;

  constructor(
    private selectedBookService: SelectedBookService,
    private sentimentService: SentimentService,
    private ttsService: TtsService,
    private imageService: ImageGenerationService,
    private soundscapeService: SoundscapeService
  ) {}

  ngOnInit(): void {
    const selectedBookSub = this.selectedBookService.selectedBook$.subscribe((book) => {
      if (book && book.content) {
        this.selectedBook = book;
        this.processContent(book.content);
        this.handleSoundscapeChange();
      } else {
        this.resetContent();
        this.stopSoundscapes();
      }
    });
    this.subscriptions.push(selectedBookSub);

    const wordBoundarySub = this.ttsService.currentWordIndex$.subscribe(index => {
      this.currentWordIndex = index;
    });
    this.subscriptions.push(wordBoundarySub);

    // Subscribe to soundscape enable/disable
    const soundscapeSub = this.soundscapeService.soundscapesEnabled$.subscribe(enabled => {
      this.handleSoundscapeChange(enabled);
    });
    this.subscriptions.push(soundscapeSub);

    // If available, subscribe to TTS start/stop events here
    // For example:
    // const ttsPlayingSub = this.ttsService.ttsPlaying$.subscribe(isPlaying => {
    //   if (isPlaying && this.selectedBook?.sounds?.length > 0) {
    //     // Ensure soundscapes play if enabled
    //     this.handleSoundscapeChange();
    //   } else {
    //     this.stopSoundscapes();
    //   }
    // });
    // this.subscriptions.push(ttsPlayingSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.stopSoundscapes();
  }

  processContent(text: string): void {
    this.isLoadingBackground = true;
    this.sentimentService.analyzeSentiment(text).subscribe({
      next: (sentiment: string) => {
        this.sentimentScore = sentiment;
        const color = this.getSentimentColor(sentiment);
        this.words = text.split(' ').map(w => ({ text: w, sentimentColor: color }));
        this.currentWordIndex = -1;

        const prompt = this.createBackgroundPrompt(sentiment);
        this.imageService.generateImage(prompt).subscribe({
          next: result => {
            this.bgImageUrl = result.imageUrl;
            this.isLoadingBackground = false;
          },
          error: err => {
            console.error('Error generating background image:', err);
            this.backgroundError = 'Failed to generate background image.';
            this.isLoadingBackground = false;
          }
        });
      },
      error: err => {
        console.error('Error analyzing sentiment:', err);
        this.backgroundError = 'Failed to analyze sentiment.';
        this.isLoadingBackground = false;
      }
    });
  }

  createBackgroundPrompt(sentiment: string): string {
    switch (sentiment) {
      case 'positive':
        return `A vibrant, colorful, and cheerful background that reflects happiness and warmth, inspired by ${this.selectedBook.title}`;
      case 'negative':
        return `A dark, somber, and moody background reflecting sadness or tension, themed around ${this.selectedBook.title}`;
      default:
        return `A neutral, calm, and balanced background, subtle and abstract, for ${this.selectedBook.title}`;
    }
  }

  getSentimentColor(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return 'green';
      case 'negative': return 'red';
      default: return 'gray';
    }
  }

  generateIllustration(): void {
    if (!this.selectedBook || !this.selectedBook.prompt) {
      console.warn('No prompt available for the selected book.');
      this.illustrationError = 'No prompt available for the selected book.';
      return;
    }

    this.isLoadingIllustration = true;
    const prompt = this.selectedBook.prompt;

    this.imageService.generateIllustration(prompt).subscribe({
      next: result => {
        this.illustrationImageUrl = result.imageUrl;
        this.isLoadingIllustration = false;
      },
      error: err => {
        console.error('Error generating illustration:', err);
        this.illustrationError = 'Failed to generate illustration.';
        this.isLoadingIllustration = false;
      }
    });
  }

  resetContent(): void {
    this.selectedBook = null;
    this.words = [];
    this.currentWordIndex = -1;
    this.bgImageUrl = '';
    this.illustrationImageUrl = '';
    this.backgroundError = '';
    this.illustrationError = '';
  }

  private handleSoundscapeChange(forceEnabled?: boolean): void {
    // Determine if soundscapes are enabled
    const isEnabled = forceEnabled !== undefined
      ? forceEnabled
      : (this.soundscapeAudio !== null || false);

    // If no sounds or no book selected, stop
    if (!this.selectedBook || !this.selectedBook.sounds?.length) {
      this.stopSoundscapes();
      return;
    }

    // Subscribe once to current soundscape state and update accordingly
    this.soundscapeService.soundscapesEnabled$.subscribe(enabled => {
      if (enabled && this.selectedBook.sounds.length > 0) {
        this.playSoundscapes(this.selectedBook.sounds[0]);
      } else {
        this.stopSoundscapes();
      }
    });
  }

  private playSoundscapes(soundUrl: string): void {
    this.stopSoundscapes(); // Stop any currently playing audio first
    this.soundscapeAudio = new Audio(soundUrl);
    this.soundscapeAudio.loop = true; // Loop the soundscape if desired
    this.soundscapeAudio.volume = 0.5; // Adjust volume as needed
    this.soundscapeAudio.play().catch(err => console.error('Error playing soundscape:', err));
  }

  private stopSoundscapes(): void {
    if (this.soundscapeAudio) {
      this.soundscapeAudio.pause();
      this.soundscapeAudio = null;
    }
  }
}
