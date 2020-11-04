import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceWifiListComponent } from './travel-convenience-wifi-list.component';

describe('TravelConvenienceWifiListComponent', () => {
  let component: TravelConvenienceWifiListComponent;
  let fixture: ComponentFixture<TravelConvenienceWifiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceWifiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceWifiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
