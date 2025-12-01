import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsClientComponent } from './reports-client.component';

describe('ReportsClientComponent', () => {
  let component: ReportsClientComponent;
  let fixture: ComponentFixture<ReportsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
