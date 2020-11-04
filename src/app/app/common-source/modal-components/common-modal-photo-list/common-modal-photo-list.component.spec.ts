import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalPhotoListComponent } from './common-modal-photo-list.component';

describe('CommonModalPhotoListComponent', () => {
  let component: CommonModalPhotoListComponent;
  let fixture: ComponentFixture<CommonModalPhotoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonModalPhotoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalPhotoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
