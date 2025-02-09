import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsConversionComponentComponent } from './points-conversion-component.component';

describe('PointsConversionComponentComponent', () => {
  let component: PointsConversionComponentComponent;
  let fixture: ComponentFixture<PointsConversionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsConversionComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsConversionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
