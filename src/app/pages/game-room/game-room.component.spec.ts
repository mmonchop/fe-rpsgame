import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { GameRoomComponent } from './game-room.component';
import { RoomService } from 'src/app/services/room/room.service';
import { WebSocketApiService } from 'src/app/services/websocket-api.service';
import { AppModule } from 'src/app/app.module';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AppModule,
      ],
      declarations: [GameRoomComponent],
      providers: [
        { provide: DialogService, useClass: DialogService },
        { provide: RoomService, useClass: RoomService },
        { provide: WebSocketApiService, useClass: WebSocketApiService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
