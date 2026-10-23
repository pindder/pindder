import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTailor } from './view-tailor';

describe('ViewTailor', () => {
  let component: ViewTailor;
  let fixture: ComponentFixture<ViewTailor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTailor],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTailor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
