import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashBoardConfigComponent } from './dash-board-config.component';

describe('DashBoardConfigComponent', () => {
  let component: DashBoardConfigComponent;
  let fixture: ComponentFixture<DashBoardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashBoardConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashBoardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
