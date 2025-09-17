import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { SharedLibraryModule } from '../../shared-library.module';

@Component({
  selector: 'lib-ecr-token',
  imports: [SharedLibraryModule],
  templateUrl: './ecr-token.component.html',
  styleUrls: ['./ecr-token.component.css'],
})
export class EcrTokenComponent {
  form: FormGroup;
  tokenInfo: any;
  subject:any;
  tokenErrorMessage: any = '';
  pinErrorMessage: any;
  validationResult: any = null;
  isOfficerGetToken: boolean = false;
  @Output() isVarified = new EventEmitter();
  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.form = this.fb.group({
      pin: ['', Validators.required],
    });
    this.getEcrTokenDetails();
  }

  getEcrTokenDetails() {
  //  for dummy testing token

  this.tokenInfo= [{ "TokenValid": true, "subject": " NUMBER=IC70737M, NAME = SUJIT BABU" }]

   this.subject = this.tokenInfo[0].subject;

// for real token
    // this.apiService.getWithHeaders('auth/getTokenDetails').subscribe({
    this.apiService.getWithHeadersForToken('FetchUniqueTokenDetails').subscribe({
      next: (res) => {
        // debugger
        // res = [{ "TokenValid": true, "subject": "CN=SUJIT BABU, SERIALNUMBER=IC70737M" }]

        if (res[0].TokenValid) {
          const subject = res[0].subject;
          const serialMatch = subject.match(/SERIALNUMBER=([^,]+)/);
          let serialNumber = null;
          if (serialMatch) {
            serialNumber = serialMatch[1].trim();
          }
          return res;
          // this.apiService.postWithHeaderForToken('validatePersID2FA', { inputPersID: serialNumber }).subscribe({
          //   next: (r) => {
          //     debugger

          //     r.ValidatePersID2FAResult = true;
          //     // this.tokenErrorMessage=true;
          //     if (r.ValidatePersID2FAResult) {
          //       // this.tokenInfo=r.ValidatePersID2FAResult;
          //       this.isOfficerGetToken = true;
          //       this.pinErrorMessage = null;
          //       this.isVarified.emit(true);
          //     } else {
          //       this.tokenErrorMessage = "Invalid Pin"
          //     }

          //   }
          // })
        } else {
          this.tokenErrorMessage = res[0].Remarks
        }
      },
      error: (err) => {
        debugger
        this.tokenErrorMessage = err.error;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    // const pin = this.form.value.pin;

  // const pin = this.form.value.pin;
      // if (pin=="12345678") {
      //     this.isOfficerGetToken = true;
      //     this.pinErrorMessage = null;
      //     this.isVarified.emit(true);
      //   } else {
      //     this.pinErrorMessage = "Invalid PIN.";
      //   }
    // this.apiService.postWithHeaderForToken('validatePersID2FA', { pin }).subscribe({
    //   next: (res) => {
    //     debugger
    //     if (res.isValid) {
    //       this.isOfficerGetToken = true;
    //       this.pinErrorMessage = null;
    //       this.isVarified.emit(true);
    //     } else {
    //       this.pinErrorMessage = "Invalid PIN.";
    //     }
    //   },
    //   error: (err) => {
    //     this.pinErrorMessage = err.error;
    //   },
    // });
  }
}
