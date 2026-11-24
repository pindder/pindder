import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBrand } from './view-brand';

describe('ViewBrand', () => {
  let component: ViewBrand;
  let fixture: ComponentFixture<ViewBrand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBrand],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBrand);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
