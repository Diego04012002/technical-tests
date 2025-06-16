import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypeButton } from './pokemon-type-button';

describe('PokemonTypeButton', () => {
  let component: PokemonTypeButton;
  let fixture: ComponentFixture<PokemonTypeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTypeButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonTypeButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
