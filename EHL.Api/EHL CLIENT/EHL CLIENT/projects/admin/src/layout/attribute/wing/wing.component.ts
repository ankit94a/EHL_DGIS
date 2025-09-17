import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-wing',
    imports: [SharedLibraryModule],
    templateUrl: './wing.component.html',
    styleUrl: './wing.component.scss'
})
export class WingComponent {
  attributeData: FormGroup;
  wing: Wing = new Wing();
  apiUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private apiSerive: ApiService,
    private dialogRef: MatDialogRef<WingComponent>,
    private toastr: ToastrService,
    private dailogRef: MatDialogRef<WingComponent>,
    private fb: FormBuilder
  ) {
    if (data != null) {
      this.bindDataToForm(data);
    } else {

      this.createForm();
    }
    this.apiUrl = this.wing.id > 0 ? 'attribute/wing/update' : 'attribute/wing';
  }
  bindDataToForm(attrData) {

    this.wing.name = attrData.name;
    this.wing.id = attrData.id;
  }
  createForm() {
    this.wing.name = '';
    this.wing.id = 0;
  }

  close() {
    this.dialogRef.close(true);
  }
  reset() {
    this.createForm();
  }

  async save() {
    this.apiSerive.postWithHeader(this.apiUrl, this.wing).subscribe((res) => {
      if (res) {
        this.toastr.success('Wing added successfully', 'success');
        this.dailogRef.close(true);
      }
    });
  }
}
