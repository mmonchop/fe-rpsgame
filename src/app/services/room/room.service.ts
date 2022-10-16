import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GameMode, Room } from 'src/app/interfaces/room.interface';

const gameModes: GameMode[] = [
  { value: 'VS_MACHINE', text: 'game-modes.VS_MACHINE', icon: 'computer' },
  { value: 'VS_FRIEND', text: 'game-modes.VS_FRIEND' , icon: 'person' },
  { value: 'VS_RANDOM_PLAYER', text: 'game-modes.VS_RANDOM_PLAYER', icon: 'public' }
];


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient
  ) {
  }

  getGameModes() {
    return environment.security.scheme === 'oauth2' ? gameModes.filter(gameMode => gameMode.value === 'VS_MACHINE') : gameModes
  }

  getRoom(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${environment.urlApi}/rooms/${roomId}`, {
    });
  }

  createRoom(gameMode: string, firstPlayerName: string): Observable<Room> {
    const queryParams = new HttpParams()
    .set('gameMode', gameMode)
    .set('firstPlayerName', firstPlayerName);
    return this.http.post<Room>(`${environment.urlApi}/rooms`, {}, {
      params: queryParams,
    });
  }

  acceptRoomInvitation(roomId: string, secondPlayerName: string): Observable<Room> {
    const queryParams = new HttpParams()
      .set('roomId', roomId)
      .set('secondPlayerName', secondPlayerName);
    return this.http.post<Room>(`${environment.urlApi}/rooms/${roomId}/accept-invite`, {}, {
      params: queryParams,
    });
  }  
}
