import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsDashboardComponent } from './points-dashboard.component';

describe('PointsDashboardComponent', () => {
  let component: PointsDashboardComponent;
  let fixture: ComponentFixture<PointsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
