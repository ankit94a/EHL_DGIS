import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserIdleService {
  private activityEvents = ['click', 'mousemove', 'keydown'];
  private activityCallback: () => void;

  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() => {
      this.activityEvents.forEach(event =>
        window.addEventListener(event, () => {
          if (this.activityCallback) {
            this.zone.run(() => this.activityCallback());
          }
        })
      );
    });
  }

  onUserActivity(callback: () => void) {
    this.activityCallback = callback;
  }
}