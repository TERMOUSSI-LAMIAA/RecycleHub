import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CollectionRequest, RequestStatus } from '../../../../core/models/request.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import {  selectRequests } from '../../../collection-requests/store/request.selectors';
import { loadFilteredRequestsByCity } from '../../../collection-requests/store/collection-requests.actions';
@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collector-dashboard.component.html',
  styleUrl: './collector-dashboard.component.scss'
})
  
export class CollectorDashboardComponent implements OnInit {
  requests$: Observable<CollectionRequest[]> | undefined;
  statuses = Object.values(RequestStatus); 

  constructor(private store: Store) {
    this.requests$ = this.store.select(selectRequests);
  }

  ngOnInit() {
    this.store.dispatch(loadFilteredRequestsByCity());
  }

  handleStatusChange(event: Event, requestId: string) {
    const newStatus = (event.target as HTMLSelectElement).value;
    console.log(`Status changed for request ${requestId}: ${newStatus}`);
    // Dispatch an action here if needed to update the status
  }
}
