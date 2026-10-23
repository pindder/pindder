import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPayment } from './view-payment';

describe('ViewPayment', () => {
  let component: ViewPayment;
  let fixture: ComponentFixture<ViewPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
