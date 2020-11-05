import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQnaComponent } from './product-qna.component';

describe('ProductQnaComponent', () => {
  let component: ProductQnaComponent;
  let fixture: ComponentFixture<ProductQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
