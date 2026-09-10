import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDesign } from './new-design';

describe('NewDesign', () => {
  let component: NewDesign;
  let fixture: ComponentFixture<NewDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDesign],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDesign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
