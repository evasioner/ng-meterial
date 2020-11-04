import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalPhotoDetailComponent } from './common-modal-photo-detail.component';

describe('CommonModalPhotoDetailComponent', () => {
  let component: CommonModalPhotoDetailComponent;
  let fixture: ComponentFixture<CommonModalPhotoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonModalPhotoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalPhotoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
