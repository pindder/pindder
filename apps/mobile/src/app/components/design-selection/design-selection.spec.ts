import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignSelection } from './design-selection';

describe('DesignSelection', () => {
  let component: DesignSelection;
  let fixture: ComponentFixture<DesignSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
