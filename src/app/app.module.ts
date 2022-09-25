import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogOverviewComponent } from './components/dialog-overview/dialog-overview.component';
import { ChooseGameModeComponent } from './pages/choose-game-mode/choose-game-mode.component';
import { HeaderComponent } from './components/header/header.component';
import { DialogService } from './services/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './components/material/material.module';
import { GameRoomComponent } from './pages/game-room/game-room.component';
import { RoomService } from './services/room/room.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GamePlayComponent } from './pages/game-play/game-play.component';
import { WebSocketApiService } from './services/websocket-api.service';
import { PlayService } from './services/play/play.service';
import { BarRatingModule } from 'ngx-bar-rating';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    DialogOverviewComponent,
    ChooseGameModeComponent,
    GameRoomComponent,
    GamePlayComponent,
    HeaderComponent,
  ],
  imports: [
    AppRoutingModule,

    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
  
    MaterialModule,

    ReactiveFormsModule,
    ClipboardModule,
    BarRatingModule,

    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),

  ],
  providers: [DialogService, RoomService, PlayService, WebSocketApiService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

