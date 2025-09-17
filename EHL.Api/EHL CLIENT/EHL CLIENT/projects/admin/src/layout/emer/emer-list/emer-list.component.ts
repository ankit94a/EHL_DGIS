import { Component } from '@angular/core';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { EmerAddComponent } from '../emer-add/emer-add.component';
import { ApiService } from 'projects/shared/src/service/api.service';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { EmerModel } from 'projects/shared/src/models/emer.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { PolicyFilterModel } from 'projects/shared/src/models/policy&misc.model';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-emer-list',
    imports: [SharedLibraryModule, ZipperTableComponent, NgxSpinnerModule],
    templateUrl: './emer-list.component.html',
    styleUrl: './emer-list.component.scss'
})

export class EmerListComponent extends TablePaginationSettingsConfig {
  emerList: EmerModel[] = [];
  isRefresh: boolean = false;
  filterModel: PolicyFilterModel = new PolicyFilterModel();
  userType;
  constructor(private spinner: NgxSpinnerService,private toastr:ToastrService,private dialoagService: BISMatDialogService,private apiService: ApiService,private downloadService: DownloadService,private authService: AuthService) {
    super();
    
  }
  async ngOnInit(){
    this.userType = await this.authService.getRoleType();
    this.tablePaginationSettings.enableAction = true;
    if (this.userType == '1') {
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }
    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.filterModel.wingId = parseInt(this.authService.getWingId());
    this.getList();
  }
  getList() {
    this.spinner.show();
    this.apiService.getWithHeaders('emer/wing/' + this.filterModel.wingId).subscribe(res => {
        if (res) {
          this.emerList = res;
          this.spinner.hide();
        }
    });
  }

  edit(row) {
    row.isEdit = true;
    this.dialoagService.open(EmerAddComponent, row).then((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  del(row) {
    let deleteEmer: DeleteModel = new DeleteModel();
    deleteEmer.Id = row.item.id;
    deleteEmer.EmerNumber = row.item.emerNumber;
    deleteEmer.TableName = 'emer';
    this.dialoagService.confirmDialog(`Are you sure you want to delete EMER ${row.item.emerNumber}?`).subscribe((res) => {
        if (res) {
          this.apiService.postWithHeader(`attribute/delete`,deleteEmer).subscribe((res) => {
              if (res) {
                this.toastr.success('Deleted Successfully', 'Success');
                this.getList();
              }
          });
        }
      });
  }

  openDialog() {
    this.dialoagService.open(EmerAddComponent, null).then((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  getFileId($event) {
    var download = new DownloadModel();
    download.filePath = $event.filePath;
    download.name = $event.fileName;
    download.fileType = DownloadFileType.Emer;
    this.downloadService.download(download);
  }

  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }

  columns = [
    {
      name: 'fileName',
      displayName: 'File',
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
      hide: false,
      type: 'text',
    },
    {
      name: 'eqpt',
      displayName: 'EQPT',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'emerNumber',
      displayName: 'EmerNumber',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'subject',
      displayName: 'Subject',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'subFunction',
      displayName: 'Sub Funtion',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'subFunctionCategory',
      displayName: 'Sub FunctionCategory',
      isSearchable: true,
      hide: true,
      type: 'text',
    },
    {
      name: 'subFunctionType',
      displayName: 'Sub FunctionType',
      isSearchable: true,
      hide: true,
      type: 'text',
    },
    {
      name: 'remarks',
      displayName: 'Remarks',
      isSearchable: true,
      hide: true,
      type: 'text',
    },
  ];
}
