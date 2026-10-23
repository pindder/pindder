import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tailor } from './tailor';

describe('Tailor', () => {
  let component: Tailor;
  let fixture: ComponentFixture<Tailor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tailor],
    }).compileComponents();

    fixture = TestBed.createComponent(Tailor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
