// src/app/services/volume.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VolumeService {
  private masterVolumeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(50);
  masterVolume$: Observable<number> = this.masterVolumeSubject.asObservable();

  private ttsVolumeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(50);
  ttsVolume$: Observable<number> = this.ttsVolumeSubject.asObservable();

  private soundscapeVolumeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(50);
  soundscapeVolume$: Observable<number> = this.soundscapeVolumeSubject.asObservable();

  constructor() {}

  setMasterVolume(volume: number): void {
    this.masterVolumeSubject.next(volume);
  }

  setTtsVolume(volume: number): void {
    this.ttsVolumeSubject.next(volume);
  }

  setSoundscapeVolume(volume: number): void {
    this.soundscapeVolumeSubject.next(volume);
  }
}
