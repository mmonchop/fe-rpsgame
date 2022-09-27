import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RoomService } from './room.service';

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    roomService = TestBed.inject(RoomService);
  });

  it('should be created', () => {
    expect(roomService).toBeTruthy();
  });
});

