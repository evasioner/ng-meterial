import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleMainPageComponent } from './bundle-main-page.component';

describe('BundleMainPageComponent', () => {
  let component: BundleMainPageComponent;
  let fixture: ComponentFixture<BundleMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
