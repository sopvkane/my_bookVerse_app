// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainContentComponent } from './main-content/main-content.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthoringPageComponent } from './authoring-page/authoring-page.component';

const routes: Routes = [
  { path: '', component: MainContentComponent },
  { path: 'home', component: MainContentComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create', component: AuthoringPageComponent },
  // Wildcard route for a 404 page can be added here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
