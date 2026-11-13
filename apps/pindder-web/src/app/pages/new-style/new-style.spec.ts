import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewStyle } from './new-style';

describe('NewStyle', () => {
  let component: NewStyle;
  let fixture: ComponentFixture<NewStyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStyle],
    }).compileComponents();

    fixture = TestBed.createComponent(NewStyle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
