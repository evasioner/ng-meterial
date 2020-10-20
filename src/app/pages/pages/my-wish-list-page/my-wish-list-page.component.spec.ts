import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWishListPageComponent } from './my-wish-list-page.component';

describe('MyWishListPageComponent', () => {
  let component: MyWishListPageComponent;
  let fixture: ComponentFixture<MyWishListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWishListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWishListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
