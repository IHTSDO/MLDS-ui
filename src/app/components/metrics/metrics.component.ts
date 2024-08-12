import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetricsService } from 'src/app/services/metrics/metrics.service';
import { ToFixedPipe } from "../../pipes/to-fixed/to-fixed.pipe";
import { NumberRoundPipe } from 'src/app/pipes/number-round/number-round.pipe';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule, ToFixedPipe, NumberRoundPipe],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class MetricsComponent implements OnInit {
  healthCheck: any = {};
  metrics: any = {};
  servicesStats: any = {};
  cachesStats: any = {};
  showDatabaseException: boolean = false;
  showMailException: boolean = false;
  show: boolean = false;


  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.metricsService.getHealthCheck().subscribe(data => {
      this.healthCheck = data;
    });
    this.metricsService.getMetrics().subscribe(data => {
      this.metrics = data;
      console.log('metrics: '+this.metrics.gauges['jvm.buffers.direct.used'].value);
      this.processMetrics(data);
    });
  }

  private processMetrics(items: any): void {
      this.servicesStats = {};
      this.cachesStats = {};
  
      Object.keys(items.timers).forEach(key => {
        const value = items.timers[key];
  
        if (key.includes("web.rest") || key.includes("service")) {
          this.servicesStats[key] = value;
        }
  
        if (key.includes("net.sf.ehcache.Cache")) {
         
          let index = key.lastIndexOf(".");
          let newKey = key.substring(0, index);
  
          
          index = newKey.lastIndexOf(".");
          this.cachesStats[newKey] = {
            'name': newKey.substring(index + 1),
            'value': value
          };
        }
      });
    }

    getServiceKeys(): string[] {
      return Object.keys(this.servicesStats);
    }

  
}