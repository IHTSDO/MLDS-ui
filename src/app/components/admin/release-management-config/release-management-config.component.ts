import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PackageUtilsService } from 'src/app/services/package-utils/package-utils.service';
import { PackagesService } from 'src/app/services/packages-service/packages.service';
import { ReleasePackageService } from 'src/app/services/release-package/release-package.service';
import lodash from 'lodash';
import { Router } from '@angular/router';
import { ReleaseConfigWarningModalComponent } from '../release-config-warning-modal/release-config-warning-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-release-management-config',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './release-management-config.component.html',
  styleUrl: './release-management-config.component.scss'
})

export class ReleaseManagementConfigComponent implements OnInit {
  selectedRelease: any = [];
  selectedReleaseType: string = '';
  selectedPermission: string = '';
  selectedType: string = '';
  isEdit: boolean = false;
  isUpdatedRecently: boolean = false;
  users: { login: string; userId: number; selected: boolean }[] = [];
  releaseNames: any[] = []; // Array to store release names
  alreadyMappedUserList: any[] = [];
  selectedReleses: any[] = [];
  public releaseManagementFilter = {
    showAllMembers: '1'
  };
  onlineReleases: any[] = [];
  alphaBetaReleases: any[] = [];
  offlineReleases: any[] = [];
  releaseTypes: any[] = [];
  showSuccessMessage: boolean = false;
  isEveryOneChecked: boolean = false;
  isLoading: boolean = false;


  constructor(private releaseManagementService: ReleasePackageService, private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private packagesService: PackagesService, private packageUtilsService: PackageUtilsService,  private router: Router, private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getUserList();
    this.getReleaseTypes();
    this.loadReleasePackages();

    this.permissionForm = this.fb.group({
      isAdmin: [{ value: true, disabled: true }],
      isStaff: false,
      isAllAffiliates: false,
      isSelectedUsers: false,
      isEveryone: false,
      isMember: false
    });

    this.permissionForm.valueChanges.subscribe(() => {
      if (this.isEveryOneChecked) {
        this.permissionReset();
        this.isEveryOneChecked = false;
      } else {
        this.onCheckboxChange();
      }
    });

  }

  private loadReleasePackages(): void {
    this.packagesService.loadPackages().subscribe({
      next: (data) => {
        const memberFiltered = data.filter(p => this.releaseManagementFilter.showAllMembers || this.packageUtilsService.isReleasePackageMatchingMember(p));

        const onlinePackages = this.packageUtilsService.releasePackageSort(
          lodash.filter(memberFiltered, this.packageUtilsService.isPackagePublished)
        );
        this.onlineReleases = onlinePackages;

        const alphabetaPackages = lodash.chain(memberFiltered)
          .reject(this.packageUtilsService.isPackageOffline.bind(this))
          .reject(this.packageUtilsService.isPackagePublished.bind(this))
          .reject(this.packageUtilsService.isPackageEmpty.bind(this))
          .sortBy('createdAt')
          .value();
        this.alphaBetaReleases = alphabetaPackages;

        const offlinePackages = lodash.chain(memberFiltered)
          .reject(this.packageUtilsService.isPackagePublished.bind(this))
          .reject(this.packageUtilsService.isPackageNotPublished.bind(this))
          .reject(this.packageUtilsService.isPackageFullyArchived.bind(this))
          .sortBy('createdAt')
          .value();
        this.offlineReleases = offlinePackages;

        if(this.isUpdatedRecently){
        this.updateReleases();
        this.setSelectedRelease();
        this.isUpdatedRecently = false;
        }

        return {
          onlinePackages: onlinePackages,
          alphabetaPackages: alphabetaPackages,
          offlinePackages: offlinePackages
        };
      },
      error: (err) => {
        console.error('Error occurred while fetching release packages:', err.message);
      }
    });
  }

  setSelectedRelease() {
    const selectedRelease = this.releaseNames.find(r => r.releasePackageId === this.selectedRelease?.releasePackageId);
  
    if (selectedRelease) {
      this.selectedRelease = selectedRelease;
    } else {
      this.selectedRelease = '';
    }
  }



  getUserList() {
    this.releaseManagementService.getUserList().subscribe(
      (data: any[]) => {
        this.users = data
          .sort((a, b) => a.login.localeCompare(b.login))
          .map(item => ({
            login: item.login,
            userId: item.userId,
            selected: false
          }));

      },
      (error) => {
        console.error('Error fetching user list:', error);
      }
    );
  }



  getReleaseTypes() {
    this.packagesService.getReleaseTypes().subscribe({
      next: (data) => {
        this.releaseTypes = data;
      },
      error: (err) => {
        console.error('Error occurred while fetching release types:', err.message);
      }
    });
  }

  onReleaseSelect() {
    this.updateReleases()
    if(this.selectedRelease.permissionType != 'NOT_SELECTED'){
      this.selectedPermission = this.selectedRelease.permissionType;
    }
    else{
      this.selectedPermission = '';
    }
  }

  onReleaseTypeSelect() {
    this.selectedRelease = '';
    this.selectedPermission = '';
    this.updateReleases();
  }

  updateReleases(){
    switch (this.selectedReleaseType) {
      case '1': 
        this.releaseNames = [...this.onlineReleases];
        break;
      case '2': 
        this.releaseNames = [...this.alphaBetaReleases];
        break;
      case '3':
        this.releaseNames = [...this.offlineReleases];
        break;
      case '4':
        this.releaseNames = [
          ...this.onlineReleases,
          ...this.alphaBetaReleases,
          ...this.offlineReleases
        ];
        break;
      default:
        this.releaseNames = [];
        break;
    }
  }

  onPermissionSelect() {
    if(this.selectAllChecked && this.selectedPermission === 'ADMIN_STAFF_SELECTED_USERS'){
      this.selectedType = this.getSelectedTypeString(this.selectedReleaseType);
      this.packagesService.getMasterPermissionedUser(this.selectedType).subscribe({
        next: (data: any[]) => {
          if(data.length > 0){
          this.users = this.users.map(user => {
          if (data.includes(user.login)) {
            user.selected = true;
          } else {
            user.selected = false;
          }
          return user;
        });
      }

        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }


    if(!this.selectAllChecked && this.selectedPermission === 'ADMIN_STAFF_SELECTED_USERS' && this.selectedReleses.length == 1){
      this.selectedType = this.getSelectedTypeString(this.selectedReleaseType);
      this.packagesService.getPermissionedUser(this.selectedReleses[0]).subscribe({
        next: (data: any[]) => {
           if(data.length > 0){
           this.users = this.users.map(user => {
          if (data.includes(user.login)) {
            user.selected = true;
          } else {
            user.selected = false;
          }
          return user;
        });
      }
        },
        error: (error) => {
          console.error('Error', error);
        }
    });
    }
  }

  reset() {
    this.selectedReleaseType = '';
    this.selectedRelease = '';
    this.selectedPermission = '';
    this.users.forEach(user => user.selected = false);
    this.releaseNames.forEach(release => release.selected = false);
    this.releaseNames = [];
    this.selectAllChecked = false;
    this.permissionReset();
  }

  save() {
    const selectedUsers = this.users.filter(user => user.selected).map(user => String(user.userId));

    if(!this.selectedPermission){
      this.selectedPermission = 'ADMIN_ONLY';
    }

    if(this.selectedReleses.length > 0 && this.selectedPermission && !this.selectAllChecked){
      this.isLoading = true;
      this.packagesService.checkUpdateReleasesPackageType(this.selectedReleses, this.selectedPermission, selectedUsers)
      .subscribe(response => {
        if (response) {
          this.isLoading = false;
          this.openWarningModal('update');
        } else {
          this.updateReleasePacakgeType();
        }
      }, (err) => {
        this.isLoading = false;
        console.error('Error checking configuration:', err);
      });
    }

    if((this.selectedReleaseType === '4' && this.selectAllChecked) || this.selectAllChecked){
      this.isLoading = true;
      switch (this.selectedReleaseType) {
        case '1': 
          this.selectedType = 'ONLINE';
          break;
        case '2': 
          this.selectedType = 'ALPHA/BETA';
          break;
        case '3':
          this.selectedType = 'OFFLINE';
          break;
        case '4':
          this.selectedType = 'ALL';
          break;
      }

      this.packagesService.checkUpdateReleasesPackageMasterType(this.selectedType, this.selectedPermission, selectedUsers)
      .subscribe(response => {
        if (response) {
          this.isLoading = false;
          this.openWarningModal('master');
        } else {
          this.updateReleasePackageMasterType();
        }
      }, (err) => {
        this.isLoading = false;
        console.error('Error checking configuration:', err);
      });     
      
    }

  }


  updateReleasePacakgeType(){
    this.isLoading = true;
    this.packagesService.updateReleasesPackageType(this.selectedReleses, this.selectedPermission, this.users.filter(user => user.selected).map(user => String(user.userId))).subscribe({
        next: (response) => {
          this.isUpdatedRecently = true;
          this.loadReleasePackages();
          this.isLoading = false;
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.reset();
          }, 2000);
        },
        error: (err) => {
          console.error('Error updating release package:', err);
          this.isLoading = false;
        }
      });
  }

  updateReleasePackageMasterType(){
    this.isLoading = true;
    this.packagesService.updateReleasesPackageMasterType(this.selectedType, this.selectedPermission, this.users.filter(user => user.selected).map(user => String(user.userId))).subscribe({
        next: (response) => {
          this.isUpdatedRecently = true;
          this.loadReleasePackages();
          this.isLoading = false;
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.reset();
          }, 2000);
        },
        error: (err) => {
          console.error('Error updating release package:', err);
          this.isLoading = false;
        }
      });  
  }

  openWarningModal(type: string) {
    const modalRef = this.modalService.open(ReleaseConfigWarningModalComponent, { backdrop: 'static' });

    modalRef.result.then((result) => {
      if (result) {
        if (type === 'update') {
          this.updateReleasePacakgeType();
        } else if (type === 'master') {
          this.updateReleasePackageMasterType();
        }
      } else {
        console.log('User canceled the action');
      }
    }, (reason) => {
      console.log('Modal dismissed');
    });
  }

  onReleaseChange() {
    const allSelected = this.releaseNames.every(release => release.selected);
    this.selectAllChecked = allSelected;

    const anyDeselected = this.releaseNames.some(release => !release.selected);
    if (anyDeselected) {
      this.selectAllChecked = false;
    }

    this.selectedReleses = this.releaseNames.filter(release => release.selected).map(release => release.releasePackageId);
  }

  dropdownOpen: boolean = false;
  selectAllChecked: boolean = false;

  toggleDropdown() {
    if(this.selectedReleaseType != ''){
    this.dropdownOpen = !this.dropdownOpen;
    }
  }

  dropdownPermission: boolean = false;
  toggleDropdownForPermission(){
    if(this.selectedReleses.length != 0){
    this.dropdownPermission = !this.dropdownPermission;
    }
  }


  toggleSelectAll() {
    this.selectAllChecked = this.selectAllChecked;
    this.releaseNames.forEach(release => release.selected = this.selectAllChecked);
    this.onReleaseChange();
  }


  viewPermission(): void {
    this.router.navigate(['releaseConfig/viewPermissions']);
  }

   getSelectedTypeString(selectedType: string): string {
    switch (selectedType) {
      case '1':
        return 'ONLINE';
      case '2':
        return 'ALPHA/BETA';
      case '3':
        return 'OFFLINE';
      case '4':
        return 'ALL';
      default:
        return 'ALL';
    }
  }

  get sortedReleaseNames() {
    return this.releaseNames.sort((a, b) => a.name.localeCompare(b.name));
  }




permissionForm!: FormGroup;
permission = 'ADMIN_ONLY';


onCheckboxChange(): void {
  const form = this.permissionForm;

  const isEveryone = form.get('isEveryone')?.value;
  const isAdmin = form.get('isAdmin')?.value;
  const isStaff = form.get('isStaff')?.value;
  const isAllAffiliates = form.get('isAllAffiliates')?.value;
  const isSelectedUsers = form.get('isSelectedUsers')?.value;
  const isMemberControl = form.get('isMember');

  // If 'Everyone' is checked, enforce all others
  if (isEveryone) {
    form.patchValue({
      isAdmin: true,
      isStaff: true,
      isAllAffiliates: true,
      isSelectedUsers: true,
      isMember: true
    }, { emitEvent: false });
    this.isEveryOneChecked = true;
  } else {
    // Mutually exclusive logic for AllAffiliates and SelectedUsers
    if (isAllAffiliates && isSelectedUsers) {
      // Uncheck isSelectedUsers to enforce exclusivity
      form.patchValue({
        isSelectedUsers: false
      }, { emitEvent: false });
    }

    // Sync isStaff with AllAffiliates or SelectedUsers
    const needsStaff = isAllAffiliates || isSelectedUsers;

    if (needsStaff && !isStaff) {
      form.patchValue({ isStaff: true }, { emitEvent: false });
    }

    // Sync isMember with isStaff and logic for AllAffiliates or SelectedUsers
    if (isStaff) {
      form.patchValue({ isMember: true }, { emitEvent: false });
    } else {
      form.patchValue({ isMember: false }, { emitEvent: false });
    }

    // If AllAffiliates or SelectedUsers is checked, make Member true by default
    if ((isAllAffiliates || isSelectedUsers) && !isMemberControl?.value) {
      form.patchValue({ isMember: true }, { emitEvent: false });
    }
  }

  this.cdr.detectChanges();
  this.updatePermission();
}


  updatePermission(): void {
    const { isAdmin, isStaff, isMember, isAllAffiliates, isSelectedUsers, isEveryone } = this.permissionForm.getRawValue();

    if (isEveryone) {
      this.permission = 'EVERYONE';
    } else if (isAdmin && isStaff && isMember && isAllAffiliates) {
      this.permission = 'ADMIN_STAFF_AFFILIATES';
    } else if (isAdmin && isStaff && isMember && isSelectedUsers) {
      this.permission = 'ADMIN_STAFF_SELECTED_USERS';
    } else if (isAdmin && isMember && isStaff) {
      this.permission = 'ADMIN_AND_STAFF';
    } else if (isAdmin){
      this.permission = 'ADMIN_ONLY';
    }
    this.selectedPermission = this.permission;
    if(this.selectedPermission == 'ADMIN_STAFF_SELECTED_USERS'){
    this.onPermissionSelect();
    }
  }


  permissionReset(){
    const form = this.permissionForm;
     form.patchValue({
      isStaff: false,
      isAllAffiliates: false,
      isSelectedUsers: false,
      isEveryone:false,
      isMember: false
    }, { emitEvent: false });
  }

}