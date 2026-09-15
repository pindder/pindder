import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCard } from './list-card';

describe('ListCard', () => {
  let component: ListCard;
  let fixture: ComponentFixture<ListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
