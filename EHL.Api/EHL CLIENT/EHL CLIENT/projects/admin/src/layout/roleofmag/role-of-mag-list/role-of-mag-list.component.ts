import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { RoleOfMagAddComponent } from '../role-of-mag-add/role-of-mag-add.component';
import { RoleOfMag } from 'projects/shared/src/models/emer.model';
import { DeactivateModel } from 'projects/shared/src/models/base.model';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-role-of-mag-list',
    imports: [SharedLibraryModule, ZipperTableComponent],
    templateUrl: './role-of-mag-list.component.html',
    styleUrl: './role-of-mag-list.component.scss'
})
export class RoleOfMagListComponent extends TablePaginationSettingsConfig{
  roleofMagList:RoleOfMag[] = [];
  userType;
  isRefresh:boolean = false;
  constructor(private dialogService:BISMatDialogService, private apiService:ApiService,private toastr:ToastrService,private authService : AuthService){
    super();
    
  }
  async ngOnInit(){
    this.userType = await firstValueFrom(this.authService.roleType$);
    this.tablePaginationSettings.enableAction = true;
    if (this.userType == '1') {
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.getList();
  }
  getList(){
    this.apiService.getWithHeaders('roleofmag').subscribe(res =>{
      if(res){
        this.roleofMagList = res;
      }else{
        this.toastr.error("getting error in fetching roleofmag list",'error');
      }
    })
  }
edit(row){
  this.dialogService.open(RoleOfMagAddComponent, row).then((res) => {
      if (res) {
        this.getList();
      }
    });
}
del(row){
    this.dialogService
      .confirmDialog(`Are you sure you want to delete Role of MAG ${row.item.nameOfOfficer}?`).subscribe((res) => {
        if (res) {
          let deactivate = new DeactivateModel();
          deactivate.tableName = 'roleofmag';
          deactivate.id = row.item.id;
          this.apiService.postWithHeader(`landingpage/deativate`,deactivate)
            .subscribe((res) => {
              if (res) {
                this.getList();
              }
            });
        }
      });
}
  openDialog(){
  this.dialogService.open(RoleOfMagAddComponent, null).then((res) => {
      if (res) {
        this.getList();
      }
    });
  }
  columns = [
    {
      name: 'name',
      displayName: 'Name of MAG & Location',
      isSearchable: true,
      hide: false,
    },
    {
      name: 'wing',
      displayName: 'Wing',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'nameOfOfficer',
      displayName: 'Name of Offr',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'appointment',
      displayName: 'Appt',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'militaryNo',
      displayName: 'Mil (O)',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'mobile',
      displayName: 'Mob No',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'civilNo',
      displayName: 'Civ (O)',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'eqptDealing',
      displayName: 'Eqpt Dealing',
      isSearchable: true,
      hide: false,
      type: 'text',
    }
  ];
}
