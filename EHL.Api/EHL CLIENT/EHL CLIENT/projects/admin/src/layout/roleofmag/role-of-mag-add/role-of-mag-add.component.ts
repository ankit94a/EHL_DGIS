import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { AuthService } from 'projects/shared/src/service/auth.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-role-of-mag-add',
  imports: [SharedLibraryModule],
  templateUrl: './role-of-mag-add.component.html',
  styleUrl: './role-of-mag-add.component.scss'
})
export class RoleOfMagAddComponent {
  roleOfMag: FormGroup;
  wingList: Wing[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) data, private fb: FormBuilder, private dialogRef: MatDialogRef<RoleOfMagAddComponent>, private toastr: ToastrService, private authService: AuthService, private apiService: ApiService) {
    if (data) {
      this.bindDataToForm(data);
    } else {
      this.createForm();
    }
    this.getWing();
  }
  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wingList = res;
      }
    });
  }
  createForm() {
    this.roleOfMag = this.fb.group({
      name: ['', [Validators.required]],
      wingId: ['', [Validators.required]],
      nameOfOfficer: ['', [Validators.required]],
      wing: [''],
      appointment: [''],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      civilNo: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      militaryNo: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      eqptDealing: ['', [Validators.required]],
    });
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
  }

  bindDataToForm(form) {
    this.roleOfMag = this.fb.group({
      name: [form.name, [Validators.required]],
      wingId: [form.wingId, [Validators.required]],
      nameOfOfficer: [form.nameOfOfficer, [Validators.required]],
      wing: [form.wing],
      appointment: [form.appointment],
      militaryNo: [form.militaryNo],
      mobile: [form.mobile, [Validators.required]],
      civilNo: [form.civilNo],
      eqptDealing: [form.eqptDealing],
      id: [form.id],
    });
  }

  save() {
    let wingName = this.wingList.find(item => item.id == this.roleOfMag.get('wingId')?.value).name;
    this.roleOfMag.patchValue({ wing: wingName });
    this.apiService.postWithHeader('roleofmag', this.roleOfMag.value).subscribe({
      next: (res) => {
        this.toastr.success('Form submitted successfully', 'Success');
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
  }

  reset() {
    this.createForm();
  }
  close() {
    this.dialogRef.close(false);
  }
}
