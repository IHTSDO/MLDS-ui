import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, EMPTY, lastValueFrom, tap } from 'rxjs';
import { ReleaseFileService } from 'src/app/services/release-file/release-file.service';
import { ReleaseVersionsService } from 'src/app/services/release-versions/release-versions.service';

@Component({
  selector: 'app-delete-version-dependent-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-version-dependent-modal.component.html',
  styleUrl: './delete-version-dependent-modal.component.scss'
})
export class DeleteVersionDependentModalComponent {
  @Input() releasePackage: any;
  @Input() releaseVersion: any;
  alerts: { type: string; msg: string }[] = [];
  submitting = false;

  constructor(
    public activeModal: NgbActiveModal,
    private releaseVersionsService: ReleaseVersionsService,
    private releaseFilesService: ReleaseFileService
  ) { }

  ok(): void {
    this.submitting = true;
    this.alerts = [];


    const promises = this.releaseVersion.releaseFiles.map((releaseFile: any) =>
      lastValueFrom(
        this.releaseFilesService.delete(
          this.releasePackage.releasePackageId,
          this.releaseVersion.releaseVersionId,
          releaseFile.releaseFileId
        ).pipe(
          tap((response) => {
            console.log('Release file deleted successfully');
          }),
          catchError((error) => {
            console.error('Error deleting release file:', error);
            this.alerts.push({ type: 'danger', msg: 'Error deleting release file.' });
            return EMPTY;
          })
        )
      )
    );

    Promise.all(promises)
      .then(() => {

        const releasePackageId = Number(this.releasePackage.releasePackageId);

        return lastValueFrom(
          this.releaseVersionsService.delete(releasePackageId, this.releaseVersion.releaseVersionId).pipe(
            tap((result) => {
              console.log('Release version deleted successfully');
            }),
            catchError((error) => {
              console.error('Error deleting release version:', error);
              this.alerts.push({ type: 'danger', msg: 'Network request failure [13]: please try again later.' });
              this.submitting = false;
              return EMPTY;
            })
          )
        );
      })
      .then(result => {
        this.activeModal.close(result);
      })
      .catch(() => {

        this.alerts.push({ type: 'danger', msg: 'Network request failure [13]: please try again later.' });
        this.submitting = false;
      });
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}
