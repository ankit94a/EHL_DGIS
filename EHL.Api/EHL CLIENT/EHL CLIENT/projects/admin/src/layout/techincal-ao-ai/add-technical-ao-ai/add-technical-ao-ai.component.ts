import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-add-technical-ao-ai',
    imports: [SharedLibraryModule],
    templateUrl: './add-technical-ao-ai.component.html',
    styleUrl: './add-technical-ao-ai.component.scss'
})
export class AddTechnicalAoAiComponent {
  TechnicalAoAi: FormGroup;
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  apiUrl: string | '';
  filePath: string = '';
  alertMessage: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) data,private dialogRef: MatDialogRef<AddTechnicalAoAiComponent>,private apiService: ApiService,private fb: FormBuilder,private toastr: ToastrService) {
    if (data != null) {
      this.apiUrl = 'TechnicalAoAi/update';
      this.bindDataToForm(data);
    } else {
      this.apiUrl = 'TechnicalAoAi';
      this.createForm();
    }
  }

  bindDataToForm(TechnicalAoAiData) {
    this.TechnicalAoAi = this.fb.group({
      id: [TechnicalAoAiData.id],
      type: [TechnicalAoAiData.type, [Validators.required]],
      subject: [TechnicalAoAiData.subject, [Validators.required]],
      reference: [TechnicalAoAiData.reference, [Validators.required]],
      TechnicalAoAiFile: [TechnicalAoAiData.file, [Validators.required]],
    });
    this.fileName = TechnicalAoAiData.fileName;
    this.fileSizeFormatted = '';
    this.filePath = TechnicalAoAiData.filePath;
  }

  createForm() {
    this.TechnicalAoAi = this.fb.group({
      type: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      TechnicalAoAiFile: [null, [Validators.required]],
    });
  }

  save() {
    const formData = new FormData();
    const TechnicalAoAiId = this.TechnicalAoAi.get('id')?.value;

    if (TechnicalAoAiId > 0) {
      const fileInput = this.TechnicalAoAi.get('TechnicalAoAiFile')?.value;
      if (fileInput) {
        formData.append('TechnicalAoAiFile', fileInput, fileInput.name);
      } else {
        if (this.fileName != '' && this.fileName != null) {
          formData.append('fileName', this.fileName);
          formData.append('filePath', this.filePath);
        } else {
          return (this.alertMessage = 'File is required');
        }
      }
      var isValid = this.apiService.checkRequiredFieldsExceptEmerFile(this.TechnicalAoAi,'TechnicalAoAiFile');
      if (isValid) {
        formData.append('id',TechnicalAoAiId);
        formData.append('type', this.TechnicalAoAi.get('type')?.value);
        formData.append('subject', this.TechnicalAoAi.get('subject')?.value);
        formData.append('reference', this.TechnicalAoAi.get('reference')?.value);

        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('TechnicalAoAi submitted successfully','Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            if (err.status == 400) {
              let messages: string[] = [];
              let count = 1;
              for (const key in err.error) {
                if (err.error.hasOwnProperty(key)) {
                  err.error[key].forEach((msg: string) => {
                    messages.push(`${count}. ${msg}`);
                    count++;
                  });
                }
              }
              this.toastr.error(messages.join('<br/>'), 'Validation Error', { enableHtml: true });
              return;
            }
            this.toastr.error('Error submitting TechnicalAoAi', 'Error');
          },
        });
      } else {
        this.TechnicalAoAi.markAllAsTouched();
        return;
      }
    }

    else {
      if (this.TechnicalAoAi.valid) {
        formData.append('id', '0' );
        formData.append('type', this.TechnicalAoAi.get('type')?.value);
        formData.append('subject', this.TechnicalAoAi.get('subject')?.value);
        formData.append('reference', this.TechnicalAoAi.get('reference')?.value);
        formData.append('TechnicalAoAiFile', this.TechnicalAoAi.get('TechnicalAoAiFile')?.value);

        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('TechnicalAoAi submitted successfully','Success');
            this.dialogRef.close(true);
          },
           error: (err) => {
        if (err.status == 400) {
          let messages: string[] = [];
          let count = 1;
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              err.error[key].forEach((msg: string) => {
                messages.push(`${count}. ${msg}`);
                count++;
              });
            }
          }
          this.toastr.error(messages.join('<br/>'), 'Validation Error', { enableHtml: true });
          return;
        }
        this.toastr.error('Error submitting form', 'Error');
      },
        });
      } else {
        const fileInput = this.TechnicalAoAi.get('TechnicalAoAiFile')?.value;
        if (!fileInput) this.alertMessage = 'File is required';
        this.TechnicalAoAi.markAllAsTouched();
        return;
      }
    }
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
        this.TechnicalAoAi.patchValue({
          TechnicalAoAiFile: file,
        });
      } else {
        this.fileName = null;
        this.fileSizeFormatted = null;
        alert(
          'Invalid file type! Only PDF and Excel files are allowed.'
        );
      }
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

  removeFile(): void {
    this.fileName = null;
    this.fileSizeFormatted = null;
    this.TechnicalAoAi.patchValue({policyFile: null,});
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
