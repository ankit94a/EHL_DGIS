import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'projects/shared/src/service/api.service';

@Component({
  selector: 'app-ripl-add',
  imports: [],
  templateUrl: './ripl-add.component.html',
  styleUrl: './ripl-add.component.scss'
})
export class RiplAddComponent {
drone: FormGroup;
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  apiUrl: string | '';
  filePath: string = '';
  alertMessage: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) data,private dialogRef: MatDialogRef<RiplAddComponent>,private apiService: ApiService,private fb: FormBuilder,private toastr: ToastrService) {
    if (data != null) {
      this.apiUrl = 'LandingPage/drone';
      this.bindDataToForm(data);
    } else {
      this.apiUrl = 'drone/update';
      this.createForm();
    }
  }
   createForm() {
    this.drone = this.fb.group({
      type: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      droneFile: [null, [Validators.required]],
    });
  }
  bindDataToForm(drone) {
    this.drone = this.fb.group({
      id: [drone.id],
      type: [drone.type, [Validators.required]],
      subject: [drone.subject, [Validators.required]],
      reference: [drone.reference, [Validators.required]],
      droneFile: [drone.file, [Validators.required]],
    });
    this.fileName = drone.fileName;
    this.fileSizeFormatted = '';
    this.filePath = drone.filePath;
  }

   save() {
    const formData = new FormData();
    const droneId = this.drone.get('id')?.value;

    if (droneId > 0) {
      const fileInput = this.drone.get('droneFile')?.value;
      if (fileInput) {
        formData.append('droneFile', fileInput, fileInput.name);
      } else {
        if (this.fileName != '' && this.fileName != null) {
          formData.append('fileName', this.fileName);
          formData.append('filePath', this.filePath);
        } else {
          return (this.alertMessage = 'File is required');
        }
      }
      var isValid = this.apiService.checkRequiredFieldsExceptEmerFile(this.drone,'droneFile');
      if (isValid) {
        formData.append('id',droneId);
        formData.append('type', this.drone.get('type')?.value);
        formData.append('subject', this.drone.get('subject')?.value);
        formData.append('reference', this.drone.get('reference')?.value);

        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('drone submitted successfully','Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.toastr.error('Error submitting drone', 'Error');
          },
        });
      } else {
        this.drone.markAllAsTouched();
        return;
      }
    }

    else {
      if (this.drone.valid) {
        formData.append('id', '0' );
        formData.append('type', this.drone.get('type')?.value);
        formData.append('subject', this.drone.get('subject')?.value);
        formData.append('reference', this.drone.get('reference')?.value);
        formData.append('droneFile', this.drone.get('droneFile')?.value);

        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('drone submitted successfully','Success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.toastr.error('Error submitting drone', 'Error');
          },
        });
      } else {
        const fileInput = this.drone.get('droneFile')?.value;
        if (!fileInput) this.alertMessage = 'File is required';
        this.drone.markAllAsTouched();
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
        this.drone.patchValue({
          droneFile: file,
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
    this.drone.patchValue({policyFile: null,});
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
