import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypes } from './pokemon-types';

describe('PokemonTypes', () => {
  let component: PokemonTypes;
  let fixture: ComponentFixture<PokemonTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
