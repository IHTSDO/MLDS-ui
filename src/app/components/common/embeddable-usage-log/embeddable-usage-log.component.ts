import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input,  OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of } from 'rxjs';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { CountryService } from 'src/app/services/country/country.service';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { UsageReportStateUtilsService } from 'src/app/services/usage-report-state-utils/usage-report-state-utils.service';
import { UsageReportsService } from 'src/app/services/usage-reports/usage-reports.service';
import { Router } from '@angular/router';
import { RemoveCountryModalComponent } from '../../user/remove-country-modal/remove-country-modal.component';
import { AddInstitutionModalComponent } from '../../user/add-institution-modal/add-institution-modal.component';
import { DeleteInstitutionModalComponent } from '../../user/delete-institution-modal/delete-institution-modal.component';
import { EditInstitutionModalComponent } from '../../user/edit-institution-modal/edit-institution-modal.component';
import { EditCountModalComponent } from '../../user/edit-count-modal/edit-count-modal.component';
import { SubmitUsageReportModalComponent } from '../../user/submit-usage-report-modal/submit-usage-report-modal.component';
import { EditCountDataAnalysisComponent } from '../../user/edit-count-data-analysis/edit-count-data-analysis.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';

@Component({
    selector: 'app-embeddable-usage-log',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbDropdownModule, TranslateModule, CompareTextPipe],
    templateUrl: './embeddable-usage-log.component.html',
    styleUrl: './embeddable-usage-log.component.scss'
})
export class EmbeddableUsageLogComponent implements OnInit {

  usageForm!: FormGroup;
  collapsePanel: any = {};
  usageLogForm: any = {};
  selectedCountryCodesToAdd: string[] = [];
  selectedCountryCodesToRemove: string[] = [];
  geographicAdding = 0;
  geographicRemoving = 0;
  geographicAlerts: any[] = [];
  agreementTypeOptions = ['AFFILIATE_NORMAL', 'AFFILIATE_RESEARCH', 'AFFILIATE_PUBLIC_GOOD'];
  implementationStatusOptions = ['IMPLEMENTED', 'DEVELOPMENT', 'PLANNING'];
  availableCountries: any[] = [];
  currentCountries: any[] = [];
  usageByCountry: any = {};
  usageByCountryList: any[] = [];
  readOnly = false;
  commercialType = false;
  isActiveUsage = true;
  isEditable = true;
  homeCountry: any = null;
  canSubmit = false;
  private events: EventEmitter<any> = new EventEmitter<any>();
isAffiliateApplying = false;
country: any;
countryUsage: any;
institution: any;
q: string = '';
@Input() commercialUsageReport: any = {};
@Input() usageLogCanSubmit: boolean = true;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private countryService: CountryService,
    private commercialUsageService: CommercialUsageService,
    private usageReportsService: UsageReportsService,
    private router: Router,
    private session: AuthenticationSharedService,
    private usageReportStateUtils: UsageReportStateUtilsService,
    private standingStateUtils: StandingStateUtilsService
  ) {this.events = new EventEmitter(); // Initialize EventEmitter
    this.setupNotifications();}

  ngOnInit(): void {
    this.setupNotifications();
    this.loadParentsUsageReport();
    this.canSubmit = this.usageLogCanSubmit;
    this.initForm();
    
  }
 

  initForm(): void {
    this.usageForm = this.fb.group({
      currentUsage: [{ value: this.commercialUsageReport.context?.currentUsage || '', disabled: this.readOnly }, Validators.required],
      plannedUsage: [{ value: this.commercialUsageReport.context?.plannedUsage || '', disabled: this.readOnly }, Validators.required],
      purpose: [{ value: this.commercialUsageReport.context?.purpose || '', disabled: this.readOnly }, Validators.required],
      implementationStatus: [{ value: this.commercialUsageReport.context?.implementationStatus || '', disabled: this.readOnly }, Validators.required],
      otherActivities:  [{ value: this.commercialUsageReport.context?.otherActivities || '', disabled: this.readOnly }, Validators.required],
    });
  }
  setupNotifications() {
    this.events.subscribe((event) => {
      if (event.type === 'commercialUsageUpdated') {
        this.onCommercialUsageUpdated();
      } else if (event.type === 'affiliateTypeUpdated') {
        this.onAffiliateTypeUpdated(event.payload);
      }
    });
    
  }

  onCommercialUsageUpdated(): void {
    this.commercialUsageService.getUsageReport(this.commercialUsageReport.commercialUsageId).subscribe({
      next: (result: any) => this.updateFromUsageReport(result),
      error: (err: any) => console.error('Failed commercialUsageUpdated', err)
    });
  }  
  

  onAffiliateTypeUpdated(newType: any): void {
    if (newType !== this.commercialUsageReport.type) {
      this.commercialUsageReport.type = newType;
      this.commercialUsageService.updateUsageReportType(this.commercialUsageReport).subscribe({
        next: (response: any) => {
          // Handle success response if needed
        },
        error: (err: any) => {
          console.error('Failed to update usage type', err);
        }
      });
    }
  }
  
  

  addHomeCountryIfNotSelected() {
    if (this.homeCountry && this.canAddSelectedCountries([this.homeCountry?.isoCode2])) {
      this.addSelectedCountries([this.homeCountry?.isoCode2]);
    }
  }

  loadParentsUsageReport(): void {
    if (this.commercialUsageReport) {
      this.commercialUsageService.getUsageReport(this.commercialUsageReport?.commercialUsageId).subscribe({
        next: (usageReport: any) => {
          this.commercialUsageReport = usageReport;
          this.updateFromUsageReport(usageReport);
        },
        error: (err: any) => {
          console.error('Failed to get initial usage log by param', err);
        }
      });
    } else {
      console.error('Cannot submit usage log');
    }
  }  
  
  

  updateFromUsageReport(usageReport: any) {
    this.usageByCountry = {};
    this.usageByCountryList = [];
    this.availableCountries = [];
    this.currentCountries = [];

    this.commercialUsageReport = usageReport;
    this.isActiveUsage = !usageReport.effectiveTo;
    this.isAffiliateApplying = this.standingStateUtils.isApplying(usageReport.affiliate.standingState);
    this.isEditable = this.session.isUser() || this.session.isAdmin() || this.isAffiliateApplying;
    this.readOnly = this.isEditable ? !this.usageReportStateUtils.isWaitingForApplicant(usageReport.state) : true;
    this.commercialType = usageReport.type === 'COMMERCIAL';
    this.homeCountry = usageReport.affiliate?.affiliateDetails?.address?.country || this.homeCountry;
  
    // Loop through countries and entries
    usageReport.countries.forEach((usageCount: any) => {
      const countrySection = this.lookupUsageByCountryOrCreate(usageCount.country);
      countrySection.count = usageCount;
    });
  
    usageReport.entries.forEach((usageEntry: any) => {
      const countrySection = this.lookupUsageByCountryOrCreate(usageEntry.country);
      countrySection.entries.push(usageEntry);
      this.sortByNameProperty(countrySection.entries, 'name');
    });
  
    // Sort available and selected countries by common name
    this.sortByNameProperty(this.availableCountries, 'commonName');
    this.sortByNameProperty(this.usageByCountryList, 'commonName');
    this.sortByNameProperty(this.currentCountries, 'commonName');
 
    // Ensure home country is added if it is not selected yet
    if (!this.homeCountry && usageReport.affiliate?.affiliateDetails?.address?.country) {
      this.addHomeCountryIfNotSelected();
    }

    
  
    // Fetch available countries and filter out already used countries
    this.loadFilteredCountries();
  }
 
  loadFilteredCountries() {
  
    this.countryService.getCountries().subscribe((countries: any[]) => {
  
      this.availableCountries = countries?.filter((country: any) => {
        // Check the filtering logic
        const isExcluded = this.usageByCountryList.some((usageCountry: any) => usageCountry?.country?.isoCode2 === country?.isoCode2);
        return !country.excludeUsage && !isExcluded;
      });
  
    });
  }
  
  // Call this method whenever a country is added or removed
  onCountryAddedOrRemoved() {
    // Re-apply the filter to remove or include countries based on the updated usageByCountryList
    this.loadFilteredCountries();
  }
  
  lookupUsageByCountryOrNull(country: any) {
    return this.usageByCountry[country?.isoCode2];
  }

  lookupUsageByCountryOrCreate(country: any) {
    let countrySection = this.lookupUsageByCountryOrNull(country);
    if (!countrySection) {
      countrySection = {
        country,
        entries: [],
        count: {
          snomedPractices: 0,
          hospitalsStaffingPractices: 0,
          dataCreationPracticesNotPartOfHospital: 0,
          nonPracticeDataCreationSystems: 0,
          deployedDataAnalysisSystems: 0,
          databasesPerDeployment: 0,
          country
        }
      };
      this.usageByCountry[country?.isoCode2] = countrySection;
      this.currentCountries.push(country);
      this.usageByCountryList.push(countrySection);
    }
    return countrySection;
  }

  sortByNameProperty(array: any[], expression: string) {
    array.sort((a, b) => {
      const x = (a[expression] || '').toLowerCase();
      const y = (b[expression] || '').toLowerCase();
      let result = 0;
      if (x < y) {
        result = -1;
      } else if (x > y) {
        result = 1;
      }
      return result;
    });
  }

  canAddSelectedCountries(countryCodes: string[]): boolean {
    if (this.geographicAdding) {
      return false;
    }
  
    let canAdd = false;
  
    // Use some to check if any country can be added
    for (const countryCode of countryCodes) {
      // Subscribe to the observable to get the country
      this.countryService.getCountryByISOCODE2(countryCode).subscribe({
        next: (addCountry) => {
          if (addCountry && !this.isCountryAlreadyPresent(addCountry) && !addCountry.excludeUsage) {
            canAdd = true;
          }
        },
        error: () => {
          // Handle error if necessary
          console.error('Failed to fetch country data');
        }
      });
  
      // If we have found a valid country, break the loop
      if (canAdd) {
        break;
      }
    }
  
    return canAdd;
  }

 
  

  addSelectedCountries(selectedCountryCodesToAdd: string[]): void {
    selectedCountryCodesToAdd.forEach((countryCode) => {
      const country = this.availableCountries.find((c: any) => c.isoCode2 === countryCode);
  
      if (country && !this.isCountryAlreadyPresent(country)) {
        // Add the selected country to usageByCountryList
        this.usageByCountryList.push(country);
        
        // Remove the selected country from availableCountries
        this.availableCountries = this.availableCountries.filter((c: any) => c.isoCode2 !== countryCode);
        
        // Re-sort the available countries list
        this.sortByNameProperty(this.availableCountries, 'commonName');
  
        // Proceed with any further logic (e.g., updating the server)
        this.commercialUsageService.addUsageCount(this.commercialUsageReport, {
          snomedPractices: 0,
          hospitalsStaffingPractices: 0,
          dataCreationPracticesNotPartOfHospital: 0,
          nonPracticeDataCreationSystems: 0,
          deployedDataAnalysisSystems: 0,
          databasesPerDeployment: 0,
          country
        }, { skipBroadcast: true })
        .subscribe({
          next: () => {
            this.geographicAdding = Math.max(this.geographicAdding - 1, 0);
            if (this.geographicAdding === 0) {
              this.commercialUsageService.broadcastCommercialUsageUpdate();
            }
           this.loadParentsUsageReport();
          },
          error: () => {
            this.geographicAlerts.push({ type: 'danger', msg: 'Network request failure [11]: please try again later.' });
            this.geographicAdding = Math.max(this.geographicAdding - 1, 0);
            if (this.geographicAdding === 0) {
              this.commercialUsageService.broadcastCommercialUsageUpdate();
            }
          }
        });
      }
    });
  
    // Clear selectedCountryCodesToAdd after processing
    selectedCountryCodesToAdd.length = 0;

  }
  
  isCountryAlreadyPresent(country: any) {
    return !!this.usageByCountry[country.isoCode2];
  }

 
saveUsage() {

  if (!this.commercialUsageReport.context) {
    this.commercialUsageReport.context = {};
  }
  
  this.commercialUsageReport.context.plannedUsage = this.usageForm.get('plannedUsage')?.value || '';
  this.commercialUsageReport.context.currentUsage = this.usageForm.get('currentUsage')?.value || '';
  this.commercialUsageReport.context.purpose = this.usageForm.get('purpose')?.value || '';
  this.commercialUsageReport.context.implementationStatus = this.usageForm.get('implementationStatus')?.value || '';
  this.commercialUsageReport.context.otherActivities = this.usageForm.get('otherActivities')?.value || '';
  this.commercialUsageService.updateUsageReportContext(this.commercialUsageReport, { skipBroadcast: true })
    .pipe(
      catchError((error: any) => {
        console.error('Failed to update usage context', error);
        return of(null); // Return a fallback value or an empty observable if needed
      })
    )
    .subscribe((response: any) => {
        console.log('Usage context has been successfully updated.');
    });
}

autoSubmit(){
  this.saveUsage();
}

  canRemoveSelectedCountries(countryCodes: string[]): boolean {
    if (this.geographicRemoving > 0) {
      return false;
    }
    return countryCodes.length > 0;
  }

  removeSelectedCountries(countryCodes: string[]): void {
    countryCodes.forEach(countryCode => {
      const country = this.countryFromCode(countryCode);
      this.removeCountry(country);
    });
    countryCodes.length = 0; // Clear the array
  }

  private removeCountry(country: any): void {
  this.geographicRemoving = 0;
  this.geographicAlerts.length = 0;

  if (country && this.isCountryAlreadyPresent(country)) {
    const countrySection = this.lookupUsageByCountryOrCreate(country);
    this.geographicRemoving += 1;

    this.commercialUsageService
      .deleteUsageCount(this.commercialUsageReport, countrySection.count, { skipBroadcast: true })
      .subscribe({
        next: () => {
          this.geographicRemoving = Math.max(this.geographicRemoving - 1, 0);
          if (this.geographicRemoving === 0) {
            this.commercialUsageService.broadcastCommercialUsageUpdate();
          }
        },
        error: () => {
          this.geographicAlerts.push({ type: 'danger', msg: 'Network request failure [49]: please try again later.' });
          this.geographicRemoving = Math.max(this.geographicRemoving - 1, 0);
          if (this.geographicRemoving === 0) {
            this.commercialUsageService.broadcastCommercialUsageUpdate();
          }
        }
      });
  }
}


  private countryFromCode(countryCode: string): any {
    const countries = this.countryService.getCountryByISOCODE2(countryCode);
    return countries;
  }
  

  addInstitutionModal(country: any): void {
    const modalRef = this.modalService.open(AddInstitutionModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.country = country;
    modalRef.componentInstance.usageReport = this.commercialUsageReport;
    modalRef.result.then(
      () => {
        this.loadParentsUsageReport();
      }
    );
  }

  editInstitutionModal(institution: any, country: any): void {
   
    const modalRef = this.modalService.open(EditInstitutionModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.institution = { ...institution };
    modalRef.componentInstance.country = country;
    modalRef.componentInstance.usageReport = this.commercialUsageReport;
    modalRef.result.then(
      () => {
        this.loadParentsUsageReport();
      }
    );
  }

  deleteInstitutionModal(institution: any, country: any): void {
    const modalRef = this.modalService.open(DeleteInstitutionModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.institution = institution;
    modalRef.componentInstance.country = country;
    modalRef.componentInstance.usageReport = this.commercialUsageReport;
    modalRef.result.then(
      () => {
        this.loadParentsUsageReport();
      }
    );
  }

  editCountModal(count: any, country: any): void {
    const modalRef = this.modalService.open(EditCountModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.count = { ...count };
    modalRef.componentInstance.country = country;
    modalRef.componentInstance.usageReport = this.commercialUsageReport;
    modalRef.result.then(
      () => {
        this.loadParentsUsageReport();
      }
    );
  }

  editCountDataAnalysisModal(count: any, country: any): void {
    const modalRef = this.modalService.open(EditCountDataAnalysisComponent, { backdrop: 'static' });
    modalRef.componentInstance.count = { ...count };
    modalRef.componentInstance.country = country;
    modalRef.componentInstance.usageReport = this.commercialUsageReport;
    modalRef.componentInstance.hospitalsCount = this.lookupUsageByCountryOrCreate(count.country).entries.length;
    modalRef.componentInstance.practicesCount = count.snomedPractices;
    modalRef.result.then(
      () => {
        this.loadParentsUsageReport();
      }
    );
  }

  removeCountryModal(count: any): void {
    const modalRef = this.modalService.open(RemoveCountryModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.count = count;
    modalRef.componentInstance.usageReport = this.commercialUsageReport;
    modalRef.componentInstance.hospitalsCount = this.lookupUsageByCountryOrCreate(count.country).entries.length;
    modalRef.componentInstance.practicesCount = count.snomedPractices;
    modalRef.result.then(() =>{this.loadParentsUsageReport()});
    this.loadParentsUsageReport();
  }

  submitUsageReport(form: any): void {
    if (form.invalid) {
      form.attempted = true;
      return;
    }

    const modalRef = this.modalService.open(SubmitUsageReportModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.commercialUsageReport = this.commercialUsageReport;
    modalRef.componentInstance.usageByCountryList = this.usageByCountryList;
  }

  retractUsageReport(): void {
    this.usageReportsService.retractUsageReport(this.commercialUsageReport);
  }

  institutionDateRangeOutsidePeriod(institution: any): boolean {
    if (institution.startDate && institution.endDate) {
      const endDate = new Date(institution.endDate);
      return (endDate < new Date(this.commercialUsageReport.startDate));
    }
    return false;
  }
  searchCountries() {
    if(this.q != ''){
    this.availableCountries = this.availableCountries.filter(country =>
      country.commonName.toLowerCase().includes(this.q.toLowerCase())
    );
  }
  if(this.q == ''){
    this.loadFilteredCountries();
  }
  }


}