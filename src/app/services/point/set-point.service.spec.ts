import { TestBed } from '@angular/core/testing';

import { SetPointService } from './set-point.service';

describe('SetPointService', () => {
  let service: SetPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
