import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChooseGameModeComponent } from './choose-game-mode.component';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { RoomService } from 'src/app/services/room/room.service';

fdescribe('ChooseGameModeComponent', () => {
  let component: ChooseGameModeComponent;
  let fixture: ComponentFixture<ChooseGameModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ChooseGameModeComponent],
      providers: [
        {
          DialogService,
          RoomService,
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseGameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

});
