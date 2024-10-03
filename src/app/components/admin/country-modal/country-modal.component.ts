import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { MemberService } from 'src/app/services/member/member.service'
import { ModalComponent } from '../../common/modal/modal.component';

/**
 * Interface representing a Member object
 */
interface Member {
  id: string;
  name: string;
  key: string;
}

/**
 * CountryModalComponent is a modal component that allows users to edit country information.
 * It uses a reactive form to validate user input and provides a typeahead feature to search for members.
 */
@Component({
  selector: 'app-country-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbModule, NgbTypeaheadModule, ModalComponent],
  templateUrl: './country-modal.component.html',
  styleUrl: './country-modal.component.scss'
})

export class CountryModalComponent {
  /**
   * Input property that receives the country object to be edited
   */
  @Input() country: any;

  /**
   * The reactive form that holds the country information
   */
  countryForm!: FormGroup;

  /**
   * Array of available members that can be selected
   */
  availableMembers: Member[] = [];

  /**
   * The selected member object
   */
  selectedMember: Member | undefined;

  /**
   * Constructor that injects the necessary services and initializes the component
   * @param modal The NgbActiveModal instance that manages the modal
   * @param formBuilder The FormBuilder instance that creates the reactive form
   * @param memberService The MemberService instance that provides member data
   */
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private memberService: MemberService
  ) {}

  /**
   * Initializes the component by creating the form and loading the available members
   */
  ngOnInit() {
    this.createForm();
    this.loadMembers();
  }

  /**
   * Creates the reactive form with the country information
   */
  createForm() {
    this.countryForm = this.formBuilder.group({
      isoCode2: [this.country?.isoCode2 || '', Validators.required],
      isoCode3: [this.country?.isoCode3 || '', Validators.required],
      commonName: [this.country?.commonName || '', [Validators.required, Validators.minLength(1)]],
      member: [this.country?.member || '', Validators.required],
      excludeUsage: [this.country?.excludeUsage || false],
      alternateRegistrationUrl: [this.country?.alternateRegistrationUrl || '']
    });
  }

  /**
   * Submits the form data when the user clicks the submit button
   */
  onSubmit() {
    if (this.countryForm.valid) {
      const formValue = this.countryForm.value;
      this.modal.close(formValue);
    }
  }

  /**
   * Loads the available members from the member service
   */
  loadMembers() {
    this.memberService.getMembers().subscribe({
      next:(members: Member[]) => {
        this.availableMembers = members;
      },
      error: (error: any) => {
        console.error('Error fetching members', error);
      }
    });
  }

  /**
   * Updates the selected member object when the country member changes
   */
  updateSelectedMember() {
    if (this.country?.member?.key) {
      this.selectedMember = this.availableMembers.find(member => member.key === this.country.member.key);
      if (this.selectedMember) {
        this.countryForm.patchValue({
          member: this.selectedMember.key
        });
      }
    }
  }

  /**
   * Filters the available members based on the search term
   * @param term The search term
   * @returns An array of filtered members
   */
  filterMembers(term: string): Member[] {
    const result = this.availableMembers.filter(member => member.key.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 8);
    return result;
  }

  /**
   * Formats the member object for display in the typeahead
   * @param member The member object
   * @returns The formatted member key
   */
  resultFormatter = (member: Member) => member.key;

  /**
   * Formats the selected member object for display in the form
   * @param value The selected member object
   * @returns The formatted member key
   */
  formatter(value: any) {
    if (value.key) {
      return value.key;
    }
    return value;
  }

  /**
   * Handles the selection of a member from the typeahead
   * @param event The NgbTypeaheadSelectItemEvent
   */
  onMemberSelect(event: NgbTypeaheadSelectItemEvent): void {
    const selectedMember: Member = event.item;
    
    this.selectedMember = selectedMember; 
    
    this.countryForm.patchValue({
      member: selectedMember 
    });
  }

/**
 * Searches for members based on the input text
 * 
 * @param text$ An observable string that represents the search input
 * @returns An observable array of filtered members
 */
searchMembers = (text$: Observable<string>) =>
  text$.pipe(
    /**
     * Debounces the input by 300ms to prevent excessive requests
     */
    debounceTime(300),
    /**
     * Ignores duplicate requests to prevent unnecessary filtering
     */
    distinctUntilChanged(),
    /**
     * Maps the input term to an array of filtered members
     * If the term is empty, returns an empty array
     * Otherwise, calls the filterMembers function to filter the members
     */
    map(term => term.length < 1 ? [] : this.filterMembers(term))
  );

/**
 * Example usage:
 * 
 * const searchInput = 'john';
 * const searchObservable = of(searchInput);
 * const filteredMembers = searchMembers(searchObservable);
 * 
 * filteredMembers.subscribe(members => console.log(members));
 */


}