import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonMoveChart } from './pokemon-move-chart';

describe('PokemonMoveChart', () => {
  let component: PokemonMoveChart;
  let fixture: ComponentFixture<PokemonMoveChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonMoveChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonMoveChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
