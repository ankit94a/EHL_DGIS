import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Wait until we get the roleType from BehaviorSubject
    const role = await firstValueFrom(this.authService.roleType$);

    if (role === '1') {
      return true; // allow access
    } else {
      this.router.navigate(['/landing'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
