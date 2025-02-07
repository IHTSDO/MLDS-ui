import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SystemsLoggersService } from 'src/app/services/systems-loggers/systems-loggers.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-systems-loggers',
  standalone: true,
  imports: [CommonModule, FormsModule, CompareTextPipe,TranslateModule],
  templateUrl: './systems-loggers.component.html',
  styleUrl: './systems-loggers.component.scss'
})
export class SystemsLoggersComponent implements OnInit {
  loggers: any[] = [];
  filter: string = '';
  predicate: string = 'name';
  reverse: boolean = false;
  currentLevel: string = '';
  isLoading: boolean = true;

  constructor(private logsService: SystemsLoggersService) {}

  ngOnInit(): void {
    this.loadLoggers();
  }

  loadLoggers(): void {
    this.logsService.findAll().subscribe(loggers => {
      this.loggers = loggers;
      this.isLoading = false;
    });
  }

  changeLevel(name: string, level: string): void {
    this.logsService.changeLevel(name, level).subscribe(() => {
      this.loadLoggers();  // Refresh the list after changing level
    });
  }

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
  
  getButtonClass(currentLevel: string, buttonLevel: string): string {
    let buttonClass = 'btn btn-xs';
    if (currentLevel === 'ERROR') {

      if (['TRACE', 'DEBUG', 'INFO'].includes(buttonLevel)) {
        buttonClass += ' btn-edit'; 
      } else {
        buttonClass += ' btn-delete'; 
      }
    } else if (currentLevel === 'WARN') {

      if (['TRACE', 'DEBUG', 'INFO'].includes(buttonLevel)) {
        buttonClass += ' btn-edit';
      } else {
        buttonClass += ' btn-delete';
      }
    } else if (currentLevel === 'INFO') {

      if (buttonLevel === 'INFO') {
        buttonClass += ' btn-active'; 
      }
      else if (['TRACE', 'DEBUG'].includes(buttonLevel)) {
        buttonClass += ' btn-edit'; 
      } 
      else {
        buttonClass += ' btn-delete'; 
      }
    } else if (currentLevel === 'DEBUG') {

      if (['TRACE', 'INFO'].includes(buttonLevel)) {
        buttonClass += ' btn-edit';
      } else {
        buttonClass += ' btn-delete'; 
      }
    } else if (currentLevel === 'TRACE') {

      if (['DEBUG', 'INFO'].includes(buttonLevel)) {
        buttonClass += ' btn-edit'; 
      } else {
        buttonClass += ' btn-delete'; 
      }
    }

    return buttonClass;
  }

  isActive(level: string): boolean {
    return this.currentLevel === level;
  }
}