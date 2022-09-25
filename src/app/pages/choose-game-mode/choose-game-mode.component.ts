import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GameMode, Room } from 'src/app/interfaces/room.interface';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-choose-game-mode',
  templateUrl: './choose-game-mode.component.html',
  styleUrls: ['./choose-game-mode.component.scss']
})
export class ChooseGameModeComponent implements OnInit {

  firstPlayerName: string = '';
  gameModes: GameMode[] = this.roomService.getGameModes()
  gameMode: GameMode = this.gameModes[0];
  chooseGameModeForm!: FormGroup;


  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(
    public roomService: RoomService,
    public dialogService: DialogService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.chooseGameModeForm = new FormGroup({
      gameMode: new FormControl(this.gameMode || '', Validators.required),
      firstPlayerName: new FormControl(this.firstPlayerName || '', Validators.required),
    });
  }

  createRoom(): void {
    if (this.chooseGameModeForm.valid) {
      this.roomService.createRoom(
        this.chooseGameModeForm?.value.gameMode.value, 
        this.chooseGameModeForm?.value.firstPlayerName)
      .pipe(
        catchError(err => {
            this.dialogService.openDialogError(err);
            return throwError(err);
        })
      ).subscribe((room: Room) => {
        this.router.navigateByUrl('/rooms?roomId=' + room.id + '&playerId=' + this.getPlayerId(room));
      })    
    }
  }

  getPlayerId(room: Room): string {
    if (this.gameMode.value === 'VS_RANDOM_PLAYER') {
      return [room.firstPlayer, room.secondPlayer].find(player => player?.name === this.chooseGameModeForm.controls['firstPlayerName'].value)?.id!
    } else {
      return room.firstPlayer.id
    }
  }

}
