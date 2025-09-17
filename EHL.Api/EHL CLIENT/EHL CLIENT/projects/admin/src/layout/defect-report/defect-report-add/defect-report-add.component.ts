
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/shared/src/service/api.service';
import {
  Category,
  Eqpt,
  SubCategory,
  Wing,
} from 'projects/shared/src/models/attribute.model';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/shared/src/service/auth.service';
@Component({
    imports: [SharedLibraryModule],
    selector: 'app-defect-report-add',
    templateUrl: './defect-report-add.component.html',
    styleUrl: './defect-report-add.component.scss'
})
export class DefectReportAddComponent {
  policy: FormGroup;
  categoryList: Category[] = [];
  wingList: Wing[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];
  fileName: string | null = null;
  filePath: string = '';
  fileSizeFormatted: string | null = null;
  wingId: number;
  categoryId: number;
  apiUrl: string = '';
  alertMessage: string = '';
  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<DefectReportAddComponent>,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,

  ) {
    this.wingId = parseInt(this.authService.getWingId());
    this.getWings();
    if (data != null) {
      this.apiUrl = 'policy/update';
      this.bindDataToForm(data);
    } else {
      this.apiUrl = 'policy';
      this.createForm();
    }
  }

  bindDataToForm(policyData) {
    this.categoryId = policyData.categoryId;
    this.getSubCategory(policyData.categoryId,false);
    this.getEqpt(policyData.subCategoryId);
    this.policy = this.fb.group({
      categoryId: [policyData.categoryId, [Validators.required]],
      id: [policyData.id],
      type: [{ value: policyData.type, disabled: true }, [Validators.required]],
      wingId: [{ value: policyData.wingId, disabled: true },[Validators.required],],
      category: [policyData.category,[Validators.required]],
      subCategory: [policyData.subCategory,[Validators.required]],
      subCategoryId: [policyData.subCategoryId,[Validators.required]],
      eqpt: [policyData.eqpt,[Validators.required]],
      policyFile: [null, [Validators.required]],
      remarks: [policyData.remarks],
    });

    this.fileName = policyData.fileName;
    this.fileSizeFormatted = '';
    this.filePath = policyData.filePath;

  }
  createForm() {
    this.policy = this.fb.group({
      type: [{ value: 'Defect Report', disabled: true }, [Validators.required]],
      wingId: [{ value: this.wingId, disabled: true }, [Validators.required]],
      categoryId: ['', [Validators.required]],
      categogry: [''],
      subCategory: [''],
      subCategoryId: ['', [Validators.required]],
      eqpt: ['', [Validators.required]],
      policyFile: [null, [Validators.required]],
      remarks: [''],
    });
  }
  getSubCategory(categoryId,isUserInput:boolean=true) {
    if (isUserInput) {
      this.policy.patchValue({ subCategoryId: null, });
      this.policy.patchValue({ eqpt: null, });
    }
    this.apiService
      .getWithHeaders('attribute/subcategory' + categoryId)
      .subscribe((res) => {
        if (res) {
          this.subCategoryList = res;
          if(isUserInput)
            this.eqptList = [];
        }
      });
  }

  getEqpt(subCategoryId) {
    this.apiService.getWithHeaders('attribute/eqpt' + this.categoryId + '/' + subCategoryId).subscribe((res) => {
        if (res) {
          this.eqptList = res;
        }
      });
  }
   async save() {
    const formData = new FormData();
    var wing = this.wingList.find(
      (item) => item.id == this.policy.get('wingId')?.value
    ).name;
    formData.append('wing', wing);
    const policyId = this.policy.get('id')?.value
      ? this.policy.get('id')?.value
      : 0;

    if (policyId > 0) {
      const fileInput = this.policy.get('policyFile')?.value;
      if (fileInput) {
        formData.append('policyFile', fileInput, fileInput.name);
      } else {
        if (this.fileName != '' && this.fileName != null) {
          formData.append('fileName', this.fileName);
          formData.append('filePath', this.filePath);
        } else {
          return (this.alertMessage = 'File is required');
        }
      }
      var isValid = this.apiService.checkRequiredFieldsExceptEmerFile(
        this.policy,
        'policyFile'
      );

      if (isValid) {
        formData.append('id', policyId);

        formData.append(
          'subCategoryId',
          this.policy.get('subCategoryId')?.value
        );
        formData.append('type', 'Defect Report');
        formData.append('wingId', this.policy.get('wingId')?.value);
        formData.append('categoryId', this.policy.get('categoryId')?.value);
        formData.append('policyFile', this.policy.get('policyFile')?.value);

       const rawObject = {
          eqpt: this.policy.get('eqpt')?.value,
          category: this.categoryList.find(
            (x) => x.id == this.policy.get('categoryId')?.value
          )?.name,
          subCategory: this.subCategoryList.find(
            (x) => x.id == this.policy.get('subCategoryId')?.value
          )?.name,
          remarks: this.policy.get('remarks')?.value,
          wing: this.wingList.find(
            (w) => w.id == this.policy.get('wingId')?.value
          )?.name,
        };
            Object.entries(rawObject).forEach(([key, value]) =>
          formData.append(key, String(value))
        );

        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('Defect Report submitted successfully', 'Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.toastr.error('Error submitting Defect Report', 'Error');
          },
        });
      } else {
        this.policy.markAllAsTouched();
        return;
      }
    }

    else {
      formData.append('type', 'Defect Report');
      formData.append('wingId', this.policy.get('wingId')?.value);
      formData.append(
        'id',
        this.policy.get('id')?.value ? this.policy.get('id')?.value : '0'
      );

      if (this.policy.valid) {

        formData.append('categoryId', this.policy.get('categoryId')?.value);
        formData.append(
          'subCategoryId',
          this.policy.get('subCategoryId')?.value
        );
        formData.append('policyFile', this.policy.get('policyFile')?.value);

        const rawObject = {
          eqpt: this.policy.get('eqpt')?.value,
          category: this.categoryList.find(
            (x) => x.id == this.policy.get('categoryId')?.value
          )?.name,
          subCategory: this.subCategoryList.find(
            (x) => x.id == this.policy.get('subCategoryId')?.value
          )?.name,
          remarks: this.policy.get('remarks')?.value,
          wing: this.wingList.find(
            (w) => w.id == this.policy.get('wingId')?.value
          )?.name,
        };
       Object.entries(rawObject).forEach(([key, value]) =>
          formData.append(key, String(value))
        );

        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('Defect Report submitted successfully', 'Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.toastr.error('Error submitting Defect Report', 'Error');
          },
        });
      } else {
        const fileInput = this.policy.get('policyFile')?.value;
        if (!fileInput) this.alertMessage = 'File is required';
        this.policy.markAllAsTouched();
        return;
      }
    }
  }

  getWings() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wingList = res;
        this.getCategory(this.wingId);
      }
    });
  }
  getCategory(wingId) {
    this.apiService
      .getWithHeaders('attribute/category' + wingId)
      .subscribe((res) => {
        if (res) {
          this.categoryList = res;
        }
      });
  }
  getReadableFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (allowedTypes.includes(file.type)) {
        this.fileName = file.name;
        this.fileSizeFormatted = this.getReadableFileSize(file.size);
        this.policy.patchValue({
          policyFile: file,
        });
        this.alertMessage = '';
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        this.alertMessage =
          'Invalid file type! Only PDF and Excel files are allowed.';
      }
    }
  }

  close() {
    this.dialogRef.close(true);
  }
  reset() {
    this.createForm();
    this.fileName = '';
    this.fileSizeFormatted = '';
  }
  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    this.policy.patchValue({
      policyFile: null,
    });

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
