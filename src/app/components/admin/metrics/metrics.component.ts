import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MetricsService } from 'src/app/services/metrics/metrics.service'
import { ToFixedPipe } from "../../../pipes/to-fixed/to-fixed.pipe"
import { NumberRoundPipe } from 'src/app/pipes/number-round/number-round.pipe'

/**
 * This component displays various metrics related to the application's health,
 * services, and caches.
 */
@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule, ToFixedPipe, NumberRoundPipe],
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  /**
   * The health check data returned from the backend.
   */
  healthCheck: any = {}

  /**
   * The metrics data returned from the backend.
   */
  metrics: any = {}

  /**
   * The services stats data returned from the backend.
   */
  servicesStats: any = {}

  /**
   * The caches stats data returned from the backend.
   */
  cachesStats: any = {}

  /**
   * Whether to show the database exception message.
   */
  showDatabaseException: boolean = false

  /**
   * Whether to show the mail exception message.
   */
  showMailException: boolean = false

  /**
   * Whether the metrics component is visible or not.
   */
  show: boolean = false

  /**
   * Creates an instance of the MetricsComponent.
   * @param metricsService - The MetricsService to use for fetching metrics data.
   */
  constructor(private metricsService: MetricsService) {}

  /**
   * Initializes the component by fetching the health check and metrics data.
   */
  ngOnInit(): void {
    this.refresh()
  }

  /**
   * Fetches the health check and metrics data from the backend.
   */
  refresh(): void {
    this.metricsService.getHealthCheck().subscribe(data => {
      this.healthCheck = data
    })

    this.metricsService.getMetrics().subscribe(data => {
      this.metrics = data
      console.log('metrics: ' + this.metrics.gauges['jvm.buffers.direct.used'].value)
      this.processMetrics(data)
    })
  }

  /**
   * Processes the metrics data and separates it into services and caches stats.
   * @param items - The metrics data to process.
   */
  private processMetrics(items: any): void {
    this.servicesStats = {}
    this.cachesStats = {}

    Object.keys(items.timers).forEach(key => {
      const value = items.timers[key]

      if (key.includes('web.rest') || key.includes('service')) {
        this.servicesStats[key] = value
      }

      if (key.includes('net.sf.ehcache.Cache')) {
        let index = key.lastIndexOf('.')
        let newKey = key.substring(0, index)

        index = newKey.lastIndexOf('.')
        this.cachesStats[newKey] = {
          'name': newKey.substring(index + 1),
          'value': value
        }
      }
    })
  }

  /**
   * Gets the keys of the services stats object.
   * @returns An array of strings representing the keys of the services stats object.
   */
  getServiceKeys(): string[] {
    return Object.keys(this.servicesStats)
  }
}