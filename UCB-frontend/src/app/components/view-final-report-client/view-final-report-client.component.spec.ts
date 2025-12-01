import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFinalReportClientComponent } from './view-final-report-client.component';

describe('ViewFinalReportClientComponent', () => {
  let component: ViewFinalReportClientComponent;
  let fixture: ComponentFixture<ViewFinalReportClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFinalReportClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFinalReportClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
