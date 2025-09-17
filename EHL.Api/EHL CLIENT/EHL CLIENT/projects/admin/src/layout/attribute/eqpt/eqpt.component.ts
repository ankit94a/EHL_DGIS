import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Category,Eqpt,SubCategory, Wing} from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-eqpt',
    imports: [SharedLibraryModule],
    templateUrl: './eqpt.component.html',
    styleUrl: './eqpt.component.scss'
})
export class EqptComponent {
  categoryList: Category[] = [];
  subCategoryList: SubCategory[] = [];
  eqpt: Eqpt = new Eqpt();
  wing: Wing[] = [];
  wingId: number = 0;
  categoryId: number;
  subCategoryId: number;
  apiUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private apiService: ApiService,
    private toastr: ToastrService,
    private dailogRef: MatDialogRef<EqptComponent>
  ) {
    this.getWing();
    if (data != null) {
      this.getCategory(data.wingId);
      this.categoryId = data.categoryId;
      this.getSubCategory(data.categoryId);
      this.subCategoryId = data.subCategoryId;
      this.bindDataToForm(data), (this.apiUrl = 'attribute/eqpt/update');
    } else {
      this.createForm();
      this.apiUrl = 'attribute/eqpt';
    }
  }
  bindDataToForm(attrData) {
    (this.eqpt.id = attrData.id),
      (this.eqpt.categoryId = attrData.categoryId),
      (this.eqpt.wingId = attrData.wingId),
      (this.eqpt.categoryId = attrData.categoryId),
      (this.eqpt.subCategoryId = attrData.subCategoryId),
      (this.eqpt.name = attrData.name);
  }
  createForm() {
    (this.eqpt.id = 0),
      (this.eqpt.categoryId = 0),
      (this.eqpt.name = ''),
      (this.eqpt.wingId = 0),
      (this.eqpt.subCategoryId = 0);
  }
  getCategory(categoryId) {
    this.apiService
      .getWithHeaders('attribute/category' + categoryId)
      .subscribe((res) => {
        if (res) {
          this.categoryList = res;
        }
      });
  }
  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
      }
    });
  }
  getSubCategory(categoryId) {
    this.apiService
      .getWithHeaders('attribute/subcategory' + categoryId)
      .subscribe((res) => {
        if (res) {
          this.subCategoryList = res;
        }
      });
  }
  close() {
    this.dailogRef.close(true);
  }
  reset() {
    this.createForm();
  }
  save() {
    this.apiService.postWithHeader(this.apiUrl, this.eqpt).subscribe((res) => {
      if (res) {
        this.toastr.success('Eqpt added successfully', 'success');
        this.dailogRef.close(true);
      }
    });
  }
}
