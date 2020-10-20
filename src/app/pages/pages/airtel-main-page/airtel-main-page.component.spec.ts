import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelMainPageComponent } from './airtel-main-page.component';

describe('AirtelMainPageComponent', () => {
  let component: AirtelMainPageComponent;
  let fixture: ComponentFixture<AirtelMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
