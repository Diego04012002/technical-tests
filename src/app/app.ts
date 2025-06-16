import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonTypes } from "./components/pokemon-types/pokemon-types";
import { NavbarPokemon } from "./components/navbar-pokemon/navbar-pokemon";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PokemonTypes, NavbarPokemon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'pokeapi-test';
}
