import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { Router } from "express";
import { take, map } from "rxjs";
import { selectIsAuthenticated } from "../../features/auth/store/auth.selectors";

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
      return true;
    })
  );
};