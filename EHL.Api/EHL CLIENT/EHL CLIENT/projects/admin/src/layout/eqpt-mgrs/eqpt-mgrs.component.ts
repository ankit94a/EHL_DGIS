import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ApiService } from 'projects/shared/src/service/api.service';
import { map, Observable } from 'rxjs';
@Component({
    selector: 'app-eqpt-mgrs',
    imports: [PdfViewerModule],
    templateUrl: './eqpt-mgrs.component.html',
    styleUrl: './eqpt-mgrs.component.scss'
})
export class EqptMgrsComponent {
    ipAddress;
    date = new Date().toLocaleDateString();
    constructor(private apiService:ApiService){
      (window as any).pdfWorkerSrc = '/pdfjs/pdf.worker.mjs'
    this.getUserIP()
    }

    getUserIP() {
        this.apiService.getWithHeaders('file/userip').subscribe(res =>{
          if(res){
            degrees
            this.ipAddress = res.userIp;
          }
        })
    }

async downloadPdf() {
    const filePath = '/Eqpt Mgrs.pdf'; 
    const watermarkText = `${this.ipAddress} \n \n \n \n ${this.date}`;;
    const downloadName = 'Eqpt Mgrs Watermarked.pdf';

    await this.downloadWatermarkedPdf(filePath, watermarkText, downloadName);
  }
    async addWatermarkToPdf(blob: Blob, watermarkText: string): Promise<Blob> {
    const pdfBytes = await blob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 4,
        y: height / 2,
        size: 70,
        font,
        color: rgb(1, 0, 0),
        rotate: degrees(45),
        opacity: 0.3,
      });
    }

    const modifiedBytes = await pdfDoc.save();
    return new Blob([modifiedBytes], { type: 'application/pdf' });
  }

  async downloadWatermarkedPdf(pdfPath: string, watermarkText: string, downloadName: string) {
    const response = await fetch(pdfPath);
    const blob = await response.blob();
    const watermarkedBlob = await this.addWatermarkToPdf(blob, watermarkText);

    const url = URL.createObjectURL(watermarkedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
