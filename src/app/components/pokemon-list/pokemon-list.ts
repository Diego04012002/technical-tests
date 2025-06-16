import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  Input,
  OnChanges,
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
import { debounceTime, forkJoin } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PokemonInfoDialog } from '../dialogs/pokemon-info-dialog/pokemon-info-dialog';
import {MatCheckbox, MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';

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

  pokemonService = inject(PokemonRequest);
  readonly dialog = inject(MatDialog);

  pokemonListAll: any[] = [];
  pokemonListScroll: PokemonDefault[] = [];
  pokemonDetailsList = new MatTableDataSource();
  pokemonsToCompare:any[]=[]
  preferPokemon:any
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

  
  getPokemonsByTpe(urlType: string, reset: boolean, preferPokemon?: any) {
    this.preferPokemon=preferPokemon
    this.pokemonsToCompare=[]
    this.pokemonService.getPokemonsByType(urlType).subscribe((data: any) => {
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
      if (this.preferPokemon) {
        const index=this.pokemonListAll.findIndex(pokemon=>pokemon.pokemon.name==preferPokemon.name)
        const object=this.pokemonListAll.find(pokemon=>pokemon.pokemon.name==preferPokemon.name)
        if (index !== -1) {
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
    const detailObservables = nextPokemons.map((pokemon: any) =>
      this.pokemonService.getPokemonDetails(pokemon.pokemon.url)
    );

    forkJoin(detailObservables).subscribe((data) => {
      this.pokemonDetailsList.data = [...this.pokemonDetailsList.data, ...data];
      if (this.eventSort) {
        this.sortTable(this.eventSort);
      }
    });
  }

  getPokemonDetails(pokemon: any) {
    this.pokemonService
      .getPokemonDetails(pokemon.pokemon.url)
      .subscribe((data) => {
        setTimeout(() => {
          this.pokemonDetailsList.data = [
            ...this.pokemonDetailsList.data,
            data,
          ];
        }, 1000);
      });
  }

  openInfoPokemonModal(pokemon: any) {
    const dialogRef = this.dialog.open(PokemonInfoDialog, {
      data: pokemon,
      minWidth:"600px",
      maxWidth:"1300px",
      height:"730px",
    });

    dialogRef.afterClosed().subscribe((result:{typeOption:Type, pokemon:any}) => {
      if(result){
        this.getPokemonsByTpe(result.typeOption.url, true, result.pokemon)
      }
    });
  }

  selectedPokemonToCompare(event:MatCheckboxChange,element:any){
    if(event.checked){
      this.pokemonsToCompare.push(element)
    }else{
      const index = this.pokemonsToCompare.findIndex(pokemon => pokemon.name === element.name);
      if (index !== -1) {
        this.pokemonsToCompare.splice(index, 1);
      }
    }
  }

  isCheckboxDisabled(element: any): boolean {
    if (this.pokemonsToCompare.length < 2) {
      return false;
    }
    return !this.pokemonsToCompare.some(pokemon => pokemon.name === element.name);
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
    this.pokemonDetailsList.data = [...this.pokemonDetailsList.data].sort(
      (a: any, b: any) => {
        let valorA = a[event.active];
        let valorB = b[event.active];

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
