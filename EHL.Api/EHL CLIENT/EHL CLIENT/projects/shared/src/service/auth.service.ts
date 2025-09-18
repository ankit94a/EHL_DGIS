import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private wingSubject = new BehaviorSubject<string | null>(null);
  private roleTypeSubject = new BehaviorSubject<string | null>(null);
  roleType$ = this.roleTypeSubject.asObservable();

  constructor(private router: Router, private apiService: ApiService) {
    const storedWing = sessionStorage.getItem('wing');

    this.wingSubject = new BehaviorSubject<string | null>(storedWing);
  }

  clear() {
    sessionStorage.clear();
    this.navigateToLogin(this.router.routerState.snapshot.url);

  }
  public navigateToLogin(stateUrl) {
    this.router.navigate(['/landing'], { queryParams: { 1: { returnUrl: stateUrl } } });
  }
  public setWingDetails(wing: { id: string; name: string }) {
    sessionStorage.setItem('wingId', wing.id);
    sessionStorage.setItem('wing', wing.name);

    this.wingSubject.next(wing.name);
  }
  // async getRoleType(): Promise<string> {
  //   try {
  //     var user = new LoginModel()
  //     const res = await firstValueFrom(this.apiService.postWithHeader('status/roletype', user));
  //     if (res.isAuthenticated) {
  //       return '1';
  //     } else {
  //       return '0';
  //     }
  //   } catch (err) {
  //     return '0';
  //   }
  // }
  setRoleType(){
    this.roleTypeSubject.next('1');
  }
  async getRoleType(): Promise<void> {
    try {
      const user = new LoginModel();
      const res: any = await firstValueFrom(this.apiService.postWithHeader('status/roletype', user));

      if (res.isAuthenticated) {
        this.roleTypeSubject.next('1');
      } else {
        this.roleTypeSubject.next('0');
      }
    } catch (err) {
      this.roleTypeSubject.next('0');
    }
  }

  // Utility method if you need current value without subscribing
  get currentRoleType(): string | null {
    return this.roleTypeSubject.value;
  }
  public get wing$(): Observable<string | null> {
    return this.wingSubject.asObservable();
  }

  public getWingName(): Observable<string | null> {
    return this.wing$;
  }

  public getWingId() {
    return sessionStorage.getItem("wingId")
  }
  public clearWingDetails() {
    sessionStorage.removeItem('wingId');
    sessionStorage.removeItem('wing');

    this.wingSubject.next(null);
  }

}
