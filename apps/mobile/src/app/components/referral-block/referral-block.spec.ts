import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferralBlock } from './referral-block';

describe('ReferralBlock', () => {
  let component: ReferralBlock;
  let fixture: ComponentFixture<ReferralBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
