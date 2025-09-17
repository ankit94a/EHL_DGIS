import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DownloadModel } from '../models/download.model';
import { BISMatDialogService } from './insync-mat-dialog.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private apiService: ApiService,private http: HttpClient) { }

  download(downloadModel: DownloadModel) {

    if (!downloadModel || !downloadModel.filePath) {
      return;
    }

    this.apiService.postWithHeaderToDownload('file/download', downloadModel).subscribe((res) => {
      if (!res || res.size === 0) {
        return;
      }

      const blob = new Blob([res], { type: res.type });
      const url = window.URL.createObjectURL(blob);
      const linkElement = document.createElement('a');
      linkElement.href = url;

      let fileName = downloadModel.name || "downloaded_file.pdf";

      linkElement.download = fileName;
      document.body.appendChild(linkElement);
      linkElement.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(linkElement);
    }, error => {
    });
  }
}


