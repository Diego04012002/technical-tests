import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pokemon-stats',
  imports: [],
  templateUrl: './pokemon-stats.html',
  styleUrl: './pokemon-stats.css',
})
export class PokemonStats implements AfterViewInit, OnInit {
  @Input() stats: { name: string; value: number }[] = [];
  @Input() id!: string;
  @Input() isCompare:boolean=false

  private svg: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null;;
  private margin = { top: 20, right: 40, bottom: 20, left: 100 };
  private width = 500 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;

  statMaxValues={
    hp: 720,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180,
  };

  constructor() {}

  ngOnInit(): void {
    if(this.isCompare){
      this.stats = this.stats.slice(0, 5);
    }
  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars();
  }

  private createSvg(): void {
    this.svg = d3
      .select('#stats-chart' + this.id)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawBars(): void {
    const xScales = new Map<string, d3.ScaleLinear<number, number>>();

    //creo cada barra con su maximo correspondiente a cada stat
    Object.entries(this.statMaxValues).forEach(([statName, maxValue]) => {
      xScales.set(
        statName,
        d3.scaleLinear().domain([0, maxValue]).range([0, this.width])
      );
    });

    const y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(this.stats.map((d) => d.name))
      .padding(0.2);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 200])
      .range(['#22c55e', '#ef4444']);

    if(this.svg){
      this.svg.append('g').call(d3.axisLeft(y));
  
      this.svg
        .selectAll('bars')
        .data(this.stats)
        .enter()
        .append('rect')
        .attr('y', (d: { name: string; value: number }) => y(d.name)!)
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .attr('fill', (d: { name: string; value: number }) => colorScale(d.value))
        .transition()
        .duration(800)
        .attr('width', (d: { name: string; value: number }) => {
          const scale = xScales.get(d.name.toLowerCase());
          return scale ? scale(d.value) : 0;
        });
  
      this.svg
        .selectAll('labels')
        .data(this.stats)
        .enter()
        .append('text')
        .attr('x', (d: { name: string; value: number }) => {
          const scale = xScales.get(d.name.toLowerCase());
          return scale ? scale(d.value) + 5 : 5;
        })
        .attr('y', (d: { name: string; value: number }) => y(d.name)! + y.bandwidth() / 2 + 5)
        .text((d: { name: string; value: number }) => {
          return d.value + "/" + this.statMaxValues[d.name.toLowerCase() as keyof typeof this.statMaxValues];
        })
        .style('font-size', '20px');
    }

  }

  getSumStats(): number {
    return this.stats.reduce((sum, stat) => sum + stat.value, 0);
  }
}
