import { Component } from '@angular/core';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { EmerIndex } from 'projects/shared/src/models/emer.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { EmerIndexAddComponent } from '../emer-index-add/emer-index-add.component';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { ToastrService } from 'ngx-toastr';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-emer-index',
    imports: [SharedLibraryModule, ZipperTableComponent],
    templateUrl: './emer-index.component.html',
    styleUrl: './emer-index.component.scss'
})
export class EmerIndexComponent extends TablePaginationSettingsConfig {
  emerIndexList: EmerIndex[] = [];
  wingId: number;
  isRefresh: boolean = false;
  userType;
  constructor(private spinner: NgxSpinnerService,private apiService: ApiService,private authService: AuthService,private dialogService: BISMatDialogService,
    private toastr: ToastrService,private downloadService:DownloadService) {
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
    this.wingId = parseInt(this.authService.getWingId());
    this.getAllIndex();
  }
  edit(row) {
    row.isEdit = true;
    this.dialogService.open(EmerIndexAddComponent, { data: row }).then((res) => {
      if (res) {
          this.getAllIndex();
        }
      });
  }

  delete(row) {
    let deleteEmerIndex: DeleteModel = new DeleteModel();
    deleteEmerIndex.Id = row.item.id;
    deleteEmerIndex.TableName = 'emerindex';
    this.dialogService.confirmDialog(`Are you sure you want to delete EMER Index ${row.item.emerNumber}?`).subscribe((res) => {
      if (res) {
          this.apiService.postWithHeader(`attribute/delete`, deleteEmerIndex).subscribe({
              next: (res) => {
                this.toastr.success('Deleted Successfully', 'Success');
                this.getAllIndex();
              },
              error: (err) => {
                this.toastr.error('Failed to Delete', 'Error');
              },
            });
        }
      });
  }

  openDialog() {
    this.dialogService.open(EmerIndexAddComponent, null, '50vw').then((res) => {
      if (res) {
        this.getAllIndex();
      }
    });
  }

  getFileId($event) {
    var download = new DownloadModel();
    download.filePath = $event.filePath;
    download.name = $event.fileName;
    download.fileType = DownloadFileType.Index;
    this.downloadService.download(download)
  }

  getAllIndex() {
    this.spinner.show();
    this.apiService.getWithHeaders('emer/index/' + this.wingId).subscribe(async (res) => {
      if (res) {
          this.spinner.hide();
          this.emerIndexList = res;
        }
      });
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
      name: 'emerNumber',
      displayName: 'EmerNumber',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'category',
      displayName: 'Category',
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
  ];
}
