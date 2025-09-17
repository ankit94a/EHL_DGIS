import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private inactivityTimer: any;
  private countdownTimer: any;
  private timeoutPeriod = 10 * 60 * 1000;
  private countdownSubject = new Subject<number>();
  private logoutSubject = new Subject<void>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.setupActivityListeners();
    this.resetInactivityTimer();
  }

  get countdown$(): Observable<number> {
    return this.countdownSubject.asObservable();
  }

  get onLogout$(): Observable<void> {
    return this.logoutSubject.asObservable();
  }

  private setupActivityListeners(): void {
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keypress', this.resetInactivityTimer.bind(this));
    window.addEventListener('scroll', this.resetInactivityTimer.bind(this));
    window.addEventListener('click', this.resetInactivityTimer.bind(this));
    window.addEventListener('touchstart', this.resetInactivityTimer.bind(this));
  }

  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownTimer);

    this.inactivityTimer = setTimeout(() => {
      this.startLogoutCountdown();
    }, this.timeoutPeriod - 5000);
  }

  private startLogoutCountdown(): void {
    let countdown = 5;

    this.countdownTimer = setInterval(() => {
      this.ngZone.run(() => {
        this.countdownSubject.next(countdown);
        if (countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.performLogout();
        }

        countdown--;
      });
    }, 1000);
  }

  private performLogout(): void {
    this.http.post('/api/logout', {}).subscribe({
      next: () => {
        this.logoutSubject.next();
        this.router.navigate(['/login']);
        sessionStorage.clear();
      },
      error: () => {
        this.logoutSubject.next();
        this.router.navigate(['/login']);
        sessionStorage.clear();
      }
    });
  }

  destroy(): void {
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownTimer);
    window.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.removeEventListener('keypress', this.resetInactivityTimer.bind(this));
    window.removeEventListener('scroll', this.resetInactivityTimer.bind(this));
    window.removeEventListener('click', this.resetInactivityTimer.bind(this));
    window.removeEventListener('touchstart', this.resetInactivityTimer.bind(this));
  }
}
