import { AuthService } from 'projects/shared/src/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { EcrTokenComponent } from 'projects/shared/src/component/ecr-token/ecr-token.component';
import { ApiService } from 'projects/shared/src/service/api.service';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';



@Component({
  selector: 'app-emer-confidential',
  imports: [
    EcrTokenComponent,
    PdfViewerModule],
  standalone:true,
  templateUrl: './emer-confidential.component.html',
  styleUrl: './emer-confidential.component.scss'
})
export class EmerConfidentialComponent{
  isEcrUser: boolean = false;
  isOfficerLoggedIn: boolean = true;
  userType;
  fileData: string | null = null;
  blobUrl;
  ipAddress
  armyNo;
  message;
  allTokens;
  tokenCheckInterval: any;
  tokenDetails: any;
  validationResult: any;
  constructor(private authService: AuthService, private apiService: ApiService) {
    
  }
 
  async ngOnInit(){
    (window as any).pdfWorkerSrc = '/pdfjs/pdf.worker.mjs'
    this.userType = await firstValueFrom(this.authService.roleType$);
    if(this.userType == 1){
      
      this.getConfidentialFile()
    }else{
      this.isOfficerLoggedIn = false;
    }
  }
  isVarified(res){
    if(res){
      this.isOfficerLoggedIn=true;
      this.getConfidentialFile()
   
    }
  }
  
  getConfidentialFile() { 
    const file = { fileType: 'Confidential' };
    this.apiService.postWithHeaderToDownload('file/getpdf', file).subscribe(async (res: Blob) => {
        if (!res || res.size === 0) {
          return;
        }
        const url2 = URL.createObjectURL(res);
        this.fileData = url2;
      });
  }

  downloadFile(){
    const file = {fileType:'Confidential'}
    this.apiService.postWithHeaderToDownload('file/getpdf',file).subscribe((res:Blob) =>{
      if(res){
        const blob = new Blob([res],{type:'application/pdf'})
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Confidential.pdf'
        a.click()
        window.URL.revokeObjectURL(url);
      }
    })
  }

}

