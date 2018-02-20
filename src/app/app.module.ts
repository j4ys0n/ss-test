import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app.routing';
// components
import { RootComponent } from './components/root/root.component';
import { HomeComponent } from './components/home/home.component';
// services
import { ApiService } from './services/api/api.service';


@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpModule
  ],
  declarations: [
    RootComponent,
    HomeComponent
  ],
  providers: [ApiService],
  bootstrap: [RootComponent]
})
export class AppModule { }
