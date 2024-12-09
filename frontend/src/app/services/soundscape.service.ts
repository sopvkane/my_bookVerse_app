import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SoundscapeService {
  private soundscapesEnabledSubject = new BehaviorSubject<boolean>(false);
  soundscapesEnabled$ = this.soundscapesEnabledSubject.asObservable();

  private soundscapeAudio: HTMLAudioElement | null = null;

  enableSoundscapes(enable: boolean): void {
    this.soundscapesEnabledSubject.next(enable);
  }

  // Add the missing methods

  playSoundscape(url: string): void {
    this.stopSoundscape(); // Stop any currently playing soundscape first
    this.soundscapeAudio = new Audio(url);
    this.soundscapeAudio.loop = true; // Loop if desired
    this.soundscapeAudio.volume = 0.5; // Set a default volume
    this.soundscapeAudio.play().catch(err => console.error('Error playing soundscape:', err));
  }

  stopSoundscape(): void {
    if (this.soundscapeAudio) {
      this.soundscapeAudio.pause();
      this.soundscapeAudio = null;
    }
  }

  setVolume(volume: number): void {
    if (this.soundscapeAudio) {
      // Ensure the volume is between 0.0 and 1.0
      const validVolume = Math.min(Math.max(volume, 0.0), 1.0);
      this.soundscapeAudio.volume = validVolume;
    }
  }
}
