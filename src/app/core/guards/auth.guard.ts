import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { take, map } from "rxjs";
import { selectIsAuthenticated } from "../../features/auth/store/auth.selectors";
import { AuthService } from "../services/auth.service";

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   console.log('Auth Guard Running for route:', state.url);

//   if (!authService.isAuthenticated()) {
//     console.log('Not authenticated, redirecting to login');
//     router.navigate(['/login'], {
//       queryParams: { returnUrl: state.url }
//     });
//     return false;
//   }

//   console.log('Authentication successful');
//   return true;
// };

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Auth Guard Running for route:', state.url);

  if (!authService.isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const currentUser = authService.getCurrentUser();

  // Get allowed user types from route data
  const allowedUserTypes = route.data?.['allowedUserTypes'] as string[];

  // If no restrictions are set, allow access
  if (!allowedUserTypes || allowedUserTypes.length === 0) {
    return true;
  }

  // Check if user type is allowed
  if (currentUser && allowedUserTypes.includes(currentUser.userType)) {
    console.log('User type authorized');
    return true;
  }

  console.log('User type not authorized, redirecting to appropriate dashboard');

  // Redirect to appropriate dashboard based on user type
  if (currentUser?.userType === 'individual') {
    router.navigate(['/requests/list']);
  } else if (currentUser?.userType === 'collector') {
    router.navigate(['/collector/dashboard']);
  }

  return false;
};
