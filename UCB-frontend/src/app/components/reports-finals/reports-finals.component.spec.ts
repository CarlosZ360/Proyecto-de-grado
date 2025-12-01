import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsFinalsComponent } from './reports-finals.component';

describe('ReportsFinalsComponent', () => {
  let component: ReportsFinalsComponent;
  let fixture: ComponentFixture<ReportsFinalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsFinalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsFinalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
