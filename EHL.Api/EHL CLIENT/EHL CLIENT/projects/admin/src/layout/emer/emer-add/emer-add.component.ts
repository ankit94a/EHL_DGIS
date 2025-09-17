import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  Eqpt,
  SubCategory,
  Wing,
} from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';


@Component({
    selector: 'app-emer-add',
    imports: [SharedLibraryModule],
    templateUrl: './emer-add.component.html',
    styleUrl: './emer-add.component.scss'
})
export class EmerAddComponent {
  emerForm: FormGroup;
  categoryList: Category[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  wing: Wing[] = [];
  subNarrowFunctionDropdown = [];
  SubFunctionType = [];
  wingId: number;
  filePath;
  alertMessage: string = '';
  apiUrl: string = 'emer';
  constructor(@Inject(MAT_DIALOG_DATA) data,private authService: AuthService,private apiService: ApiService,private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmerAddComponent>,private toastr: ToastrService) {
    this.wingId = parseInt(this.authService.getWingId());
    if (data) {
      this.bindDataToForm(data);
      this.apiUrl = 'emer/update';
    } else {
      this.createForm();
    }
    this.getWing();
  }

  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
        this.getCategory(this.wingId);
      }
    });
  }

  bindDataToForm(form) {
    if (form.subFunction == 'SCALES')
      this.getSubFunctionField(form.subFunction);
    if (form.subFunctionCategory != null &&form.subFunctionCategory != undefined) {
      this.getSubFunctionType(form.subFunctionCategory);
    }
    this.fileName = form.fileName;
    this.fileSizeFormatted = '';
    this.filePath = form.filePath;
    this.emerForm = this.fb.group({
      emerNumber: [form.emerNumber, [Validators.required]],
      subject: [form.subject, [Validators.required]],
      subFunction: [form.subFunction, [Validators.required]],
      wing: [form.wing],
      category: [form.category],
      subCategory: [form.subCategory],
      wingId: [{ value: form.wingId, disabled: true }, [Validators.required]],
      categoryId: [form.categoryId, [Validators.required]],
      subCategoryId: [form.subCategoryId, [Validators.required]],
      eqpt: [form.eqpt, [Validators.required]],
      emerFile: [form.emerFile, [Validators.required]],
      remarks: [form.remarks],
      subFunctionCategory: [form.subFunctionCategory],
      subFunctionType: [form.subFunctionType],
      id: [form.id],
    });
    this.getCategory(form.wingId);
    this.getSubCategory(form.categoryId, false);
    this.getEqpt(form.subCategoryId);
  }

  createForm() {
    this.emerForm = this.fb.group({
      emerNumber: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      subFunction: ['', [Validators.required]],
      wing: [''],
      category: [''],
      subCategory: [''],
      wingId: [{ value: this.wingId, disabled: true }, [Validators.required]],
      categoryId: ['', [Validators.required]],
      subCategoryId: ['', [Validators.required]],
      eqpt: ['', [Validators.required]],
      emerFile: [null, [Validators.required]],
      subFunctionCategory: [''],
      subFunctionType: [''],
      remarks: [''],
    });
  }

  getCategory(wingId) {
    this.apiService.getWithHeaders('attribute/category' + wingId).subscribe((res) => {
      if (res) {
          this.categoryList = res;
        }
      });
  }

  getSubCategory(categoryId, isUserInput: boolean = true) {
    if (isUserInput) {
      this.emerForm.patchValue({ subCategoryId: null });
      this.emerForm.patchValue({ eqpt: null });
    }
    this.apiService.getWithHeaders('attribute/subcategory' + categoryId).subscribe((res) => {
      if (res) {
          this.subCategoryList = res;
          if (isUserInput) this.eqptList = [];
        }
      });
  }

  getEqpt(subCategoryId) {
    let categoryId = this.emerForm.get('categoryId')?.value;
    this.apiService.getWithHeaders('attribute/eqpt' + categoryId + '/' + subCategoryId).subscribe((res) => {
      if (res) {
          this.eqptList = res;
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
        this.emerForm.patchValue({ emerFile: file });
        this.alertMessage = '';
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        this.alertMessage =
          'Invalid file type! Only PDF and Excel files are allowed.';
      }
    }
  }

  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    this.filePath = null;
    this.emerForm.patchValue({emerFile: null});
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getSubFunctionType(type) {
    if (type == 'INITIAL STOCKING GUIDES') {
      this.SubFunctionType = ['ISG1', 'ISG2'];
    } else if (type == 'MAINTENANCE SCALES') {
      this.SubFunctionType = ['MS1', 'MS2'];
    } else {
      this.SubFunctionType = [];
    }
  }

  getSubFunctionField(subFunction) {
    if (subFunction == 'SCALES') {
      this.subNarrowFunctionDropdown = [
        'INITIAL STOCKING GUIDES AND MAINTENANCE SCALES',
        'INITIAL STOCKING GUIDES',
        'MAINTENANCE SCALES',
        'SPECIAL MAINTENANCE SCALES',
        'WAR MAINTENANCE SCALES',
        'SPECIAL MAINTENANCE TOOLS',
      ];
    } else if (subFunction == 'INSPECTION STD AND CONDEMNATION LIMITS') {
      this.subNarrowFunctionDropdown = ['FIELD INS STDS', 'BASE INSP STDS'];
    } else {
      this.subNarrowFunctionDropdown = [];
      this.SubFunctionType = [];
      this.emerForm.get('subFunctionType')?.setValue('');
      this.emerForm.get('subFunctionCategory')?.setValue('');
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  reset() {
    this.createForm();
    this.fileName = '';
    this.fileSizeFormatted = '';
  }

  save() {
    const emerId = this.emerForm.get('id')?.value;
    const formData = new FormData();
    if (emerId > 0) {
      const fileInput = this.emerForm.get('emerFile')?.value;
      if (fileInput) {
        formData.append('emerFile', fileInput, fileInput.name);
      } else {
        if (this.fileName != '' && this.fileName != null) {
          formData.append('fileName', this.fileName);
          formData.append('filePath', this.filePath);
        } else {
          return (this.alertMessage = 'File is required');
        }
      }
      var isValid = this.apiService.checkRequiredFieldsExceptEmerFile(this.emerForm,'emerFile');
      if (isValid) {
        const category = this.categoryList.find((item) => item.id == this.emerForm.get('categoryId')?.value)?.name || '';
        const subCategory = this.subCategoryList.find((item) => item.id == this.emerForm.get('subCategoryId')?.value)?.name || '';
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('wingId', this.emerForm.get('wingId')?.value);
        formData.append('categoryId', this.emerForm.get('categoryId')?.value);
        formData.append('subCategoryId', this.emerForm.get('subCategoryId')?.value);
        formData.append('emerNumber', this.emerForm.get('emerNumber')?.value);
        formData.append('subject', this.emerForm.get('subject')?.value);
        formData.append('subFunction', this.emerForm.get('subFunction')?.value);
        formData.append('subFunctionCategory', this.emerForm.get('subFunctionCategory')?.value);
        formData.append('subFunctionType', this.emerForm.get('subFunctionType')?.value);
        formData.append('eqpt', this.emerForm.get('eqpt')?.value);
        formData.append('remarks', this.emerForm.get('remarks')?.value);
        formData.append('id', this.emerForm.get('id')?.value);
        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('Emer updated successfully', 'Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
              if(err.status == 400){
              this.toastr.error(err.error.Name,'Error');
              return;
            }
            this.toastr.error('Error while updating emer', 'Error');
          },
        });
      } else {
        this.emerForm.markAllAsTouched();
        return;
      }
    }

    else {
      if (this.emerForm.valid) {
        const wing = this.wing.find((item) => item.id == this.emerForm.get('wingId')?.value)?.name || '';
        const category = this.categoryList.find((item) => item.id == this.emerForm.get('categoryId')?.value)?.name || '';
        const subCategory = this.subCategoryList.find((item) => item.id == this.emerForm.get('subCategoryId')?.value)?.name || '';

        formData.append('wing', wing);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('wingId', this.emerForm.get('wingId')?.value);
        formData.append('categoryId', this.emerForm.get('categoryId')?.value);
        formData.append('subCategoryId', this.emerForm.get('subCategoryId')?.value);
        formData.append('emerNumber', this.emerForm.get('emerNumber')?.value);
        formData.append('subject', this.emerForm.get('subject')?.value);
        formData.append('subFunction', this.emerForm.get('subFunction')?.value);
        formData.append('subFunctionCategory', this.emerForm.get('subFunctionCategory')?.value);
        formData.append('subFunctionType', this.emerForm.get('subFunctionType')?.value);
        formData.append('eqpt', this.emerForm.get('eqpt')?.value);
        formData.append('remarks', this.emerForm.get('remarks')?.value);
        formData.append('emerFile', this.emerForm.get('emerFile')?.value);
        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('Emer added successfully', 'Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
              if(err.status == 400){
              this.toastr.error(err.error.Name,'Error');
              return;
            }
            this.toastr.error(err.message, 'Error');
          },
        });
      } else {
        const fileInput = this.emerForm.get('emerFile')?.value;
        if (!fileInput) this.alertMessage = 'File is required';
        this.emerForm.markAllAsTouched();
        return;
      }
    }
  }
}
