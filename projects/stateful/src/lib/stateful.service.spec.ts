import { TestBed } from '@angular/core/testing';

import { StatefulService } from './stateful.service';

describe('StatefulService', () => {
  let service: StatefulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatefulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
