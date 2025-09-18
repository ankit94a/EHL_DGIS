import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { Component } from '@angular/core';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { LoginComponent } from '../../../login/login.component';
import { Policy } from 'projects/shared/src/models/policy&misc.model';
import { DownloadModel } from 'projects/shared/src/models/download.model';
import { DownloadFileType } from 'projects/shared/src/models/enum.model';
import { DownloadService } from 'projects/shared/src/service/download.service';

@Component({
    selector: 'app-landing-page',
    imports: [SharedLibraryModule,],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  latestEmer = [];
  latestTechnicalReference: Policy[] = [];
  ipAddress: string = '';

  constructor(private downloadService: DownloadService, private apiService: ApiService, private dialogService: BISMatDialogService) {
  }
  ngOnInit() {
    this.getLatestPolicy();
    this.getLatestEmer();
  }
  getLatestEmer() {
    // debugger
    this.apiService.getWithHeaders('emer/latest/emer').subscribe(res => {
      if (res) {
        this.latestEmer = res;
      }
    })
  }
  getLatestPolicy() {
    this.apiService.getWithHeaders('emer/latest/policy').subscribe(res => {
      if (res) {
        this.latestTechnicalReference = res;
      }
    })
  }

  openDialog() {
    this.dialogService.open(LoginComponent, null, '30vw', '58vh');
  }
  getFileId($event, type) {
    var download = new DownloadModel();
    download.filePath = $event.filePath;
    download.name = $event.fileName;
    if (type == 'emer') {
      download.fileType = DownloadFileType.Emer;
    } else {
      download.fileType = DownloadFileType.Policy;
    }
    this.downloadService.download(download)
  }
}
