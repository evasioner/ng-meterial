import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalActivityBookerModifyComponent } from './my-modal-activity-booker-modify.component';

describe('MyModalActivityBookerModifyComponent', () => {
  let component: MyModalActivityBookerModifyComponent;
  let fixture: ComponentFixture<MyModalActivityBookerModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalActivityBookerModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalActivityBookerModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
