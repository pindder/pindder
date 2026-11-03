import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Measurements } from './measurements';

describe('Measurements', () => {
  let component: Measurements;
  let fixture: ComponentFixture<Measurements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Measurements],
    }).compileComponents();

    fixture = TestBed.createComponent(Measurements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
