import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PokemonRequest } from '../../services/pokemon-request';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PokemonTypeButton } from '../pokemon-type-button/pokemon-type-button';
import { CommonModule } from '@angular/common';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import {
  MatDialog,
} from '@angular/material/dialog';
import { PokemonInfoDialog } from '../dialogs/pokemon-info-dialog/pokemon-info-dialog';
import { MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { PokemonCompareStats } from '../dialogs/pokemon-compare-stats/pokemon-compare-stats';
import { PokemonCompareMoveDialog } from '../dialogs/pokemon-compare-move-dialog/pokemon-compare-move-dialog';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    PokemonTypeButton,
    CommonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonList implements OnChanges, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  @Input() typeSelected!: Type;
  @Output() selectedType = new EventEmitter<Type>();

  pokemonService = inject(PokemonRequest);
  readonly dialog = inject(MatDialog);

  pokemonListAll: PokemonSlot[] = [];
  pokemonListScroll: PokemonSlot[] = [];
  pokemonDetailsList = new MatTableDataSource();
  pokemonsToCompare:Pokemon[]=[]
  preferPokemon!:Pokemon
  displayColumns: string[] = ['ID', 'Name', 'Type', 'Height', 'Action'];
  eventSort!: Sort;

  offset: number = 0;
  limit: number = 0;
  loading: boolean = false;
  initialBatch: number = 15;
  batchSize: number = 4;
  noMorePokemon: boolean = false;
  hasNoPokemon: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeSelected'] && changes['typeSelected'].currentValue) {
      this.getPokemonsByTpe(this.typeSelected.url, true);
    }
  }

  ngAfterViewInit() {
    this.pokemonDetailsList.sort = this.sort;
  }

  
  getPokemonsByTpe(urlType: string, reset: boolean, preferPokemon?: Pokemon) {
    if(preferPokemon){
      this.preferPokemon=preferPokemon
    }
    this.pokemonsToCompare=[]
    this.pokemonService.getPokemonsByType(urlType).subscribe((data: {pokemon:PokemonSlot[]}) => {
      if (reset) {
        this.noMorePokemon = false;
        this.hasNoPokemon = false;
        this.pokemonListScroll = [];
        this.pokemonDetailsList.data = [];
        this.offset = 0;
      }
      this.pokemonListAll = data.pokemon;
      this.hasNoPokemon = data.pokemon.length == 0;
      this.limit = this.pokemonListAll.length;
      if (preferPokemon) {
        const index=this.pokemonListAll.findIndex((pokemon:PokemonSlot)=>pokemon.pokemon.name==preferPokemon.name)
        const object=this.pokemonListAll.find(pokemon=>pokemon.pokemon.name==preferPokemon.name)
        if (index !== -1 && object) {
          this.pokemonListAll.splice(index, 1);
          this.pokemonListAll.unshift(object);
        }
      }

      this.loadMorePokemons();
    });
  }

  loadMorePokemons() {
    if (
      this.pokemonListScroll.length >= this.limit ||
      this.offset >= this.pokemonListAll.length
    ) {
      if (this.pokemonListAll.length > 0) {
        this.noMorePokemon = true;
      }
      return;
    }
    let count =
      this.pokemonListScroll.length === 0 ? this.initialBatch : this.batchSize;
    const remaining = this.limit - this.pokemonListScroll.length;
    count = Math.min(count, remaining);
    const nextPokemons = this.pokemonListAll.slice(
      this.offset,
      this.offset + count
    );
    this.pokemonListScroll = [...this.pokemonListScroll, ...nextPokemons];
    this.offset += nextPokemons.length;
    const detailObservables = nextPokemons.map((pokemon: PokemonSlot) =>
      this.pokemonService.getPokemonDetails(pokemon.pokemon.url)
    );

    forkJoin(detailObservables).subscribe((data:Pokemon[]) => {
      this.pokemonDetailsList.data = [...this.pokemonDetailsList.data, ...data];
      if (this.eventSort) {
        this.sortTable(this.eventSort);
      }
    });
  }

  openInfoPokemonModal(pokemon: Pokemon) {
    const dialogRef = this.dialog.open(PokemonInfoDialog, {
      data: pokemon,
      minWidth:"600px",
      maxWidth:"1300px",
      height:"740px",
    });

    dialogRef.afterClosed().subscribe((result:{typeOption:Type, pokemon:Pokemon}) => {
      if(result){
        this.selectedType.emit(result.typeOption)
        this.getPokemonsByTpe(result.typeOption.url, true, result.pokemon)
      }
    });
  }

  selectedPokemonToCompare(event:MatCheckboxChange,element:Pokemon){
    if(event.checked){
      this.pokemonsToCompare.push(element)
    }else{
      const index = this.pokemonsToCompare.findIndex((pokemon:Pokemon) => pokemon.name === element.name);
      if (index !== -1) {
        this.pokemonsToCompare.splice(index, 1);
      }
    }
  }

  openDialogToCompareStats(){
    const dialogRef = this.dialog.open(PokemonCompareStats, {
      data: this.pokemonsToCompare,
      minWidth:"600px",
      maxWidth:"1300px",
      height:"660px",
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  openDialogToCompareMove(){
    const dialogRef = this.dialog.open(PokemonCompareMoveDialog, {
      minWidth:"600px",
      maxWidth:"1300px",
      height:"740px",
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  isCheckboxDisabled(element: Pokemon): boolean {
    if (this.pokemonsToCompare.length < 2) {
      return false;
    }
    return !this.pokemonsToCompare.some((pokemon:Pokemon) => pokemon.name === element.name);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 100;
    const position = window.innerHeight + window.scrollY;
    const height = document.documentElement.scrollHeight;
    if (height - position <= threshold && !this.loading) {
      this.loading = true;
      setTimeout(() => {
        this.loadMorePokemons();
        this.loading = false;
      }, 200);
    }
  }

  announceSortChange(event: Sort) {
    if (!event.active || !event.direction) return;
    this.eventSort = event;
    this.sortTable(this.eventSort);
  }

  sortTable(event: Sort) {
    this.pokemonDetailsList.data = ([...this.pokemonDetailsList.data] as Pokemon[]).sort(
      (a: Pokemon, b: Pokemon) => {
        let valorA = (a as any)[event.active];
        let valorB = (b as any)[event.active];

        if (event.active === 'Height') {
          valorA = Number(a.height);
          valorB = Number(b.height);
        }

        if (valorA < valorB) return event.direction === 'asc' ? -1 : 1;
        if (valorA > valorB) return event.direction === 'asc' ? 1 : -1;
        return 0;
      }
    );
  }
}
