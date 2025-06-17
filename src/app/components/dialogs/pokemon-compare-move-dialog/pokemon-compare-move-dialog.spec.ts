import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCompareMoveDialog } from './pokemon-compare-move-dialog';

describe('PokemonCompareMoveDialog', () => {
  let component: PokemonCompareMoveDialog;
  let fixture: ComponentFixture<PokemonCompareMoveDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCompareMoveDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCompareMoveDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
