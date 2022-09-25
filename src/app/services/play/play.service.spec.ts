import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayService } from './play.service';

describe('PlayService', () => {
  let roomService: PlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    roomService = TestBed.inject(PlayService);
  });

  it('should be created', () => {
    expect(roomService).toBeTruthy();
  });
});

