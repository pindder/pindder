import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientSelection } from './client-selection';

describe('ClientSelection', () => {
  let component: ClientSelection;
  let fixture: ComponentFixture<ClientSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
