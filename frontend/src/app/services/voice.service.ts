import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private selectedVoiceSubject = new BehaviorSubject<string>('');
  selectedVoice$ = this.selectedVoiceSubject.asObservable();
  selectedVoice: string = '';

  constructor() {
    this.loadVoices();
  }

  loadVoices(): void {
    const voices = speechSynthesis.getVoices();

    if (!voices.length) {
      speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = speechSynthesis.getVoices();
        if (loadedVoices.length > 0 && !this.selectedVoice) {
          this.selectedVoice = loadedVoices[0].name;
          this.selectedVoiceSubject.next(this.selectedVoice);
        }
      };
    } else {
      this.selectedVoice = voices[0].name;
      this.selectedVoiceSubject.next(this.selectedVoice);
    }
  }

  getAvailableVoices(): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      const voices = speechSynthesis.getVoices().map((v) => v.name);
      if (voices.length > 0) {
        observer.next(voices);
        observer.complete();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          const loadedVoices = speechSynthesis.getVoices().map((v) => v.name);
          observer.next(loadedVoices);
          observer.complete();
        };
      }
    });
  }

  selectVoice(voiceName: string): void {
    this.selectedVoice = voiceName;
    this.selectedVoiceSubject.next(voiceName);
  }
}
