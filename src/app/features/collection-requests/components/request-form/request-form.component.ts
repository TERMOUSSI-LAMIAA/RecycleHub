import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CollectionRequest, WasteType } from '../../../../core/models/request.model';
import { CollectionRequestService } from '../../../../core/services/collection-request.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { futureDateValidator } from '../../../../core/validators/future-date.validator';
import { numberValidator } from '../../../../core/validators/number.validator';
import { Store } from '@ngrx/store';
import * as CollectionRequestActions from '../../store/collection-requests.actions';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { selectRequestError } from '../../store/request.selectors';
@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.scss'
})
export class RequestFormComponent {
  @Output() formSubmitted = new EventEmitter<boolean>();
  @Output() formCancelled = new EventEmitter<void>();
  @Input() requestToEdit: CollectionRequest | null = null;
  requestForm: FormGroup;
  wasteTypes = Object.values(WasteType);
  selectedWasteTypes: WasteType[] = [];
  timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00'
  ];
  selectedPhotos: string[] = [];

  errorMessage: string | null = null;
  error$: Observable<string | null>;
  constructor(
    private fb: FormBuilder,
    private store: Store, 
    private requestService: CollectionRequestService
  ) {
    this.requestForm = this.fb.group({
      wasteTypes: [[], Validators.required],
      estimatedWeight: [null, [Validators.required, Validators.min(1000), numberValidator(), Validators.max(10000)]],
      collectAddress: ['', Validators.required],
      scheduledDate: [null, [Validators.required, futureDateValidator()]],
      scheduledTimeSlot: ['', Validators.required],
      additionalNotes: ['']
    });
    this.error$ = this.store.select(selectRequestError);
  }
  
  patchFormValues() {
    this.requestForm.patchValue({
      wasteTypes: this.requestToEdit!.wasteTypes,
      estimatedWeight: this.requestToEdit!.estimatedWeight,
      collectAddress: this.requestToEdit!.collectAddress,
      scheduledDate: this.requestToEdit!.scheduledDate,
      scheduledTimeSlot: this.requestToEdit!.scheduledTimeSlot,
      additionalNotes: this.requestToEdit!.additionalNotes
    });
    this.selectedWasteTypes = [...this.requestToEdit!.wasteTypes];
    this.selectedPhotos = this.requestToEdit!.photos || [];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestToEdit']) {
      if (this.requestToEdit) {
        this.patchFormValues();
      } else {
        this.resetForm();
      }
    }
  }
  resetForm() {
    this.requestForm.reset(); // Reset all form control values to null
    this.selectedWasteTypes = []; // Clear selected waste types
    this.selectedPhotos = []; // Clear selected photos
    this.requestForm.get('wasteTypes')?.setValue([]); // Ensure wasteTypes is an empty array
    this.store.dispatch(CollectionRequestActions.clearRequestError());
  }
  ngOnInit() {
    this.error$.subscribe((error) => {
      this.errorMessage = error;
    });
  }
  


  onWasteTypeChange(event: any) {
    const type = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the type only if it's not already in the array
      if (!this.selectedWasteTypes.includes(type)) {
        this.selectedWasteTypes = [...this.selectedWasteTypes, type];
      }
    } else {
      // Remove the type if it's unchecked
      this.selectedWasteTypes = this.selectedWasteTypes.filter(t => t !== type);
    }
    this.requestForm.get('wasteTypes')?.setValue(this.selectedWasteTypes);
  }

  isChecked(type: WasteType): boolean {
    return this.selectedWasteTypes.includes(type);
  }


  onFileChange(event: any) {
    const files = event.target.files;
    this.selectedPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedPhotos.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }
  
  onSubmit() {
  if (this.requestForm.valid) {
    const formValue = this.requestForm.value;
    // this.store.dispatch(CollectionRequestActions.clearRequestError());
    // this.errorMessage = null;

    if (this.requestToEdit) {
      this.store.dispatch(CollectionRequestActions.updateRequest({ 
        requestId: this.requestToEdit.id, 
        updatedData: { ...formValue, photos: this.selectedPhotos } 
      }));

      this.store.select(selectRequestError).pipe(take(1)).subscribe(error => {
        if (error) {
          this.formSubmitted.emit(false);
          this.errorMessage = error;
          // setTimeout(() => { this.errorMessage = null; }, 3000);
   
        } else {
          this.formSubmitted.emit(true);
          alert("Request updated successfully! ✅");
          // this.store.dispatch(CollectionRequestActions.clearRequestError());
        }
      });

    } else {
      this.store.dispatch(CollectionRequestActions.createRequest({ 
        requestData: { ...formValue, photos: this.selectedPhotos } 
      }));

      this.store.select(selectRequestError).pipe(take(1)).subscribe(error => {
        if (!error) {
          this.formSubmitted.emit(true);
          alert("Request created successfully! ✅");
          // this.store.dispatch(CollectionRequestActions.clearRequestError());
        }
      });
    }
  } else {
    this.formSubmitted.emit(false);
  }
}

  
  onCancel() {
    this.formCancelled.emit();
    this.errorMessage = null;
  }
}
