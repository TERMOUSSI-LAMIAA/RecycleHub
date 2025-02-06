import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionRequestService } from '../../../../core/services/collection-request.service';
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

  constructor(
    private store: Store
  ) { this.requests$ = this.store.select(selectRequests); }

  ngOnInit() {
    this.store.dispatch(loadRequests());
  }



  onFormSubmitted(success: boolean) {
    if (success) {
      this.showRequestForm = false;
      this.store.dispatch(loadRequests());
    }
  }

  editRequest(request: CollectionRequest) {
    // Logic to open the edit form with pre-filled data
    // You may want to set up a mechanism to pass the selected request data to the form
    console.log('Editing request:', request);
    this.showRequestForm = true; // Show the form for editing
    // You can also pass the current request data to the form component if needed
  }

  deleteRequest(requestId: string) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.store.dispatch(deleteRequest({ requestId }));
    }
  }
}
