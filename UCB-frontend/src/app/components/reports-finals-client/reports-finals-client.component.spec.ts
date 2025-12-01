import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsFinalsClientComponent } from './reports-finals-client.component';

describe('ReportsFinalsClientComponent', () => {
  let component: ReportsFinalsClientComponent;
  let fixture: ComponentFixture<ReportsFinalsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsFinalsClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsFinalsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
