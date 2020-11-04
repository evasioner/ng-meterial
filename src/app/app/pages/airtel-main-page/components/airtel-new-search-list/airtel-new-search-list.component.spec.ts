import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelNewSearchListComponent } from './airtel-new-search-list.component';

describe('AirtelNewSearchListComponent', () => {
  let component: AirtelNewSearchListComponent;
  let fixture: ComponentFixture<AirtelNewSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelNewSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelNewSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
