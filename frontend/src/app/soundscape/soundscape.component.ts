import { Component } from '@angular/core';
import { SoundscapeService } from '../services/soundscape.service';

@Component({
  selector: 'app-soundscape',
  templateUrl: './soundscape.component.html',
  styleUrls: ['./soundscape.component.scss']
})
export class SoundscapeComponent {
  sounds: string[] = [
    'assets/sounds/EnchantingForestSoundScape.mp3',
    // Add more soundscapes here as needed
  ];

  selectedSound: string = this.sounds[0]; // Default selection

  constructor(private soundscapeService: SoundscapeService) {}

  onSoundSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSound = target.value;
  }

  playSoundscape() {
    if (this.selectedSound) {
      this.soundscapeService.playSoundscape(this.selectedSound);
    }
  }

  stopSoundscape() {
    this.soundscapeService.stopSoundscape();
  }
}
