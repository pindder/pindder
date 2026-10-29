import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewAddress } from './new-address';

describe('NewAddress', () => {
  let component: NewAddress;
  let fixture: ComponentFixture<NewAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAddress],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAddress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
