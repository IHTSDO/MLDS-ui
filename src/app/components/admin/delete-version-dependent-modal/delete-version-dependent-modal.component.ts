import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, EMPTY, lastValueFrom, tap } from 'rxjs';
import { ReleaseFileService } from 'src/app/services/release-file/release-file.service';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';
import { ModalComponent } from '../../common/modal/modal.component';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-version-dependent-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './delete-version-dependent-modal.component.html',
  styleUrl: './delete-version-dependent-modal.component.scss'
})
export class DeleteVersionDependentModalComponent {
  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  alerts: { type: string; msg: string }[] = [];
  submitting = false;
  dependentNames: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private releaseVersionsService: ReleaseVersionsService,
    private releasePackagesService: ReleasePackageService,
    private router: Router,
    private releaseFilesService: ReleaseFileService
  ) { }

  ngOnInit(): void {
    const releaseVersionId = this.releaseVersion?.releaseVersionId;
    if (releaseVersionId) {
      this.loadDependentVersions(releaseVersionId);
    } else {
      console.warn('releaseVersionId is not available');
    }
    
  }
  
  loadDependentVersions(releaseVersionId: string): void {
    this.releasePackagesService.getVersionDependencyNames(releaseVersionId).subscribe({
      next: (versions: any[]) => {
        this.dependentNames = versions || [];
      },
      error: (err) => {
        console.error('Error fetching dependent versions:', err);
        this.dependentNames = [];
      }
    });
  }
  
  /**
   * Initiates the deletion process for release version and its files.
   */
  ok(): void {
    this.submitting = true;
    this.clearAlerts();

    const fileDeletePromises = this.releaseVersion.releaseFiles.map((releaseFile: any) =>
      this.deleteReleaseFile(releaseFile)
    );

    Promise.all(fileDeletePromises)
      .then(() => this.deleteReleaseVersion())
      .then(result => {
        this.activeModal.close(result);
      })
      .catch(() => {
        this.handleError('Network request failure [13]: please try again later.');
      });
  }

  /**
   * Cancels the modal
   */
  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  /**
   * Closes the alert at the given index.
   */
  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  /**
   * Deletes a specific release file.
   */
  private deleteReleaseFile(releaseFile: any): Promise<any> {
    return lastValueFrom(
      this.releaseFilesService.delete(
        this.releasePackage.releasePackageId,
        this.releaseVersion.releaseVersionId,
        releaseFile.releaseFileId
      ).pipe(
        tap(() => console.log('Release file deleted successfully')),
        catchError((error) => {
          console.error('Error deleting release file:', error);
          this.handleError('Error deleting release file.');
          return EMPTY;
        })
      )
    );
  }

  /**
   * Deletes the release version after all files have been deleted.
   */
  private deleteReleaseVersion(): Promise<any> {
    const releasePackageId = Number(this.releasePackage.releasePackageId);
    return lastValueFrom(
      this.releaseVersionsService.delete(releasePackageId, this.releaseVersion.releaseVersionId).pipe(
        tap(() => console.log('Release version deleted successfully')),
        catchError((error) => {
          console.error('Error deleting release version:', error);
          this.handleError('Error deleting release version.');
          return EMPTY;
        })
      )
    );
  }

  /**
   * Handles errors by adding an alert and resetting the submission state.
   */
  private handleError(message: string): void {
    this.alerts.push({ type: 'danger', msg: message });
    this.submitting = false;
  }

  /**
   * Clears all alerts.
   */
  private clearAlerts(): void {
    this.alerts = [];
  }

  goToVersion(releasePackageId: number): void {
    if (releasePackageId) {
      this.cancel();
      this.router.navigate([`/releaseManagement/release/${releasePackageId}`]);
    }
  }
}