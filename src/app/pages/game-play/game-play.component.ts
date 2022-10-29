import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GameMode, Player, Room, RoundTurn } from 'src/app/interfaces/room.interface';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { PlayService } from 'src/app/services/play/play.service';
import { RoomService } from 'src/app/services/room/room.service';
import { WebSocketApiService } from 'src/app/services/websocket-api.service';

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

  room!: Room
  player!: Player
  leftSidePlayer!: Player;
  rightSidePlayer!: Player;

  choices!: any[]
  opponentChoice!: any
  gameMode!: GameMode
  gameModes: GameMode[] = this.roomService.getGameModes()
  currentRound: number = 1

  gameWinner: string = ''
  roundWinner: string = ''
  leftSidePlayerScore!: number;
  rightSidePlayerScore!: number;

  gamePlayForm!: FormGroup;

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(
    public roomService: RoomService,
    public playService: PlayService,
    public dialogService: DialogService,
    private activatedRouter: ActivatedRoute,
    private translateService: TranslateService,
    private websocketApiService: WebSocketApiService,
    private router: Router,
  ) {
    this.initChoices()
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      var roomId = params['roomId']
      this.getRoom(roomId)
      var topic = `/topic/rooms/${roomId}`
      this.websocketApiService.connect(topic, roomId, (event: any) => this.onMessageReceived(event));
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler($event: any) {
    var topic = `/app/rooms/${this.room.id}/publish`
    var notificationEvent = `{"id": "${this.room.id}", "type": "GAME_CLOSED", "data": {"playerId": "${this.leftSidePlayer.id}"}}`
    this.websocketApiService.send(topic, notificationEvent)
  }

  initChoices(): void {
    this.choices = [{ value: 'ROCK', visible: true}, { value: 'PAPER', visible: true}, { value: 'SCISSORS', visible: true}]
    this.opponentChoice = { value: 'blank', visible: true }
  }

  getRoom(roomId: string): void {
    this.roomService.getRoom(roomId)
    .pipe(
      catchError(err => {
          this.dialogService.openDialogError(err);
          return throwError(err);
      })
    ).subscribe((room: Room) => {
      this.activatedRouter.queryParams.subscribe(params => {
        this.player = [room.firstPlayer, room.secondPlayer].find(player => player.id == params['playerId'])!
      })  
      this.onRoomObtained(room)
    })
  }

  onRoomObtained(room: Room, doNextRound: boolean = false): void {
    this.room = room
    this.gameMode = this.gameModes.find(gameMode => room.mode == gameMode.value)!
    this.currentRound = this.room.currentGame.lastRound !== undefined && this.room.currentGame.lastRound !== null ? this.room.currentGame.lastRound.roundNumber : 1

    var isFirstPlayer = this.room.firstPlayer.id == this.player.id
    this.leftSidePlayer = [this.room.firstPlayer, this.room.secondPlayer].find(player => player?.id == this.player.id)!
    this.rightSidePlayer = [this.room.firstPlayer, this.room.secondPlayer].find(player => player?.id !== this.player.id)!
    this.leftSidePlayerScore = isFirstPlayer ? this.room.currentGame.scoreFirstPlayer : this.room.currentGame.scoreSecondPlayer
    this.rightSidePlayerScore = isFirstPlayer ? this.room.currentGame.scoreSecondPlayer : this.room.currentGame.scoreFirstPlayer
    this.createForm();
    this.showOrHidePlayerChoices()
    this.setWinner();
    if (doNextRound) {
      this.doNextRound()
    }
  }

  showOrHidePlayerChoices(): void {
    if (this.currentRoundIsOverOrTie()) {
      var opponentChoice = this.getLastPlayerRoundTurn(this.rightSidePlayer.id).choice
      this.opponentChoice = { value: opponentChoice, visible: true, height: 150 }
    }
    if (!this.currentRoundIsOver() && this.opponentPlayedTurn()) {
      this.opponentChoice = { value: 'ok', visible: true, height: 100 }
    }
    if (this.currentRoundIsOverOrTie() || this.youPlayedTurn()) {
      this.hidePlayer1NonSelectedChoices(this.getLastPlayerRoundTurn(this.player.id).choice) 
    }
    if (this.currentRoundIsOverOrTie() && !this.currentGameIsOver()) {
      setTimeout(() => { 
        this.doNextRound()
      }, 4000)
    }
  }

  createForm(): void {
    this.gamePlayForm = new FormGroup({
      gameMode: new FormControl({ value: this.gameMode, disabled: true }, Validators.required),
    });
  }

  doPlay(event: any): void {
    if (!this.youPlayedTurn()) {
      this.playService.doPlay(this.room.id, this.room.currentGame.gameNumber, this.player.id, event)
      .pipe(
        catchError(err => {
            this.dialogService.openDialogError(err);
            return throwError(err);
        })
      ).subscribe((room: Room) => {
        this.onRoomObtained(room)
      })
    }
  }

  doStartNewGame(): void {
    if (this.currentGameIsOver()) {
      this.playService.doStartNewGame(this.room.id, this.player.id)
      .pipe(
        catchError(err => {
            this.dialogService.openDialogError(err);
            return throwError(err);
        })
      ).subscribe((room: Room) => {
        this.onRoomObtained(room, true)
      })
    }
  }

  hidePlayer1NonSelectedChoices(choiceSelected: string) {
    this.choices
      .filter(choice => choice.value !== choiceSelected)
      .forEach(choice => choice.visible = false)
  }

  getLastPlayerRoundTurn(playerId: string): RoundTurn {
    var playerGameTurns = this.room.currentGame.lastRound.roundTurns.filter(roundTurn => roundTurn.playerId == playerId)
    return playerGameTurns[playerGameTurns.length - 1]
  }

  setWinner(): void {
    if (this.currentRoundIsTie()) {
      this.roundWinner = this.translateService.instant('game-play.round-tie')
    } else if (this.currentRoundIsOver()) {
      this.roundWinner = this.room.currentGame.lastRound.winnerName + this.translateService.instant('game-play.wins-round')
    } 
    if (this.currentGameIsOver()) {
      this.gameWinner = this.room.currentGame.winnerName +  this.translateService.instant('game-play.wins-game')
    }
  }

  doNextRound(): void {
    this.initChoices()
    this.roundWinner = ''
    if (this.currentRoundIsOver()) {
      this.currentRound++
    }
  }

  onMessageReceived(event: any) {
    const message = JSON.parse(event.body);
    var playerId = message.data.PlayerId
    if (message.type === 'GAME_CLOSED') {
      this.dialogService.openDialog({message: this.rightSidePlayer.name + this.translateService.instant('game-play.left-game')})
      this.router.navigate([''])
    } else if (playerId === this.rightSidePlayer.id) {
      this.onRoomObtained(message.data.RoomDto, message.type === 'NEW_GAME_CREATED')
    }
  }

  youPlayedTurn(): boolean {
    return this.leftSidePlayer.playerState === 'WAITING' 
  }

  opponentPlayedTurn(): boolean {
    return this.rightSidePlayer.playerState === 'WAITING'
  }

  currentRoundIsOverOrTie(): boolean {
    return this.currentRoundIsOver() || this.currentRoundIsTie()
  }

  currentRoundIsOver(): boolean {
    return this.room.currentGame.lastRound?.state === 'OVER'
  }

  currentRoundIsTie(): boolean {
    return this.room.currentGame.lastRound?.tie === true
  }

  currentGameIsOver(): boolean {
    return this.room.currentGame.state === 'OVER'
  }

  noTurnsPlayed(): boolean {
    return this.room.currentGame.lastRound?.roundTurns.length == 0
  }

}
