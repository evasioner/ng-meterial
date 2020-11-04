import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelHotListComponent } from './airtel-hot-list.component';

describe('AirtelHotListComponent', () => {
  let component: AirtelHotListComponent;
  let fixture: ComponentFixture<AirtelHotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelHotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelHotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
