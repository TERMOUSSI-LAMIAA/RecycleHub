import { Component, OnInit, ViewChild } from '@angular/core';

import { CollectionRequest } from '../../../../core/models/request.model';
import { RequestFormComponent } from '../request-form/request-form.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { deleteRequest, loadRequests } from '../../store/collection-requests.actions';
import { Store } from '@ngrx/store';
import { selectRequests } from '../../store/request.selectors';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [RequestFormComponent,CommonModule],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit {
  requests$: Observable<CollectionRequest[]> | undefined;
  showRequestForm = false;
  isEditMode: boolean = false; 
  currentRequest: CollectionRequest | null = null;
  @ViewChild(RequestFormComponent) requestFormComponent: RequestFormComponent | undefined;  
  constructor(
    private store: Store
  ) { this.requests$ = this.store.select(selectRequests); }

  ngOnInit() {
    this.store.dispatch(loadRequests());
  }


  onFormSubmitted(success: boolean) {
    if (success) {
      this.showRequestForm = false;
      this.currentRequest = null;  
      this.store.dispatch(loadRequests());
   
    }
  }
  openNewRequestForm() {
    this.showRequestForm = true;
    this.currentRequest = null; 
    this.isEditMode = false;
  }
  editRequest(request: CollectionRequest) {
    console.log('Editing request:', request);
    this.showRequestForm = true;
    this.currentRequest = request; 
  }

  deleteRequest(requestId: string) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.store.dispatch(deleteRequest({ requestId }));
    }
  }
}
