import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageGenerationService {
  private endpoint = environment.AZURE_IMAGE_ENDPOINT;
  private apiKey = environment.AZURE_IMAGE_API_KEY;

  constructor(private http: HttpClient) {}

  generateImage(prompt: string): Observable<{ imageUrl: string }> {
    const body = { prompt, n: 1, size: '1024x1024' };

    return this.http.post<{ data: { url: string }[] }>(this.endpoint, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      }),
    }).pipe(
      map(response => {
        if (response.data && response.data.length > 0) {
          return { imageUrl: response.data[0].url };
        } else {
          throw new Error('No image URL returned from API.');
        }
      })
    );
  }

  generateIllustration(prompt: string): Observable<{ imageUrl: string }> {
    return this.generateImage(prompt);
  }
}
