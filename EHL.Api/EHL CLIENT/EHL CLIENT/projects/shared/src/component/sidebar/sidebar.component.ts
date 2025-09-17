import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLibraryModule } from '../../shared-library.module';
import { AuthService } from '../../service/auth.service';
import { FilterSidebarPipe } from '../pipes/filter-sidebar.pipe';

@Component({
    selector: 'app-sidebar',
    imports: [SharedLibraryModule, RouterModule, FilterSidebarPipe],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public showMenu!: string;
  sideBarMenus: any;
  permissionList: any = [];
  @Output() sidenavClose = new EventEmitter();
  @Output() isloaded = new EventEmitter();
  roleType;
  constructor(private http: HttpClient,private authService:AuthService) {
    this.http.get<any[]>('/menu.json').subscribe(data => {
      this.sideBarMenus = data;
    });
    

  }

  async ngOnInit() {
    this.roleType = await this.authService.getRoleType();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  addExpandClass(menuText: string) {
    this.showMenu = this.showMenu === menuText ? '>' : menuText;
  }

}
