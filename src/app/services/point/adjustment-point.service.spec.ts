import { TestBed } from '@angular/core/testing';

import { AdjustmentPointService } from './adjustment-point.service';

describe('AdjustmentPointService', () => {
  let service: AdjustmentPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjustmentPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
