import { Pipe, PipeTransform } from '@angular/core';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';

@Pipe({
  name: 'filterOffline',
  standalone: true
})
export class FilterOfflinePipe implements PipeTransform {

  constructor(private packageUtilsService: PackageUtilsService) {}

  transform(versions: any[]): any[] {
    if (!versions) {
      return [];
    }
    return versions.filter(version => this.packageUtilsService.isVersionOffline(version));
  }


}
