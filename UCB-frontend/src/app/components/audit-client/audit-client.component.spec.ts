import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditClientComponent } from './audit-client.component';

describe('AuditClientComponent', () => {
  let component: AuditClientComponent;
  let fixture: ComponentFixture<AuditClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
