import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

//angular material
import { MatSelectModule } from '@angular/material';

import { AppRoutingModule } from './app.routing';
// components
import { RootComponent } from './components/root/root.component';
import { HomeComponent } from './components/home/home.component';
// services
import { ApiService } from './services/api/api.service';
import { UtilsService } from './services/utils/utils.service';

@NgModule({
  exports: [
    MatSelectModule
  ]
})
export class AppMaterialModule {}

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppMaterialModule
  ],
  declarations: [
    RootComponent,
    HomeComponent
  ],
  providers: [ApiService, UtilsService],
  bootstrap: [RootComponent]
})
export class AppModule { }
