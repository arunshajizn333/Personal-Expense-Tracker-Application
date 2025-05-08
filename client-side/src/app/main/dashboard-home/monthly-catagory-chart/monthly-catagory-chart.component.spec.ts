import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCatagoryChartComponent } from './monthly-catagory-chart.component';

describe('MonthlyCatagoryChartComponent', () => {
  let component: MonthlyCatagoryChartComponent;
  let fixture: ComponentFixture<MonthlyCatagoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyCatagoryChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCatagoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
