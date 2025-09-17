import { Component, Inject } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Feedback } from '../../models/attribute.model';
import { ApiService } from '../../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'lib-suggestion',
  imports: [SharedLibraryModule],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css'
})
export class SuggestionComponent {
  step = 1;
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) Data,private toastr:ToastrService ,private fb: FormBuilder, private dialogRef: MatDialogRef<SuggestionComponent>, private apiService: ApiService) {
    this.form = this.fb.group({
    name: ['', Validators.required],
    rank: ['', [Validators.required]],
    unit: ['', Validators.required],
    number: ['', [Validators.required]],
    message: ['', Validators.required]
    });
  }

  nextStep() {
    debugger
    if (this.isStepValid(this.step)) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

 isStepValid(step: number): boolean {
  let controlName = '';
  switch (step) {
    case 1: controlName = 'name'; break;
    case 2: controlName = 'rank'; break;
    case 3: controlName = 'unit'; break;
    case 4: controlName = 'number'; break;
    case 5: controlName = 'message'; break;
  }

  const control = this.form.get(controlName);
  if (control) {
    control.markAsTouched();
    control.updateValueAndValidity(); 
    return control.valid;
  }
  return false;
}

  sendMessage() {
    if (this.form.valid) {
      this.apiService.postWithHeader('landingpage/feedback', this.form.value).subscribe(res => {
        if (res) {
          this.toastr.success("Feedback submitted successfully",'success')
          this.close();
        }
      })
    }
  }

  close() {
    this.form.reset();
    this.dialogRef.close(true);
    this.step = 1;
  }
}
