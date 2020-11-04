import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMypageMainComponent } from './modal-mypage-main.component';

describe('ModalMypageMainComponent', () => {
  let component: ModalMypageMainComponent;
  let fixture: ComponentFixture<ModalMypageMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMypageMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMypageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
