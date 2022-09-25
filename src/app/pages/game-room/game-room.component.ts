import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GameMode, Room } from 'src/app/interfaces/room.interface';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from 'src/app/services/room/room.service';
import { ClipboardService } from 'ngx-clipboard';
import { WebSocketApiService } from 'src/app/services/websocket-api.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {

  room!: Room
  roomInvitationUrl: string = ''
  roomUrlCopied: boolean = false;
  acceptRoomInvitationForm!: FormGroup;

  playerId: string = '';
  secondPlayerName: string = '';
  isSecondPlayer: boolean = false;
  gameMode!: GameMode
  gameModes: GameMode[] = this.roomService.getGameModes()

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(
    private router: Router,
    private roomService: RoomService,
    private dialogService: DialogService,
    private activatedRouter: ActivatedRoute,
    private clipboardService: ClipboardService,
    private websocketApiService: WebSocketApiService
  ) {
  }

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(params => {
      this.playerId = params['playerId']
      this.isSecondPlayer = params['isSecondPlayer']
      this.roomInvitationUrl = window.location.origin + `/rooms?roomId=${params['roomId']}&isSecondPlayer=true`
      this.getRoom(params['roomId'])
    });
  }

  getRoom(roomId: string): void {
    this.roomService.getRoom(roomId)
    .pipe(
      catchError(err => {
          this.dialogService.openDialogError(err);
          return throwError(err);
      })
    ).subscribe((room: Room) => {
      this.onRoomObtained(room)
    })
  }

  onRoomObtained(room: Room) {
    this.room = room
    this.secondPlayerName = this.room.secondPlayer?.name
    this.gameMode = this.gameModes.find(gameMode => room.mode == gameMode.value)!
    var topic = `/topic/rooms/${room.id}`
    if (this.roomSecondPlayerJoined()) {
      this.goToGamePlayPage()
    } else {
      this.createForm();
      this.websocketApiService.connect(topic, room.id, (event: any) => this.onMessageReceived(event));
    }
  }

  createForm() {
    this.acceptRoomInvitationForm = new FormGroup({
      gameMode: new FormControl({value: this.gameMode, disabled: true}, Validators.required),
      roomInvitationUrl: new FormControl({value: this.roomInvitationUrl, disabled: true}, Validators.required),
      firstPlayerName: new FormControl({value: this.room.firstPlayer?.name, disabled: true}, Validators.required),
      secondPlayerName: new FormControl({value: this.secondPlayerName, disabled: this.roomSecondPlayerJoined()}, Validators.required),
    });
  }

  acceptRoomInvitation(): void {
    if (this.acceptRoomInvitationForm.valid) {
      this.roomService.acceptRoomInvitation(this.room.id, this.acceptRoomInvitationForm?.value.secondPlayerName)
      .pipe(
        catchError(err => {
            this.dialogService.openDialogError(err);
            return throwError(err);
        })
      ).subscribe((room: Room) => {
        this.room = room
        this.goToGamePlayPage()
      })    
    }
  }

  copyRoomInviationUrl() {
    this.roomUrlCopied = true
    this.clipboardService.copy(this.roomInvitationUrl)
  }

  goToGamePlayPage() {
    this.router.navigateByUrl('/play/rooms/' + this.room.id + '/games/' + this.room.currentGame.gameNumber + "?playerId=" + this.getPlayerId());
  }

  getPlayerId(): string {
    if (this.gameMode.value === 'VS_FRIEND') {
      return this.isSecondPlayer ? this.room.secondPlayer.id : this.room.firstPlayer.id
    } else {
      return [this.room.firstPlayer, this.room.secondPlayer].find(player => player?.id == this.playerId)?.id!
    }
  } 

  roomSecondPlayerJoined(): boolean {
    return this.room.secondPlayer !== null && this.room.secondPlayer !== undefined
  }

  showWaitingOponentSpinner(): boolean {
    return (this.gameMode.value === 'VS_FRIEND' && this.roomUrlCopied) ||
      (this.gameMode.value === 'VS_RANDOM_PLAYER' && !this.roomSecondPlayerJoined())
  }

  onMessageReceived(event: any) {
    const message = JSON.parse(event.body);
    this.onRoomObtained(message.data.RoomDto)
  }

}
