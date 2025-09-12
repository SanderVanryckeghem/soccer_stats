import { TestBed } from '@angular/core/testing';

import { AiSimulation } from './ai-simulation';

describe('AiSimulation', () => {
  let service: AiSimulation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiSimulation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
