import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileageListComponent } from './mileage-list.component';

describe('MileageListComponent', () => {
  let component: MileageListComponent;
  let fixture: ComponentFixture<MileageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
