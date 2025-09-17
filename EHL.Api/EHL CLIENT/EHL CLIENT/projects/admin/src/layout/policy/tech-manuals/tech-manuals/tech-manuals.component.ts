import { Category, Eqpt, SubCategory, Wing } from 'projects/shared/src/models/attribute.model';
import { TechManualsAddComponent } from '../tech-manuals-add/tech-manuals-add.component';
import { Component } from '@angular/core';
import { FilterModel, Policy, PolicyFilterModel, } from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-tech-manuals',
    imports: [SharedLibraryModule, ZipperTableComponent],
    templateUrl: './tech-manuals.component.html',
    styleUrl: './tech-manuals.component.scss'
})
export class TechManualsComponent extends TablePaginationSettingsConfig{
  policyList:Policy[]=[];
  categoryList:Category[]=[];
  wingList:Wing[]=[];
  filterModel:PolicyFilterModel = new PolicyFilterModel();
  isRefresh:boolean=false;
  clonedPolicy:Policy[]=[];
  userType;
  constructor(private spinner: NgxSpinnerService,private dialogService:BISMatDialogService,private apiService:ApiService,private downloadService:DownloadService,private authService:AuthService,private toastr: ToastrService){
    super();
    
  }
  async ngOnInit(){
    this.userType = this.authService.getRoleType()
    this.tablePaginationSettings.enableAction = true;
    if(this.userType == '1'){
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.filterModel.wingId = parseInt(this.authService.getWingId())
    this.getPolicyByWing();
  }

  getFileId($event) {
    var download = new DownloadModel();
    download.filePath = $event.filePath;
    download.name = $event.fileName;
    download.fileType = DownloadFileType.Policy;
    this.downloadService.download(download)
  }

  edit(row){
    row.isEdit = true;
    this.dialogService.open(TechManualsAddComponent,row).then(res =>{
      if(res){
        this.getPolicyByWing();
      }
    })
  }

  delete(row) {
    let deleteTechManual: DeleteModel = new DeleteModel();
    deleteTechManual.Id = row.item.id;
    deleteTechManual.TableName = "Policy";
    this.dialogService.confirmDialog(`Are you sure you want to delete this ${row.item.type}?`).subscribe(res => {
      if (res) {
        this.apiService.postWithHeader(`attribute/delete`, deleteTechManual).subscribe({
          next: (res) => {
            this.getPolicyByWing();
            this.toastr.success('Deleted Successfully', 'Success');
          },
          error: (err) => {
            this.toastr.error('Failed to Delete', 'Error');
          }
        });
      }
    });
  }

  openDailog(){
    this.dialogService.open(TechManualsAddComponent,null,'50vw').then(res =>{
      if(res){
        this.getPolicyByWing();
      }
    })
  }

  filterPolicy(type){
    if(type == null)
      return this.policyList = [...this.clonedPolicy]
      this.policyList = this.clonedPolicy.filter(item => item.type == type);
  }

  getPolicyByWing(){
    this.spinner.show();
    this.apiService.getWithHeaders('policy/wing/'+this.filterModel.wingId).subscribe(async(res) =>{
      if(res){
        this.policyList= res;
        this.spinner.hide();
        this.clonedPolicy = [...this.policyList]
      }
    })
  }

  getCategory(wingId){
    this.apiService.getWithHeaders('attribute/category'+wingId).subscribe(res =>{
      if(res){
        this.categoryList=res;
      }
    })
  }

  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
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
      name: 'eqpt', displayName: 'Eqpt', isSearchable: true,hide: false,type:'text'
    },
    {
      name: 'remarks', displayName: 'Remarks', isSearchable: true,hide: false,type:'text'
    }
  ]
}
