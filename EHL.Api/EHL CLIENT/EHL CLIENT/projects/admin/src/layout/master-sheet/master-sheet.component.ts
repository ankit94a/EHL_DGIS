import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { MasterSheetModel } from 'projects/shared/src/models/emer.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
    selector: 'app-master-sheet',
    imports: [SharedLibraryModule, ZipperTableComponent, RouterModule],
    templateUrl: './master-sheet.component.html',
    styleUrl: './master-sheet.component.scss'
})
export class MasterSheetComponent extends TablePaginationSettingsConfig{
  masterSheetList:MasterSheetModel[]=[];
  isRefresh:boolean=false;
  constructor(private apiService:ApiService){
    super();
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false
    this.getAll();
  }

  getAll(){
    this.apiService.getWithHeaders('emer/mastersheet').subscribe(res =>{
      if(res){
        this.masterSheetList = res;
      }
    })
  }

  columns = [
    {
      name: 'wing', displayName: 'Wing', isSearchable: false,hide: false,type:'text'
    },
    {
      name: 'category', displayName: 'Category', isSearchable: false,hide: false,type:'text'
    },
    {
      name: 'eqpt', displayName: 'EQPT', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'emerNumber', displayName: 'EmerNumber', isSearchable: false,hide: false,type:'text'
    },
    {
      name: 'subFunction', displayName: 'Sub Funtion', isSearchable: false,hide: false,type:'text'
    },
  ]
}
