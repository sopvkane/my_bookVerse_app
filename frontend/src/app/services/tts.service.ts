// src/app/services/tts.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private synthesizer: sdk.SpeechSynthesizer | null = null;
  public currentWordIndex$ = new Subject<number>();

  private voiceName = 'en-US-AvaNeural'; 
  private speechKey = '28MTPo1ecOIdTW0hrVoKf1dF1OUfjRwnu7OYCycCUnPaTJEywrkUJQQJ99ALACYeBjFXJ3w3AAAYACOGpyfi';
  private region = 'eastus';
  private startTime: number = 0;


  constructor() {
    const speechConfig = sdk.SpeechConfig.fromSubscription(this.speechKey, this.region);
    speechConfig.speechSynthesisVoiceName = this.voiceName;

    // Ensure word boundary events are enabled
    speechConfig.requestWordLevelTimestamps();

    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    this.synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  }

  speakText(text: string): void {
    if (!this.synthesizer) {
      const speechConfig = sdk.SpeechConfig.fromSubscription(this.speechKey, this.region);
      speechConfig.speechSynthesisVoiceName = this.voiceName;
      speechConfig.requestWordLevelTimestamps();
      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
      this.synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    }

    this.synthesizer.wordBoundary = (s, e) => {
        const offsetMs = e.audioOffset / 10000; // Convert to ms
        
        // Calculate the time at which the word should be highlighted
        // assuming audio playback starts right away.
        const highlightTime = this.startTime + offsetMs;
        
        // Schedule highlighting
        const delay = highlightTime - performance.now();
        setTimeout(() => {
            const wordIndex = this.getWordIndexFromCharOffset(text, e.textOffset);
            this.currentWordIndex$.next(wordIndex);
        }, delay > 0 ? delay : 0);
    };

    try {
      this.startTime = performance.now();
      this.synthesizer.speakTextAsync(
        text,
        result => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("Synthesis completed.");
          } else {
            console.error("Synthesis error:", result.errorDetails);
          }
        },
        error => {
          console.error("Error during speakTextAsync:", error);
        }
      );
    } catch (e) {
      console.error("Exception calling speakTextAsync:", e);
    }
  }

  stop(): void {
    if (this.synthesizer) {
      this.synthesizer.close();
      this.synthesizer = null;
      console.log("Synthesizer closed. Speech stopped.");
    }
  }

  private getWordIndexFromCharOffset(text: string, charOffset: number): number {
    const words = text.split(' ');
    let cumulativeLength = 0;
    for (let i = 0; i < words.length; i++) {
      const wordLength = words[i].length + (i < words.length - 1 ? 1 : 0);
      if (charOffset < cumulativeLength + wordLength) {
        return i;
      }
      cumulativeLength += wordLength;
    }
    return words.length - 1;
  }
}
