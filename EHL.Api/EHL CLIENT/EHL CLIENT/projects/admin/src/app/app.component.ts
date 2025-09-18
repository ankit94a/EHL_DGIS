import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as FullStory from '@fullstory/browser';
import { environment } from 'projects/shared/src/enviroments/environments.development';
import { AuthService } from 'projects/shared/src/service/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'admin';
  userType;
  constructor(private authService:AuthService){
    FullStory.init({
      orgId: 'TMT7D',
      devMode: !environment.production
    });
    
  }
  ngOnInit() {
   this.authService.getRoleType(); 
  }
}
