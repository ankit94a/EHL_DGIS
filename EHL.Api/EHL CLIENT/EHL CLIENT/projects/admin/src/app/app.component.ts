import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as FullStory from '@fullstory/browser';
import { environment } from 'projects/shared/src/enviroments/environments.development';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'admin';
  constructor(){
    FullStory.init({
      orgId: 'TMT7D',
      devMode: !environment.production
    });
  }
}
