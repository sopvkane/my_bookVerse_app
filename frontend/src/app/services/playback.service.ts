// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class PlaybackService {
//   private audio: HTMLAudioElement | null = null;
//   private isPlaying: boolean = false;

//   // Get current playback state
//   public getPlaybackState(): boolean {
//     return this.isPlaying;
//   }

//   /**
//    * Plays or pauses the given text using TTS.
//    * @param text The text to convert to speech and play.
//    * @returns A promise resolving when the action completes.
//    */
//   private isFetchingAudio = false;

// async playOrPauseText(text: string): Promise<void> {
//   console.log("Button clicked. Audio:", this.audio, "isPlaying:", this.isPlaying, "isFetchingAudio:", this.isFetchingAudio);

//   // If we are currently fetching audio, just return.
//   if (this.isFetchingAudio) {
//     console.log("Currently fetching audio, ignoring this click.");
//     return;
//   }

//   if (this.audio && this.isPlaying) {
//     this.audio.pause();
//     this.isPlaying = false;
//     console.log("Playback paused.");
//     return;
//   }

//   if (this.audio && !this.isPlaying) {
//     try {
//       await this.audio.play();
//       this.isPlaying = true;
//       console.log("Playback resumed.");
//     } catch (playError) {
//       console.error("Error resuming playback:", playError);
//     }
//     return;
//   }

//   // If we reach here, we need to fetch new audio
//   console.log("Fetching TTS audio...");
//   this.isFetchingAudio = true; // Set lock
//   try {
//     const audioData = await this.fetchTtsAudio(text);
//     console.log("audioData size:", audioData.byteLength);
//     const audioBlob = new Blob([audioData], { type: 'audio/wav' });
//     const audioUrl = URL.createObjectURL(audioBlob);

//     if (this.audio) {
//       this.audio.pause();
//       this.audio = null;
//     }

//     this.audio = new Audio(audioUrl);
//     this.audio.addEventListener('ended', () => {
//       this.isPlaying = false;
//       URL.revokeObjectURL(audioUrl);
//       console.log("Playback ended.");
//     });

//     try {
//       await this.audio.play();
//       this.isPlaying = true;
//       console.log("Playback started.");
//     } catch (playError) {
//       console.error("Error starting playback:", playError);
//       // If playback doesn't start, clean up the audio object and URL
//       this.audio = null;
//       URL.revokeObjectURL(audioUrl);
//     }
//   } catch (error) {
//     console.error("Error during playback:", error);
//   } finally {
//     this.isFetchingAudio = false; // Release lock
//   }
// }

  
//   private async fetchTtsAudio(text: string): Promise<ArrayBuffer> {
//     const response = await fetch("http://localhost:5000/api/tts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text }) // matches TtsRequest now
//     });
  
//     if (!response.ok) {
//       throw new Error(`TTS API request failed with status ${response.status}`);
//     }
  
//     return response.arrayBuffer();
//   }

// }
