import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { Category, Eqpt, SubCategory, Wing } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EqptComponent } from './eqpt/eqpt.component';
import { WingComponent } from './wing/wing.component';
import { DeleteModel } from '../../../../shared/src/models/attribute.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-attribute',
    imports: [SharedLibraryModule, RouterModule],
    templateUrl: './attribute.component.html',
    styleUrl: './attribute.component.scss'
})
export class AttributeComponent implements AfterViewInit {

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('paginator4') paginator4: MatPaginator;

  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('sort2') sort2: MatSort;
  @ViewChild('sort3') sort3: MatSort;
  @ViewChild('sort4') sort4: MatSort;

  categoryList: Category[] = [];
  wing: Wing[] = [];
  subCategoryList: SubCategory[] = [];
  eqptList: Eqpt[] = [];

  activeTab: string = 'wing';
  displayedColumns: string[] = ['name', 'actions'];

  data = new MatTableDataSource<Wing>([]);
  dataSource = new MatTableDataSource<Category>([]);
  dataSource1 = new MatTableDataSource<SubCategory>([]);
  dataSource2 = new MatTableDataSource<Eqpt>([]);

  categoryId: number;
  subCategoryId: number;
  wingId: number;
  paginatorLength: number;

  constructor(
    private dialogService: BISMatDialogService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.getWing();
  }

  ngAfterViewInit(): void {
    this.data.paginator = this.paginator1;
    this.data.sort = this.sort1;

    this.dataSource.paginator = this.paginator2;
    this.dataSource.sort = this.sort2;

    this.dataSource1.paginator = this.paginator3;
    this.dataSource1.sort = this.sort3;

    this.dataSource2.paginator = this.paginator4;
    this.dataSource2.sort = this.sort4;
  }

  public async onTabChange(event) {
    const selectedTab = event.index;
    switch (selectedTab) {
      case 0:
        this.activeTab = 'wing';
        this.getWing();
        break;
      case 1:
        this.activeTab = 'category';
        this.getCategory(this.wingId);
        break;
      case 2:
        this.activeTab = 'subcategory';
        this.getCategory(this.wingId);
        this.getSubCategory(this.categoryId);
        break;
      case 3:
        this.activeTab = 'eqpt';
        this.getCategory(this.wingId);
        this.getSubCategory(this.categoryId);
        this.getEqpt();
        break;
    }
  }

  edit(item) {
    item.isEdit = true;
    const componentMap = {
      wing: WingComponent,
      category: CategoryComponent,
      subcategory: SubCategoryComponent,
      eqpt: EqptComponent
    };

    this.dialogService.open(componentMap[this.activeTab], item, '40vw').then((res) => {
      if (res) this.updateList(this.activeTab);
    });
  }

  updateList(item: string) {
    const map = {
      wing: () => this.getWing(),
      category: () => this.getCategory(this.wingId),
      subcategory: () => this.getSubCategory(this.categoryId),
      eqpt: () => this.getEqpt()
    };
    map[item]?.();
  }

  delete(row) {
    const deleteAttr: DeleteModel = {
      Id: row.id,
      TableName: this.activeTab,
      EmerNumber: ''
    };

    this.dialogService.confirmDialog('Are you sure you want to delete this Attribute?').subscribe((res) => {
      if (res) {
        this.apiService.postWithHeader(`attribute/delete`, deleteAttr).subscribe({
          next: () => {
            this.updateList(this.activeTab);
            this.toastr.success('Deleted Successfully', 'Success');
          },
          error: () => this.toastr.error('Failed to Delete', 'Error')
        });
      }
    });
  }

  getWing() {
    this.apiService.getWithHeaders('attribute/wing').subscribe((res) => {
      if (res) {
        this.wing = res;
        this.data.data = this.wing;
        this.wingId = this.wing[0]?.id;
        this.paginatorLength = this.wing.length;
      }
    });
  }

  getCategory(wingId: number) {
    this.apiService.getWithHeaders('attribute/category' + wingId).subscribe((res) => {
      if (res) {
        this.categoryList = res;
        this.dataSource.data = this.categoryList;
        this.categoryId = this.categoryList[0]?.id;
        this.wingId = this.categoryList[0]?.wingId;
        this.paginatorLength = this.categoryList.length;
      }
    });
  }

getSubCategory(categoryId: number) {
this.apiService.getWithHeaders('attribute/subcategory' + categoryId).subscribe((res) => {
   if (res) {
        this.subCategoryList = res.map(item => ({ ...item, wingId: this.wingId }));
        this.dataSource1.data = this.subCategoryList;
        this.subCategoryId = this.subCategoryList[0]?.id;
      }
    });
  }

  getEqpt() {
    const url = 'attribute/eqpt' + this.categoryId + '/' + this.subCategoryId;
    this.apiService.getWithHeaders(url).subscribe((res) => {
      if (res) {
        this.eqptList = res.map(item => ({ ...item, wingId: this.wingId }));
        this.dataSource2.data = this.eqptList;
        this.paginatorLength = this.eqptList.length;
      }
    });
  }

  addWing() {
    this.dialogService.open(WingComponent, null, '30vw').then((res) => {
      if (res) this.getWing();
    });
  }

  addCategory() {
    this.dialogService.open(CategoryComponent, null, '30vw').then((res) => {
      if (res) this.getCategory(this.wingId);
    });
  }

  addSubCategory() {
    this.dialogService.open(SubCategoryComponent, null, '40vw').then((res) => {
      if (res) this.getSubCategory(this.categoryId);
    });
  }

  addEqpt() {
    this.dialogService.open(EqptComponent, null, '40vw');
  }
}
