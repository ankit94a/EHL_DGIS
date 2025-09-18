import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category, Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-category',
    imports: [SharedLibraryModule],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss'
})
export class CategoryComponent {
  category:Category=new Category();
  wing:Wing[]=[];
  apiUrl: string = 'attribute/category';

  constructor(@Inject(MAT_DIALOG_DATA) data: any,private apiSerive:ApiService,private toastr:ToastrService,private dailogRef:MatDialogRef<CategoryComponent>){
    this.getWing();
    if (data != null) {
      this.getWingById(data.wingId);
      this.bindDataToForm(data);
      this.apiUrl = 'attribute/category/update'
    } else {
      this.createForm();
    }


  }

  bindDataToForm(attrData) {
    (this.category.id = attrData.id),
    (this.category.wingId=attrData.wingId),
    (this.category.name = attrData.name);
  }
  createForm() {
    (this.category.name = ''),
    (this.category.wingId = 0),
    (this.category.id = 0)
  }
  getWingById(id){
    this.apiSerive.getWithHeaders('attribute/wing').subscribe(res =>{
      if(res){
        const filteredWing = res.filter(wing => wing.id === id);
      this.wing=filteredWing;
      }
    })
  }
  getWing(){
    this.apiSerive.getWithHeaders('attribute/wing').subscribe(res =>{
      if(res){
      this.wing=res;
      }
    })
  }

  close() {
    this.dailogRef.close(true);
  }
  reset() {
    this.createForm();
  }
  save(){
     this.apiSerive.postWithHeader(this.apiUrl, this.category).subscribe({
          next: (res) => {
            this.dailogRef.close(true);
            this.toastr.success("Category Action successfully",'success');
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
            this.toastr.error(err.message, 'Error');
          },
        });
  }
}
