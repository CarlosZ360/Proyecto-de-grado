import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFinalReportComponent } from './view-final-report.component';

describe('ViewFinalReportComponent', () => {
  let component: ViewFinalReportComponent;
  let fixture: ComponentFixture<ViewFinalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFinalReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFinalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
