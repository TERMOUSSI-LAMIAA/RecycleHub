import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CollectionRequest, WasteDetail, WasteType } from '../../../../core/models/request.model';
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
  selectedWasteTypes: Set<WasteType> = new Set();
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
      collectAddress: ['', Validators.required],
      scheduledDate: [null, [Validators.required, futureDateValidator()]],
      scheduledTimeSlot: ['', Validators.required],
      additionalNotes: ['']
    });
    // Initialize weight controls for each waste type
    this.wasteTypes.forEach(type => {
      this.requestForm.addControl(
        this.getWeightControlName(type),
        this.fb.control({ value: '', disabled: true }, [
          Validators.required,
          Validators.min(1000),
          numberValidator(),
          Validators.max(10000)
        ])
      );
    });
    this.error$ = this.store.select(selectRequestError);
  }

  getWeightControlName(type: WasteType): string {
    return `weight_${type}`;
  }

  getWeightControl(type: WasteType) {
    return this.requestForm.get(this.getWeightControlName(type));
  }

  
  patchFormValues() {
    this.wasteTypes.forEach(type => {
      this.getWeightControl(type)?.disable();
    });

    // Basic form values
    this.requestForm.patchValue({
      collectAddress: this.requestToEdit!.collectAddress,
      scheduledDate: this.requestToEdit!.scheduledDate,
      scheduledTimeSlot: this.requestToEdit!.scheduledTimeSlot,
      additionalNotes: this.requestToEdit!.additionalNotes
    });
    // Handle waste details
    this.requestToEdit!.wasteDetails.forEach(detail => {
      this.selectedWasteTypes.add(detail.wasteType);
      const control = this.getWeightControl(detail.wasteType);
      if (control) {
        control.enable();
        control.setValue(detail.estimatedWeight);
      }
    });
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
    this.selectedWasteTypes.clear();
    this.selectedPhotos = []; // Clear selected photos

    this.wasteTypes.forEach(type => {
      const control = this.getWeightControl(type);
      if (control) {
        control.disable();
        control.setValue('');
      }
    });    this.store.dispatch(CollectionRequestActions.clearRequestError());
  }

  ngOnInit() {
    this.error$.subscribe((error) => {
      this.errorMessage = error;
    });
  }
  
  onWasteTypeChange(event: any) {
    const type = event.target.value as WasteType;
    const isChecked = event.target.checked;
    const control = this.getWeightControl(type);

    if (isChecked) {
      this.selectedWasteTypes.add(type);
      control?.enable();
    } else {
      this.selectedWasteTypes.delete(type);
      if (control) {
        control.disable();
        control.setValue('');
      }
    }
  }

  isChecked(type: WasteType): boolean {
    return this.selectedWasteTypes.has(type);
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

  hasSelectedWasteTypes(): boolean {
    return this.selectedWasteTypes.size > 0;
  }

  isWasteTypeSelected(type: WasteType): boolean {
    return this.selectedWasteTypes.has(type);
  }

  onSubmit() {
    if (this.requestForm.valid) {
      const formValue = this.requestForm.value;

      // Create wasteDetails array from selected types and their weights
      const wasteDetails: WasteDetail[] = Array.from(this.selectedWasteTypes).map(type => ({
        wasteType: type,
        estimatedWeight: Number(this.getWeightControl(type)?.value)
      }));

      const requestData = {
        ...formValue,
        wasteDetails,
        photos: this.selectedPhotos
      };

      if (this.requestToEdit) {
        this.store.dispatch(CollectionRequestActions.updateRequest({
          requestId: this.requestToEdit.id,
          updatedData: requestData
        }));

        this.store.select(selectRequestError).pipe(take(1)).subscribe(error => {
          if (error) {
            this.formSubmitted.emit(false);
            this.errorMessage = error;
          } else {
            this.formSubmitted.emit(true);
            alert("Request updated successfully! ✅");
          }
        });
      } else {
        this.store.dispatch(CollectionRequestActions.createRequest({
          requestData
        }));

        this.store.select(selectRequestError).pipe(take(1)).subscribe(error => {
          if (!error) {
            this.formSubmitted.emit(true);
            alert("Request created successfully! ✅");
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
