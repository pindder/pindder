import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrderButton } from './create-order-button';

describe('CreateOrderButton', () => {
  let component: CreateOrderButton;
  let fixture: ComponentFixture<CreateOrderButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrderButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrderButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
