import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMomentComponent } from './ngx-moment.component';

describe('NgxMomentComponent', () => {
  let component: NgxMomentComponent;
  let fixture: ComponentFixture<NgxMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
