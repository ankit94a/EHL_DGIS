import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { TechnicalAoAi } from 'projects/shared/src/models/technicalAoAi.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { AddTechnicalAoAiComponent } from '../techincal-ao-ai/add-technical-ao-ai/add-technical-ao-ai.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DownloadService } from 'projects/shared/src/service/download.service';

// import { EcrTokenComponent } from 'projects/shared/src/component/ecr-token/ecr-token.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-techincal-ao-ai',
    imports: [SharedLibraryModule, ZipperTableComponent, 
      // EcrTokenComponent
    ],
    templateUrl: './techincal-ao-ai.component.html',
    styleUrl: './techincal-ao-ai.component.scss'
})
export class TechincalAoAiComponent extends TablePaginationSettingsConfig {
  TechnicalAoAi: TechnicalAoAi[] = [];
  filterModel: TechnicalAoAi = new TechnicalAoAi();
  isRefresh: boolean = false;
  userType;
  isOfficerLoggedIn:boolean=true;
  constructor(private spinner: NgxSpinnerService,private authService: AuthService,private apiService: ApiService,private dialogService: BISMatDialogService,private toastr: ToastrService,private downloadService:DownloadService) {
    super();
    
  }
  async ngOnInit(){
    this.userType = await this.authService.getRoleType();
    this.tablePaginationSettings.enableAction = true;
    if (this.userType == '1') {
      this.isOfficerLoggedIn=true;
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
      // this.getTechnicalAoAi();
    }else{
        // this.isOfficerLoggedIn = false;
    }
    this.getTechnicalAoAi();
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
  }
  openDailog() {
    this.dialogService.open(AddTechnicalAoAiComponent, null, '50vw').then((res) => {
      if (res) {
          this.getTechnicalAoAi();
        }
      });
  }
  // isVarified(res){
  //   if(res){
  //     this.getTechnicalAoAi()
  //   }
  // }

  getTechnicalAoAi() {
    this.spinner.show()
    this.apiService.getWithHeaders('TechnicalAoAi').subscribe(async (res) => {
      if (res) {
        this.spinner.hide();
        this.isOfficerLoggedIn = true;
        this.TechnicalAoAi = res;
      }
    });
  }

 getFileId($event) {
    var download = new DownloadModel();
    download.filePath = $event.filePath;
    download.name = $event.fileName;
    download.fileType = DownloadFileType.TechnicalAoAi;
    this.downloadService.download(download)
  }

  edit(row) {
    row.isEdit = true;
    this.dialogService.open(AddTechnicalAoAiComponent, row).then((res) => {
      if (res) {
        this.getTechnicalAoAi();
      }
    });
  }

  delete(row) {
    let deleteTechnicalAoAi: DeleteModel = new DeleteModel();
    deleteTechnicalAoAi.Id = row.item.id;
    deleteTechnicalAoAi.TableName = 'TechnicalAoAi';
    this.dialogService.confirmDialog('Are you sure to delete TechnicalAoAi?').subscribe((res) => {
        if (res) {
          this.apiService.postWithHeader(`attribute/delete`, deleteTechnicalAoAi).subscribe({
              next: (res) => {
                this.getTechnicalAoAi();
                this.toastr.success('Deleted Successfully', 'Success');
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
      name: 'subject',
      displayName: 'Subject',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'reference',
      displayName: 'Reference',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'type',
      displayName: 'Type',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
  ];
}
