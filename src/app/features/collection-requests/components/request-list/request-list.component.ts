import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CollectionRequestService } from '../../../../core/services/collection-request.service';
import { CollectionRequest } from '../../../../core/models/request.model';
import { RequestFormComponent } from '../request-form/request-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [RequestFormComponent,CommonModule],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit {
  requests: CollectionRequest[] = [];
  showRequestForm = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private requestService: CollectionRequestService
  ) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.requestService.getUserRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  onFormSubmitted(success: boolean) {
    if (success) {
      this.showRequestForm = false;
      this.loadRequests(); // Refresh the list
    }
  }

  editRequest(request: CollectionRequest) {
    // Logic to open the edit form with pre-filled data
    // You may want to set up a mechanism to pass the selected request data to the form
    console.log('Editing request:', request);
    this.showRequestForm = true; // Show the form for editing
    // You can also pass the current request data to the form component if needed
  }

  deleteRequest(requestId: String) {
    // if (confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
    //   this.requestService.deleteUserRequest(requestId).subscribe({
    //     next: () => {
    //       console.log('Request deleted successfully');
    //       this.loadRequests(); // Refresh the list after deletion
    //     },
    //     error: (error) => {
    //       console.error('Error deleting request:', error);
    //     }
    //   });
    // }
  }
}
