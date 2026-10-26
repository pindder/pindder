import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EarningsCard } from './earnings-card';

describe('EarningsCard', () => {
  let component: EarningsCard;
  let fixture: ComponentFixture<EarningsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarningsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EarningsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
