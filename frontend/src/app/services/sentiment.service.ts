import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SentimentService {
  analyzeSentiment(text: string): Observable<string> {
    const positiveWords = ['good', 'great', 'excellent', 'happy'];
    const negativeWords = ['bad', 'terrible', 'poor', 'sad'];

    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      if (positiveWords.includes(word)) {
        score += 1;
      } else if (negativeWords.includes(word)) {
        score -= 1;
      }
    });

    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    return of(sentiment).pipe(delay(0)); // Simulate async operation
  }
}
