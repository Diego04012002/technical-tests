import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPokemon } from './navbar-pokemon';

describe('NavbarPokemon', () => {
  let component: NavbarPokemon;
  let fixture: ComponentFixture<NavbarPokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPokemon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPokemon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
