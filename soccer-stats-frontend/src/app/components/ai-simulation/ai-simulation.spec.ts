import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSimulation } from './ai-simulation';

describe('AiSimulation', () => {
  let component: AiSimulation;
  let fixture: ComponentFixture<AiSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSimulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSimulation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
