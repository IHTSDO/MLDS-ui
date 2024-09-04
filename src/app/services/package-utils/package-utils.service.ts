import { Injectable } from '@angular/core';
import { isEqual } from 'lodash';
import { AuthenticationSharedService } from '../authentication/authentication-shared.service';
import { MemberService } from '../member/member.service';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PackageUtilsService {

  constructor(private sessionService: AuthenticationSharedService, private memberService: MemberService) { }

  isReleasePackageMatchingMember(releasePackage: any): boolean {
    const userDetails = this.sessionService.getUserDetails();
    const userMember = userDetails?.member;
    return isEqual(userMember, releasePackage.member);
  }

  isPackagePublished(packageEntity: any): boolean {
    return packageEntity.releaseVersions.some((element: any) =>
      element.releaseType === 'online' && !element.archive
    );
  }

  isPackageNotPublished(packageEntity: { releaseVersions: { releaseType: string; archive: boolean }[] }): boolean {
    for (const releaseVersion of packageEntity.releaseVersions) {
      if (releaseVersion.releaseType === 'alpha/beta' && !releaseVersion.archive) {
        return true;
      }
    }
    return false;
  }

  isLatestVersion(version: any, versions: any[]): boolean {
    if (!version.publishedAt) {
      return false;
    }
    const versionPublishedDate = new Date(version.publishedAt);
    for (const element of versions) {
      if (element.publishedAt && (versionPublishedDate < new Date(element.publishedAt))) {
        return false;
      }
    }
    return true;
  }


  isPackageOffline(packageEntity: any): boolean {
    let offlineCount = 0;
    let alphabetaCount = 0;

    for (const releaseVersion of packageEntity.releaseVersions) {
      if (releaseVersion.releaseType === 'offline' && !releaseVersion.archive) {
        offlineCount++;
      } else if (releaseVersion.releaseType === 'alpha/beta' && !releaseVersion.archive) {
        alphabetaCount++;
      }
    }

    return alphabetaCount <= 0;
  }


  isPackageEmpty(packageEntity: any): boolean {
    return packageEntity.releaseVersions.length === 0;
  }

  isPackageFullyArchived(packageEntity: { releaseVersions: { archive: boolean }[] }): boolean {
    let archivePackageCount = 0;

    if (Array.isArray(packageEntity.releaseVersions)) {
      for (const releaseVersion of packageEntity.releaseVersions) {
        if (releaseVersion.archive) {
          archivePackageCount++;
        }
      }
    }
    return archivePackageCount === packageEntity.releaseVersions.length && packageEntity.releaseVersions.length !== 0;
  }

  getMemberOrder(packageEntity: any): number {
    if (packageEntity.member.key === 'IHTSDO') {
      return 0;
    } else {
      const member = this.memberService.getMemberByKey(packageEntity.member.key);
      if (member?.promotePackages) {
        return 1;
      } else {
        return -1;
      }
    }
  }

  getLatestPublishedDate(packageEntity: any): Date {
    let latestPublishDate: Date | null = null;
    packageEntity.releaseVersions.forEach((releaseVersion: any) => {
      const publishDate = new Date(releaseVersion.publishedAt);
      if (!latestPublishDate || publishDate > new Date(latestPublishDate)) {
        latestPublishDate = releaseVersion.publishedAt;
      }
    });
    return latestPublishDate ?? new Date();
  }

  releasePackageSort(releasePackages: any[]): any[] {
    return _.orderBy(releasePackages, [
      this.getMemberOrder.bind(this),
      'priority',
      this.getLatestPublishedDate.bind(this)
    ], ['desc', 'asc', 'desc']).reverse();
  }

  isVersionOnline(releaseVersion: any): boolean {
    return releaseVersion.releaseType === 'online' && !releaseVersion.archive;
  }

  isVersionOffline(releaseVersion: any): boolean {
    return releaseVersion.releaseType === 'offline' && !releaseVersion.archive;
  }
  
  isVersionAlphaBeta(releaseVersion: any): boolean {
    return releaseVersion.releaseType === 'alpha/beta' && !releaseVersion.archive;
  }

  isEditableReleasePackage(releasePackage: any): boolean {
    const userDetails = this.sessionService.getUserDetails();
    const userMember = userDetails?.member; 
    const memberMatches = _.isEqual(userMember, releasePackage.member); 
    return this.sessionService.isAdmin() || memberMatches;
  }

  isRemovableReleasePackage(releasePackage: any): boolean {
    return !this.isPackagePublished(releasePackage);
  }

  isReleasePackageInactive(packageEntity: any): boolean {
    if (packageEntity.inactiveAt) {
      return true;
    } else {
      return false;
    }
  }
  


  // for release versions


  updateVersionsLists(packageEntity: { releaseVersions: any[] }): any {
    const results = { online: [], alphabeta: [], offline: [], archive: [] };
    const categorizedVersions = this.categorizeReleaseVersions(packageEntity.releaseVersions);
    this.sortVersions(categorizedVersions);
    this.concatenateSortedArrays(categorizedVersions, results);
    results.archive = categorizedVersions.archive;
    results.online = categorizedVersions.online;
    return results;
  }

  categorizeReleaseVersions(releaseVersions: any[]): any {
    const categorizedVersions = {
      archive: [] as any[],
      publishedOffline: [] as any[],
      nonPublishedOffline: [] as any[],
      publishedAlphaBeta: [] as any[],
      nonPublishedAlphaBeta: [] as any[],
      online: [] as any[]
    };

    releaseVersions.forEach(releaseVersion => {
      if (releaseVersion.archive) {
        categorizedVersions.archive.push(releaseVersion);
      } else {
        this.categorizeByReleaseType(releaseVersion, categorizedVersions);
      }
    });

    return categorizedVersions;
  }
  

  categorizeByReleaseType(releaseVersion: any, categorizedVersions: any): void {
    const { publishedAt, releaseType } = releaseVersion;

    const categorizationMap: { [key: string]: () => void } = {
      "online": () => categorizedVersions.online.push(releaseVersion),
      "offline": () => {
        if (publishedAt) {
          categorizedVersions.publishedOffline.push(releaseVersion);
        } else {
          categorizedVersions.nonPublishedOffline.push(releaseVersion);
        }
      },
      "alpha/beta": () => {
        if (publishedAt) {
          categorizedVersions.publishedAlphaBeta.push(releaseVersion);
        } else {
          categorizedVersions.nonPublishedAlphaBeta.push(releaseVersion);
        }
      }
    };

    if (categorizationMap[releaseType]) {
      categorizationMap[releaseType]();
    }
  }

  sortByPublishedDateDesc(a: any, b: any): number {
    return new Date(b.publishedAt || b.createdAt || '').getTime() - new Date(a.publishedAt || a.createdAt || '').getTime();
  }

  sortVersions(categorizedVersions: any): void {
    Object.keys(categorizedVersions).forEach(key => {
      categorizedVersions[key] = categorizedVersions[key].toSorted(this.sortByPublishedDateDesc);
    });
  }

  concatenateSortedArrays(categorizedVersions: any, results: any): void {
    results.offline = categorizedVersions.publishedOffline.concat(categorizedVersions.nonPublishedOffline);
    results.alphabeta = categorizedVersions.publishedAlphaBeta.concat(categorizedVersions.nonPublishedAlphaBeta);
  }

}
