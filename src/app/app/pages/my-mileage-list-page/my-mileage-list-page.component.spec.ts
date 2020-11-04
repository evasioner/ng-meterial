import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMileageListPageComponent } from './my-mileage-list-page.component';

describe('MyMileageListPageComponent', () => {
  let component: MyMileageListPageComponent;
  let fixture: ComponentFixture<MyMileageListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMileageListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMileageListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
