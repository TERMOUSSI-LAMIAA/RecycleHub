import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { authReducer } from './app/features/auth/store/auth.reducer';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { requestReducer } from './app/features/collection-requests/store/collection-requests.reducer';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ auth: authReducer }),
    provideRouter(routes),
    provideStore({ requests: requestReducer })
  ],
});