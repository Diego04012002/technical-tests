import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pokemon-move-chart',
  imports: [],
  templateUrl: './pokemon-move-chart.html',
  styleUrl: './pokemon-move-chart.css',
})
export class PokemonMoveChart implements OnInit, AfterViewInit, OnChanges {
  @Input() stats: { typeName: string; countPokemon: Set<string> }[] = [];

  private svg: any;
  private margin = { top: 20, right: 40, bottom: 20, left: 100 };
  private width = 500 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;

  statMaxValues = {
    hp: 720,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180,
  };

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats'] && this.svg) {
      this.clearSvg();
      this.drawBars();
    }
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars();
  }

   private clearSvg(): void {
    d3.select('#stats-chart').selectAll('svg').remove();
    this.createSvg();
  }

  private createSvg(): void {
    this.svg = d3
      .select('#stats-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawBars(): void {
    if(!this.stats || this.stats.length==0) return
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(this.stats, (d) => d.countPokemon.size)!])
      .range([0, this.width]);

    const y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(this.stats.map((d) => d.typeName))
      .padding(0.2);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 200])
      .range(['#22c55e', '#ef4444']);

    this.svg.append('g').call(d3.axisLeft(y));

    this.svg
      .selectAll('bars')
      .data(this.stats)
      .enter()
      .append('rect')
      .attr(
        'y',
        (d: { typeName: string; countPokemon: Set<string> }) => y(d.typeName)!
      )
      .attr('height', y.bandwidth())
      .attr('fill', (d: { typeName: string; countPokemon: Set<string> }) =>
        colorScale(d.countPokemon.size)
      )
      .transition()
      .duration(800)
      .attr('width', (d: { typeName: string; countPokemon: Set<string> }) =>
        x(d.countPokemon.size)
      );

    this.svg
      .selectAll('labels')
      .data(this.stats)
      .enter()
      .append('text')
      .attr(
        'x',
        (d: { typeName: string; countPokemon: Set<string> }) =>
          x(d.countPokemon.size) + 5
      )
      .attr(
        'y',
        (d: { typeName: string; countPokemon: Set<string> }) =>
          y(d.typeName)! + y.bandwidth() / 2 + 5
      )
      .text((d: { typeName: string; countPokemon: Set<string> }) => {
        return d.countPokemon.size;
      })
      .style('font-size', '20px');
  }

  // getSumStats(): number {
  //   return this.stats.reduce((sum, stat) => sum + stat.value, 0);
  // }
}
