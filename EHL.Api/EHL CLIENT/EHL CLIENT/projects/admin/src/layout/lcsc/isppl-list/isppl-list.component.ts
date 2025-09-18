import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DeleteModel } from 'projects/shared/src/models/attribute.model';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { PolicyFilterModel } from 'projects/shared/src/models/policy&misc.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { DownloadService } from 'projects/shared/src/service/download.service';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { IspplAddComponent } from '../isppl-add/isppl-add.component';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-isppl-list',
  imports: [SharedLibraryModule,ZipperTableComponent, NgxSpinnerModule],
  templateUrl: './isppl-list.component.html',
  styleUrl: './isppl-list.component.scss'
})
export class IspplListComponent extends TablePaginationSettingsConfig{
droneList = [];
  isRefresh: boolean = false;
  filterModel: PolicyFilterModel = new PolicyFilterModel();
  userType;
  clonedDrone = [];
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private dialoagService: BISMatDialogService, private apiService: ApiService, private downloadService: DownloadService, private authService: AuthService) {
    super();

  }
   async ngOnInit() {
    this.userType = await firstValueFrom(this.authService.roleType$);
    if (this.userType == '1') {
      this.tablePaginationSettings.enableAction = true;
      this.tablePaginationSettings.enableEdit = true;
      this.tablePaginationSettings.enableDelete = true;
    }
    // this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.filterModel.wingId = parseInt(this.authService.getWingId());
    this.filterModel.type = 'ISPPL';
    this.getList();
  }

  getList() {
    this.spinner.show();
    this.apiService.postWithHeader('landingpage/type/' , this.filterModel).subscribe(res => {
        if (res) {
          this.droneList = res;
          this.clonedDrone = [...this.droneList]
          this.spinner.hide();
        }
    });
  }

  edit(row) {
      row.isEdit = true;
      this.dialoagService.open(IspplAddComponent, row).then((res) => {
        if (res) {
          this.getList();
        }
      });
    }

    del(row) {
      let deleteEmer: DeleteModel = new DeleteModel();
      deleteEmer.Id = row.item.id;
      deleteEmer.TableName = 'DroneAndIcsc';
      this.dialoagService.confirmDialog(`Are you sure you want to delete ?`).subscribe((res) => {
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
      this.dialoagService.open(IspplAddComponent, null).then((res) => {
        if (res) {
          this.getList();
        }
      });
    }

    getFileId($event) {
      var download = new DownloadModel();
      download.filePath = $event.filePath;
      download.name = $event.fileName;
      download.fileType = DownloadFileType.DroneInduction;
      this.downloadService.download(download);
    }

    getReadableFileSize(size: number): string {
      if (size < 1024) return `${size} bytes`;
      else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
      else return `${(size / 1048576).toFixed(2)} MB`;
    }
filterPolicy(type){
    if(type == null)
      return this.droneList = [...this.clonedDrone]
      this.droneList = this.clonedDrone.filter(item => item.type == type);
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
        name: 'nomenClature',
        displayName: 'Eqpt',
        isSearchable: true,
        hide: false,
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
