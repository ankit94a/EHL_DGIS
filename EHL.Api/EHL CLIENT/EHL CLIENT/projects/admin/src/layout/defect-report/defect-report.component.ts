
import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { Policy, PolicyFilterModel } from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { DefectReportAddComponent } from './defect-report-add/defect-report-add.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-defect-report',
    imports: [SharedLibraryModule, ZipperTableComponent],
    templateUrl: './defect-report.component.html',
    styleUrl: './defect-report.component.scss'
})
export class DefectReportComponent extends TablePaginationSettingsConfig{
  defectReports:Policy[]=[];
  filterModel:Policy = new Policy();
  isRefresh:boolean=false;
  userType;
  constructor(private spinner: NgxSpinnerService,private authService:AuthService,private apiService:ApiService,private dialogService:BISMatDialogService,private toastr: ToastrService,private downloadService:DownloadService, ){
    super();
    
  }
  async ngOnInit(){
    this.userType = await firstValueFrom(this.authService.roleType$);
    this.tablePaginationSettings.enableAction = true;
    if(this.userType == '1'){
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }

    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.filterModel.wingId = parseInt(this.authService.getWingId())
    this.filterModel.type = 'Defect Report'
    this.getPolicyByWing();
  }
    openDailog(){
      this.dialogService.open(DefectReportAddComponent,null,'50vw').then(res =>{
        if(res){
          this.getPolicyByWing();
        }
      })
    }
  getFileId($event) {
    var download = new DownloadModel();
    download.filePath = $event.filePath;
    download.name = $event.fileName;
    download.fileType = DownloadFileType.Policy;
    this.downloadService.download(download)
  }
  getPolicyByWing(){
    this.spinner.show();
    this.apiService.postWithHeader('policy/type/',this.filterModel).subscribe(async(res )=>{
      if(res){
        this.spinner.hide();
        this.defectReports = res
      }
    })
  }
 edit(row){
    row.isEdit = true;
    this.dialogService.open(DefectReportAddComponent,row).then(res =>{
      if(res){
        this.getPolicyByWing();
      }
    })
  }
   delete(row) {
      let deleteDefectReport: DeleteModel = new DeleteModel();
      deleteDefectReport.Id = row.item.id;
      deleteDefectReport.TableName = "Policy";

      this.dialogService.confirmDialog("Are you sure you want to delete this Defect Report?").subscribe(res => {
        if (res) {
          this.apiService.postWithHeader(`attribute/delete`, deleteDefectReport).subscribe({
            next: (res) => {
              this.toastr.success('Deleted Successfully', 'Success');
              this.getPolicyByWing
            },
            error: (err) => {
              this.toastr.error('Failed to Delete', 'Error');
            }
          });
        }
      });
    }

  columns = [
    {
      name: 'fileName', displayName: 'File Name', isSearchable: true,hide: false,valueType:'link',valuePrepareFunction:(row) =>{
        return row.fileName
      }
    },
    {
      name: 'category', displayName: 'Category', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'subCategory', displayName: 'Sub Category', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'eqpt', displayName: 'eqpt', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'remarks', displayName: 'Remarks', isSearchable: true,hide: false,type:'text'
    }
  ]
}
