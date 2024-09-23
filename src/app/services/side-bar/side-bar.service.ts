import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private LOCAL_STORAGE_KEY = 'selectedItem';

  // Initialize the BehaviorSubject with the stored value or default to 0
  private selectedItemSubject = new BehaviorSubject<number>(
    Number(localStorage.getItem(this.LOCAL_STORAGE_KEY)) || 0
  );

  // Observable to be subscribed to by components
  selectedItem$ = this.selectedItemSubject.asObservable();

  // Method to change the selected item
  selectItem(index: number): void {
    this.selectedItemSubject.next(index);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, index.toString()); // Persist in localStorage
  }

  // Method to get the current value (for initialization)
  getSelectedItem(): number {
    return this.selectedItemSubject.getValue();
  }
}