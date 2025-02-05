import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WasteType } from '../../../../core/models/request.model';
import { CollectionRequestService } from '../../../../core/services/collection-request.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { futureDateValidator } from '../../../../core/validators/future-date.validator';
import { numberValidator } from '../../../../core/validators/number.validator';

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

  constructor(
    private fb: FormBuilder,
    private requestService: CollectionRequestService
  ) {
    this.requestForm = this.fb.group({
      wasteTypes: [[], Validators.required],
      estimatedWeight: [null, [Validators.required, Validators.min(1000), numberValidator()]],
      collectAddress: ['', Validators.required],
      scheduledDate: [null, [Validators.required, futureDateValidator()]],
      scheduledTimeSlot: ['', Validators.required],
      additionalNotes: ['']
    });
  }

  ngOnInit() { }

  onWasteTypeChange(event: any) {
    const type = event.target.value;
    if (event.target.checked) {
      this.selectedWasteTypes.push(type);
    } else {
      this.selectedWasteTypes = this.selectedWasteTypes.filter(t => t !== type);
    }
    this.requestForm.get('wasteTypes')?.setValue(this.selectedWasteTypes);
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
      this.requestService.createRequest({
        ...formValue,
        photos: this.selectedPhotos
      }).subscribe({
        next: (request) => {
          console.log('Request created:', request);
          this.formSubmitted.emit(true);
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('Error creating request:', err);
          this.formSubmitted.emit(false);
          this.errorMessage =err
        }
      });
    }
  }

  onCancel() {
    this.formCancelled.emit();
    this.errorMessage = null;
  }
}
