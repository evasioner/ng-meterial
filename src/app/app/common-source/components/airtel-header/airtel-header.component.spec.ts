import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelHeaderComponent } from './airtel-header.component';

describe('AirtelHeaderComponent', () => {
  let component: AirtelHeaderComponent;
  let fixture: ComponentFixture<AirtelHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
