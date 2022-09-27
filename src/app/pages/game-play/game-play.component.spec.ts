import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { RoomService } from 'src/app/services/room/room.service';
import { AppModule } from 'src/app/app.module';
import { GamePlayComponent } from './game-play.component';
import { WebSocketApiService } from 'src/app/services/websocket-api.service';
import { PlayService } from 'src/app/services/play/play.service';

describe('GamePlayComponent', () => {
  let component: GamePlayComponent;
  let fixture: ComponentFixture<GamePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AppModule,
      ],
      declarations: [GamePlayComponent],
      providers: [
        { provide: DialogService, useClass: DialogService },
        { provide: RoomService, useClass: RoomService },
        { provide: PlayService, useClass: PlayService },
        { provide: WebSocketApiService, useClass: WebSocketApiService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
