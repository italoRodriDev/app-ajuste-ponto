import { TestBed } from '@angular/core/testing';

import { GetPointService } from './get-point.service';

describe('GetPointService', () => {
  let service: GetPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
