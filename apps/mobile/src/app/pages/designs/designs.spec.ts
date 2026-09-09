import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Designs } from './designs';

describe('Designs', () => {
  let component: Designs;
  let fixture: ComponentFixture<Designs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Designs],
    }).compileComponents();

    fixture = TestBed.createComponent(Designs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
