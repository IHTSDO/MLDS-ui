import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audits-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audits-embed.component.html',
  styleUrl: './audits-embed.component.scss'
})
export class AuditsEmbedComponent implements OnInit{

  @Input() audits: any[] = [];
  errorMessage: string | null = null;
  predicate: string = 'timestamp';
  reverse: boolean = false;

  constructor()
  {}

  ngOnInit(): void {
    this.toggleSort('timestamp');
  }


  toggleSort(column: string): void {
    if (this.predicate === column) {
      this.reverse = !this.reverse;
    } else {
      this.predicate = column;
      this.reverse = false;
    }
  }

  get sortedAudits() {
    return [...this.audits].sort((a, b) => {
      const aValue = new Date(a[this.predicate]).getTime();
      const bValue = new Date(b[this.predicate]).getTime();
      const comparison = aValue - bValue; 
      return this.reverse ? -comparison : comparison;
    });
    
  }

}
