import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypageHeaderComponent } from './mypage-header.component';

describe('MypageHeaderComponent', () => {
  let component: MypageHeaderComponent;
  let fixture: ComponentFixture<MypageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
