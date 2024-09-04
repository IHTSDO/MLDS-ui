import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SystemsLoggersService } from 'src/app/services/systems-loggers/systems-loggers.service';

@Component({
  selector: 'app-systems-loggers',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './systems-loggers.component.html',
  styleUrl: './systems-loggers.component.scss'
})
export class SystemsLoggersComponent implements OnInit {
  loggers: any[] = [];
  filter: string = '';
  predicate: string = 'name';
  reverse: boolean = false;
  currentLevel: string = '';

  constructor(private logsService: SystemsLoggersService) {}

  ngOnInit(): void {
    this.loadLoggers();
  }

  loadLoggers(): void {
    this.logsService.findAll().subscribe(loggers => {
      this.loggers = loggers;
    });
  }

  // changeLevel(name: string, level: string): void {
  //   this.logsService.changeLevel(name, level).subscribe(() => {
  //     this.loadLoggers();  // Refresh the list after changing level
  //   });
  // }

  get filteredLoggers(): any[] {
    // Filter the loggers based on the filter string
    return this.loggers.filter(logger => 
      logger.name.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  get sortedLoggers(): any[] {
    // Sort the filtered loggers based on predicate and reverse
    return this.filteredLoggers.sort((a, b) => {
      const valueA = a[this.predicate];
      const valueB = b[this.predicate];
      
      if (valueA < valueB) {
        return this.reverse ? 1 : -1;
      }
      if (valueA > valueB) {
        return this.reverse ? -1 : 1;
      }
      return 0;
    });
  }
  changeLevel(level: string) {
    this.currentLevel = level;
  }

  isActive(level: string): boolean {
    // Return true if the button's level matches the currentLevel
    return this.currentLevel === level;
  }
}