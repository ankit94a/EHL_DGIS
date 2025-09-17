import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../component/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class BISMatDialogService {

  confirmContent;
  constructor(private dialog: MatDialog) {

  }

  open(compononetName, dataObject,width = '80vw',height='auto'): Promise<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = dataObject;
    dialogConfig.width= width;
    dialogConfig. maxWidth='80vw';
    dialogConfig.height = height;
    dialogConfig.backdropClass = 'blur-background';
    const dialogRef = this.dialog.open(compononetName, dialogConfig);
    return dialogRef.afterClosed().toPromise();
  }

  confirmDialog(row): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: row
    });
    return dialogRef.afterClosed();
  }

  openDialogForChatBox(compononetName,dataObject,isChatBot=true): Promise<any> {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = dataObject;
  dialogConfig.width= '25vw';
  dialogConfig. maxWidth='65vw';
  dialogConfig.height = '30vw';
  dialogConfig.backdropClass = 'blur-background';
  if(isChatBot){
    dialogConfig.position = { bottom: '10px', right: '20px' };
  }else{
    dialogConfig.position = { bottom: '10px', left: '20px' };
  }

  dialogConfig.panelClass = 'custom-dialog-container';
  const dialogRef = this.dialog.open(compononetName, dialogConfig);
    return dialogRef.afterClosed().toPromise();
}
}
