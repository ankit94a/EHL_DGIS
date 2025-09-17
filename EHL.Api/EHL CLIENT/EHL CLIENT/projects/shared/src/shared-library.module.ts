import { NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './helpers/material';
import { AlphanumericOnlyDirective } from './directive/alphanumeric-only.directive';

@NgModule({
  declarations: [],
  imports: [AlphanumericOnlyDirective],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AlphanumericOnlyDirective
  ],
  providers: [ToastrService],
})
export class SharedLibraryModule { }
