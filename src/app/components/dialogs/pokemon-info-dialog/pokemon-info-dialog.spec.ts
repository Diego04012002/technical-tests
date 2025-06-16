import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonInfoDialog } from './pokemon-info-dialog';

describe('PokemonInfoDialog', () => {
  let component: PokemonInfoDialog;
  let fixture: ComponentFixture<PokemonInfoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonInfoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonInfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
