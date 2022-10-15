import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Room } from 'src/app/interfaces/room.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(
    private http: HttpClient
  ) {
  }

  doPlay(roomId: string, gameNumber: number, playerId: string, choice: string): Observable<Room> {
    const queryParams = new HttpParams()
    .set('roomId', roomId)
    .set('gameNumber', gameNumber)
    .set('playerId', playerId)
    .set('choice', choice);
    return this.http.post<Room>(`${environment.urlApi}/rooms/${roomId}/games/${gameNumber}/play`, {}, {
      params: queryParams,
    });
  }

  doStartNewGame(roomId: string, playerId: string): Observable<Room> {
    const queryParams = new HttpParams()
    .set('roomId', roomId)
    .set('playerId', playerId);
    return this.http.post<Room>(`${environment.urlApi}/rooms/${roomId}/games`, {}, {
      params: queryParams,
    });
  }

}
