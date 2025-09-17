import { Component, effect, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { BISMatDialogService } from '../../service/insync-mat-dialog.service';
import {  Observable } from 'rxjs';
import { UserIdleService } from '../../service/user-idol.service';
import { TimerPipe } from '../pipes/timer.pipe';
import { ApiService } from '../../service/api.service';
import { LoginModel } from '../../models/login.model';

@Component({
    selector: 'app-header',
    imports: [SharedLibraryModule, RouterModule, TimerPipe],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  wing$: Observable<string | null>;
  private userIdleService = inject(UserIdleService);
  timer$ = signal(15 * 60);
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService, private dialogService: BISMatDialogService, private apiService: ApiService) {
    this.wing$ = this.authService.getWingName();
    this.setupUserIdleTracking();
  }

  ngOnInit(): void {

  }
  setupUserIdleTracking() {
    this.userIdleService.onUserActivity(() => {
      this.timer$.set(15 * 60);
    });


    effect(() => {
      const interval = setInterval(() => {
        const current = this.timer$();
        if (current > 0) {
          this.timer$.set(current - 1);
        } else {
          clearInterval(interval);
          this.onLoggedout();
        }
      }, 1000);
    });
  }


  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  removeWing() {
    this.authService.clearWingDetails();
  }

  onLoggedout() {
    var user = new LoginModel()
    this.apiService.postWithHeader('auth/logout',user).subscribe(res => {
      if (res) {
        this.authService.clear()
        this.authService.clearWingDetails();
      }
    })

  }
}
