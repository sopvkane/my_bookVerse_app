// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ControlsComponent } from './controls/controls.component';
import { SoundscapeComponent } from './soundscape/soundscape.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthoringPageComponent } from './authoring-page/authoring-page.component';
import { AiImageDialogComponent } from './ai-image-dialog/ai-image-dialog.component';

// Services
import { BookService } from './services/book.service';
import { SelectedBookService } from './services/selected-book.service';
import { VolumeService } from './services/volume.service';
import { SoundscapeService } from './services/soundscape.service';
import { LoggingService } from './services/logging.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { SentimentService } from './services/sentiment.service';
import { TtsService } from './services/tts.service';
import { ImageGenerationService } from './services/image-generation.service';
// Note: VoiceService is providedIn: 'root' and doesn't need to be added here

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainContentComponent,
    ControlsComponent,
    SoundscapeComponent,
    ProfileComponent,
    AuthoringPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    BookService,
    SelectedBookService,
    VolumeService,
    SoundscapeService,
    LoggingService,
    AuthService,
    UserService,
    SentimentService,
    ImageGenerationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
