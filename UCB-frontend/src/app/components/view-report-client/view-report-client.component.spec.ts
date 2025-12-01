import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReportClientComponent } from './view-report-client.component';

describe('ViewReportClientComponent', () => {
  let component: ViewReportClientComponent;
  let fixture: ComponentFixture<ViewReportClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReportClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewReportClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
