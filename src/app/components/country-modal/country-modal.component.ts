import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { MemberService } from 'src/app/services/member/member.service';

interface Member {
  id: string;
  name: string;
  key: string;
}

@Component({
  selector: 'app-country-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbModule, NgbTypeaheadModule],
  templateUrl: './country-modal.component.html',
  styleUrl: './country-modal.component.scss'
})


export class CountryModalComponent {

  @Input() country: any; 
  countryForm!: FormGroup;
  availableMembers: Member[] = [];
  selectedMember: Member | undefined; 
  
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadMembers();
  }

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

  onSubmit() {
    if (this.countryForm.valid) {
      const formValue = this.countryForm.value;
      this.modal.close(formValue);
    }
  }

  loadMembers() {
    this.memberService.getMembers().subscribe(
      (members: Member[]) => {
        this.availableMembers = members;
      },
      error => {
        console.error('Error fetching members', error);
      }
    );
  }

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

  filterMembers(term: string): any[] {
    var result = this.availableMembers.filter(member => member.key.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 8);
    return result;
  }

   resultFormatter = (member: Member) => member.key;

   formatter(value:any){
    if(value.key){
      return value.key;
    }
    return value;
  }

  onMemberSelect(event: NgbTypeaheadSelectItemEvent): void {
    const selectedMember: Member = event.item;
    console.log('Selected member:', selectedMember);
    
    this.selectedMember = selectedMember; 
    
    this.countryForm.patchValue({
      member: selectedMember 
    });
  }

  searchMembers = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => term.length < 1 ? [] : this.filterMembers(term))
    );


}