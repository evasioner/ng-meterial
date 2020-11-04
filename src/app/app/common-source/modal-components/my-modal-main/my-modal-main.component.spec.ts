import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalMainComponent } from './my-modal-main.component';

describe('MyModalMainComponent', () => {
  let component: MyModalMainComponent;
  let fixture: ComponentFixture<MyModalMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
