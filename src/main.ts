import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { authReducer } from './app/features/auth/store/auth.reducer';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { collectionRequestsReducer,  } from './app/features/collection-requests/store/collection-requests.reducer';
import { CollectionRequestsEffects } from './app/features/collection-requests/store/request.effects';
import { provideEffects } from '@ngrx/effects';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ auth: authReducer }),
    provideRouter(routes),
    provideStore({ collectionRequests: collectionRequestsReducer }),
    provideEffects([CollectionRequestsEffects])
  ],
});