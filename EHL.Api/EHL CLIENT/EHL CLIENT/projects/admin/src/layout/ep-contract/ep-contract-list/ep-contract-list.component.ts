
import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import {Policy,PolicyFilterModel,} from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { EpContractAddComponent } from '../ep-contract-add/ep-contract-add.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
// import { EcrTokenComponent } from 'projects/shared/src/component/ecr-token/ecr-token.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-ep-contract-list',
    imports: [SharedLibraryModule, ZipperTableComponent, 
      // EcrTokenComponent
    ],
    templateUrl: './ep-contract-list.component.html',
    styleUrl: './ep-contract-list.component.scss'
})
export class EpContractListComponent extends TablePaginationSettingsConfig {
  epContractList: Policy[] = [];
  filterModel: PolicyFilterModel = new PolicyFilterModel();
  isRefresh: boolean = false;
  userType;
  isOfficerLoggedIn:boolean=true;
  clonedPolicy:Policy[] = [];
  constructor(private spinner: NgxSpinnerService,private apiService: ApiService,private authService: AuthService,private dailogService: BISMatDialogService,private dialogService: BISMatDialogService,private toastr: ToastrService,private downloadService:DownloadService) {
    super();

  }
  async ngOnInit(){
    this.userType = await this.authService.getRoleType();
    this.filterModel.type = 'Ep Contract';
    this.filterModel.wingId = parseInt(this.authService.getWingId());
    this.tablePaginationSettings.enableAction = true;
    this.tablePaginationSettings.enableColumn = true;
    if (this.userType == '1') {
    
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
      // this.getAllContract();
    }else{
        // this.isOfficerLoggedIn = false;
        // this.isOfficerLoggedIn = true;
    }
       this.getAllContract();
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
  }
  filterPolicy(contractType){
    if(contractType == null)
      return this.epContractList = [...this.clonedPolicy]
      this.epContractList = this.clonedPolicy.filter(item => item.contractType == contractType);
  }

  getAllContract() {
    
    this.spinner.show();
    this.apiService.postWithHeader('policy/type', this.filterModel).subscribe(async(res) => {
      if (res) {
        this.spinner.hide();
        
          this.epContractList = res;
          this.clonedPolicy = [...this.epContractList]
        }
      });
  }
  // isVarified(res){

  //   if(res){
  //     this.isOfficerLoggedIn=true;
  //   this.getAllContract()
  //   }
  // }

  openDailog() {
    this.dailogService.open(EpContractAddComponent, null).then(res =>{
      if(res){
        this.getAllContract();
      }
    });
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
    this.dialogService.open(EpContractAddComponent,row).then(res =>{
      if(res){
        this.getAllContract();
      }
    })
  }

  delete(row) {
    let deleteEpContract: DeleteModel = new DeleteModel();
    deleteEpContract.Id = row.item.id;
    deleteEpContract.TableName = 'Policy';
    this.dialogService.confirmDialog('Are you sure you want to delete this Ep-Contract?').subscribe((res) => {
      if (res) {
          this.apiService.postWithHeader(`attribute/delete`, deleteEpContract).subscribe({
              next: (res) => {
                this.toastr.success('Deleted Successfully', 'Success');
                this.getAllContract();
              },
              error: (err) => {
                this.toastr.error('Failed to Delete', 'Error');
              },
            });
        }
      });
  }

  columns = [
    {
      name: 'fileName',
      displayName: 'File Name',
      isSearchable: true,
      hide: false,
      valueType: 'link',
      valuePrepareFunction: (row) => {
        return row.fileName;
      },
    },
    {
      name: 'category',
      displayName: 'Category',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'subCategory',
      displayName: 'Sub Category',
      isSearchable: true,
      hide: true,
      type: 'text',
    },
    {
      name: 'eqpt',
      displayName: 'Eqpt',
      isSearchable: true,
      hide: true,
      type: 'text',
    },
    {
      name: 'remarks',
      displayName: 'Remarks',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
  ];
}
