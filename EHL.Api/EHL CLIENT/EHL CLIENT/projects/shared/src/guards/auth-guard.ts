import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard  {
  constructor(private helper: AuthService,public router : Router ) { }
  async canActivate(
    state: RouterStateSnapshot): Promise<boolean> {

    const role = await this.helper.getRoleType();
    if (role == '1') return true;
    else {
      this.router.navigate(['/landing'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

