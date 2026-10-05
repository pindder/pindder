import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Specification } from './specification';

describe('Specification', () => {
  let component: Specification;
  let fixture: ComponentFixture<Specification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Specification],
    }).compileComponents();

    fixture = TestBed.createComponent(Specification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
