import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PokemonRequest } from '../../services/pokemon-request';
import * as d3 from 'd3';
import { forkJoin } from 'rxjs';

interface BarData {
  typeName: string;
  countPokemonFirst: number;
  countPokemonSecond: number;
  [key: string]: string | number;
}

@Component({
  selector: 'app-pokemon-move',
  imports: [],
  templateUrl: './pokemon-move.html',
  styleUrl: './pokemon-move.css',
})
export class PokemonMove implements OnInit, OnChanges {
  @Input() moveFirst!: {name:string; url:string};
  @Input() moveSecond!: {name:string; url:string};
  loadingChart: boolean = true;

  hasMapMoveLearned: {
    typeName: string;
    countPokemonFirst: Set<string>;
    countPokemonSecond: Set<string>;
  }[] = [];
  private svg: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null;
  private margin = { top: 22, right: 50, bottom: 70, left: 80 };
  private width = 1000;
  private height = 450;

  firstMoveLearndedPokemonList: PokemonDefault[]=[];
  secondMoveLearndedPokemonList: PokemonDefault[]=[];

  pokemonService = inject(PokemonRequest);

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['moveFirst'] &&
      !changes['moveFirst'].firstChange) ||
      (changes['moveSecond'] &&
      !changes['moveSecond'].firstChange)
    ) {
      this.loadingChart = true;
      this.clearSvg();
      this.clearData();
      this.getPokemonDetails(this.moveFirst.url, true);
      this.getPokemonDetails(this.moveSecond.url, false);
    }
  }

  ngOnInit(): void {
    this.fetchMovesStats();
  }

  fetchMovesStats() {
    this.pokemonService
      .getPokemonTypes()
      .subscribe((data: { results: Type[] }) => {
        data.results.forEach((type: Type) => {
          let typeObject = {
            typeName: type.name,
            countPokemonFirst: new Set<string>(),
            countPokemonSecond: new Set<string>(),
          };
          this.hasMapMoveLearned.push(typeObject);
        });
      });
    this.getPokemonDetails(this.moveFirst.url, true);
    this.getPokemonDetails(this.moveSecond.url, false);
  }

  getPokemonDetails(move: string, isFirst: boolean) {
    this.pokemonService
      .getPokemonDetails(move)
      .subscribe((data: { learned_by_pokemon: PokemonDefault[] }) => {
        this.firstMoveLearndedPokemonList = data.learned_by_pokemon;
        this.createObjectToBuild(isFirst);
      });
  }

  createObjectToBuild(isFirst: boolean) {
    const observables = this.firstMoveLearndedPokemonList.map((pokemon: PokemonDefault) =>
      this.pokemonService.getPokemonDetails(pokemon.url)
    );

    forkJoin<Pokemon[]>(observables).subscribe((results: Pokemon[]) => {
      results.forEach((data:Pokemon, index:number) => {
        data.types.forEach((type: { type: Type }) => {
          const typeFind = this.hasMapMoveLearned.find(
            (entry:{
                typeName: string;
                countPokemonFirst: Set<string>;
                countPokemonSecond: Set<string>;
              }) => entry.typeName === type.type.name
          );
          if (typeFind) {
            if (isFirst) {
              typeFind.countPokemonFirst.add(data.id.toString());
            } else {
              typeFind.countPokemonSecond.add(data.id.toString());
            }
          }
        });
      });
      this.loadingChart = false;
      if (!isFirst) {
        setTimeout(() => {
          this.createSvg();
          this.drawBars();
        },100);
      }
    });
  }

  private createSvg(): void {
    
    this.svg = d3
      .select('#stats-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  private drawBars(): void {
    if (!this.hasMapMoveLearned || this.hasMapMoveLearned.length === 0) return;

    const processedData = this.hasMapMoveLearned.map((item) => ({
      typeName: item.typeName,
      countPokemonFirst: item.countPokemonFirst.size,
      countPokemonSecond: item.countPokemonSecond.size,
    }));

    const subgroups = ['countPokemonFirst', 'countPokemonSecond'];

    const groups = processedData.map(d => d.typeName);

    const x = d3.scaleBand()
      .domain(groups)
      .range([0, this.width])
      .padding(0.2);
      
    if(this.svg){
      this.svg.append('g')
        .attr('transform', `translate(0, ${this.height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .style("font-size", "18px")
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => Math.max(d.countPokemonFirst, d.countPokemonSecond))! * 1.1])
        .range([this.height, 0]);
  
      this.svg.append('g')
        .call(d3.axisLeft(y));
  
      const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding(0.05);
  
      const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#00fbc0', '#1b34d9']);
  
      this.svg.append('g')
        .selectAll('g')
        .data(processedData)
        .join('g')
        .attr('transform', (d: { typeName: string; countPokemonFirst: number; countPokemonSecond: number }) => `translate(${x(d.typeName)},0)`)
        .selectAll('rect')
        .data((d: BarData) => subgroups.map(key => ({
            key: key,
            value: key === 'countPokemonFirst' ? d.countPokemonFirst : d.countPokemonSecond
          })))
        .join('rect')
        .attr('x', (d: { key: string; value: number }) => xSubgroup(d.key)!)
        .attr('y', (d: { key: string; value: number }) => y(d.value))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', (d: { key: string; value: number }) => this.height - y(d.value))
        .attr('fill', (d: { key: string; value: number }) => color(d.key) as string);
        
    } 
  }

  clearData() {
    this.hasMapMoveLearned=this.hasMapMoveLearned.map(
      (data: {
        typeName: string;
        countPokemonFirst: Set<string>;
        countPokemonSecond: Set<string>;
      }) => {
        return {
          typeName: data.typeName,
          countPokemonFirst: new Set<string>(),
          countPokemonSecond: new Set<string>(),
        };
      }
    );
  }

  clearSvg() {
    d3.select('#stats-chart').selectAll('*').remove();
    this.svg = null;
  }
}
