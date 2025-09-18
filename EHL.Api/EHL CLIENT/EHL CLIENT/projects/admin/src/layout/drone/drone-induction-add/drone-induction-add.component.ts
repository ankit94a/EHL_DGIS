import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-drone-induction-add',
  imports: [SharedLibraryModule],
  templateUrl: './drone-induction-add.component.html',
  styleUrl: './drone-induction-add.component.scss'
})
export class DroneInductionAddComponent {
  drone: FormGroup;
  fileName: string | null = null;
  fileSizeFormatted: string | null = null;
  apiUrl: string | '';
  filePath: string = '';
  alertMessage: string = '';
  wingId: number;
   wing: Wing[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) data,private dialogRef: MatDialogRef<DroneInductionAddComponent>,private authService: AuthService, private apiService: ApiService,private fb: FormBuilder,private toastr: ToastrService) {
    this.getWing()
    this.wingId = parseInt(this.authService.getWingId());
    if (data != null) {
      this.apiUrl ='LandingPage/drone/update';
      this.bindDataToForm(data);
    } else {
      this.apiUrl = 'LandingPage/drone';
      this.createForm();
    }
  }
  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
      }
    });
  }
   createForm() {
    this.drone = this.fb.group({
      type: ['', [Validators.required]],
      nomenClature: ['', [Validators.required]],
      wingId: [this.wingId, [Validators.required]],
      remarks: ['', [Validators.required]],
      droneIcscFile: [null, [Validators.required]],
    });
  }
  bindDataToForm(drone) {
    this.drone = this.fb.group({
      id: [drone.id],
      type: [drone.type, [Validators.required]],
      nomenClature: [drone.nomenClature, [Validators.required]],
      remarks: [drone.remarks, [Validators.required]],
      droneIcscFile: [drone.droneIcscFile, [Validators.required]],
    });
    this.fileName = drone.fileName;
    this.fileSizeFormatted = '';
    this.filePath = drone.filePath;
  }

   save() {
    const formData = new FormData();
    const droneId = this.drone.get('id')?.value;

    if (droneId > 0) {
      const fileInput = this.drone.get('droneIcscFile')?.value;
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
      var isValid = this.apiService.checkRequiredFieldsExceptEmerFile(this.drone,'droneIcscFile');
      if (isValid) {
        formData.append('id',droneId);
        formData.append('type', this.drone.get('type')?.value);
        formData.append('nomenClature', this.drone.get('nomenClature')?.value);
        formData.append('remarks', this.drone.get('remarks')?.value);
        formData.append('droneIcscFile', this.drone.get('droneIcscFile')?.value);
        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('drone submitted successfully','Success');
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
         const wing = this.wing.find((item) => item.id == this.drone.get('wingId')?.value)?.name || '';
        formData.append('id', '0' );
        formData.append('type', this.drone.get('type')?.value);
        formData.append('nomenClature', this.drone.get('nomenClature')?.value);
        formData.append('remarks', this.drone.get('remarks')?.value);
        formData.append('droneIcscFile', this.drone.get('droneIcscFile')?.value);
        formData.append('wing', wing);
        formData.append('wingId', this.drone.get('wingId')?.value);
        this.apiService.postWithHeader(this.apiUrl, formData).subscribe({
          next: (res) => {
            this.toastr.success('drone submitted successfully','Success');
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
          droneIcscFile: file,
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
