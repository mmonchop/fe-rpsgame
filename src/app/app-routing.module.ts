import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseGameModeComponent } from './pages/choose-game-mode/choose-game-mode.component';
import { GamePlayComponent } from './pages/game-play/game-play.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '', component: ChooseGameModeComponent,
  },
  {
    path: 'rooms', component: GameRoomComponent,
  },
  {
    path: 'play/rooms/:roomId/games/:gameNumber', component: GamePlayComponent,
  },
  {
    path: 'unauthorized', component: UnauthorizedComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
