import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pokemon-stats',
  imports: [],
  templateUrl: './pokemon-stats.html',
  styleUrl: './pokemon-stats.css',
})
export class PokemonStats implements AfterViewInit{
  @Input() stats: { name: string; value: number }[] = [];
  @Input() id!:string

  private svg: any;
  private margin = { top: 20, right: 40, bottom: 20, left: 100 };
  private width = 500 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;

  constructor(private elRef: ElementRef) {}
  
  ngAfterViewInit(): void {
    this.createSvg();
    this.drawBars();
  }

  private createSvg(): void {
    this.svg = d3
      .select("#stats-chart" + this.id)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawBars(): void {
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(this.stats, (d) => d.value)!])
      .range([0, this.width]);

    const y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(this.stats.map((d) => d.name))
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
      .attr('y', (d: any) => y(d.name)!)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', (d:any) => colorScale(d.value))
      .transition()
      .duration(800)
      .attr('width', (d: any) => x(d.value));

    this.svg
      .selectAll('labels')
      .data(this.stats)
      .enter()
      .append('text')
      .attr('x', (d: any) => x(d.value) + 5)
      .attr('y', (d: any) => y(d.name)! + y.bandwidth() / 2 + 5)
      .text((d: any) => d.value)
      .style('font-size', '14px');
  }

  private getColor(statValue: number): string {
    if (statValue <= 0 && statValue <= 25) {
      return 'yellow';
    }
    if (statValue > 25 && statValue <= 50) {
      return 'green';
    }
    if (statValue > 50 && statValue <= 75) {
      return 'orange';
    }
    if (statValue < 75) {
      return 'red';
    } else {
      return 'grey';
    }
  }

  getSumStats(): number {
    return this.stats.reduce((sum, stat) => sum + stat.value, 0);
  }
}
