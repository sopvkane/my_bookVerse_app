import { Component } from '@angular/core';
import { SelectedBookService } from '../services/selected-book.service';
import { TtsService } from '../services/tts.service';
import { SoundscapeService } from '../services/soundscape.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent {
  isReading: boolean = false;
  bookContent: string = '';
  soundscapesEnabled = false;

  // Add your available soundscapes here
  sounds: string[] = [
    'assets/sounds/EnchantingForestSoundScape.mp3'
    // Add more soundscape files if you have them
  ];
  selectedSound: string = this.sounds[0];

  constructor(
    private soundscapeService: SoundscapeService,
    private selectedBookService: SelectedBookService,
    private ttsService: TtsService
  ) {
    this.selectedBookService.selectedBook$.subscribe((book) => {
      if (book) {
        this.bookContent = book.content || '';
      } else {
        this.bookContent = '';
      }
    });
  }

  startReading(): void {
    if (!this.bookContent) {
      console.error("No content to read.");
      return;
    }
    this.ttsService.speakText(this.bookContent);
    this.isReading = true;
  }

  stopReading(): void {
    this.ttsService.stop();
    this.isReading = false;
  }

  toggleSoundscapes(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.soundscapesEnabled = checkbox.checked;
    this.soundscapeService.enableSoundscapes(this.soundscapesEnabled);
    if (!this.soundscapesEnabled) {
      this.soundscapeService.stopSoundscape();
    }
  }

  onSoundSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSound = target.value;
  }

  playSelectedSoundscape() {
    if (this.soundscapesEnabled && this.selectedSound) {
      this.soundscapeService.playSoundscape(this.selectedSound);
    }
  }

  stopSoundscape() {
    this.soundscapeService.stopSoundscape();
  }
}
