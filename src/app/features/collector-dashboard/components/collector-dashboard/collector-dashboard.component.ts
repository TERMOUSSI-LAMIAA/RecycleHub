import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CollectionRequest, RequestStatus } from '../../../../core/models/request.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import {  selectRequests } from '../../../collection-requests/store/request.selectors';
import { loadFilteredRequestsByCity, updateRequestStatus } from '../../../collection-requests/store/collection-requests.actions';
@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, 
    FormsModule],
  templateUrl: './collector-dashboard.component.html',
  styleUrl: './collector-dashboard.component.scss'
})
  
export class CollectorDashboardComponent implements OnInit {
  requests$: Observable<CollectionRequest[]> | undefined;
  statuses = Object.values(RequestStatus);
  statusControls: { [requestId: string]: FormControl } = {};
  selectedStatuses: { [requestId: string]: RequestStatus } = {};  // Track selected status for each request

  constructor(private store: Store) {
    this.requests$ = this.store.select(selectRequests);
  }

  ngOnInit() {
    this.store.dispatch(loadFilteredRequestsByCity());

    this.requests$?.subscribe(requests => {
      requests.forEach(request => {
        this.statusControls[request.id] = new FormControl(request.status);
        this.selectedStatuses[request.id] = request.status; // Initialize selected status
      });
    });
  }

  onStatusChange(requestId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;  // Cast the event target
    const status = selectElement.value as RequestStatus;   // Access the value property
    this.selectedStatuses[requestId] = status;  // Capture status on dropdown change
  }

  updateStatus(requestId: string) {
    const status = this.selectedStatuses[requestId];  // Get selected status when button is clicked
    this.store.dispatch(updateRequestStatus({ requestId: requestId, status: status }));
  }
  // requests$: Observable<CollectionRequest[]> | undefined;
  // statuses = Object.values(RequestStatus); 

  // constructor(private store: Store) {
  //   this.requests$ = this.store.select(selectRequests);
  // }

  // ngOnInit() {
  //   this.store.dispatch(loadFilteredRequestsByCity());
  // }

  // updateStatus(requestId: string, status: RequestStatus) {
  //   this.store.dispatch(updateRequestStatus({ requestId: requestId, status: status }));
  // }
}
