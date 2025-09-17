import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TablePaginationSettingsConfig } from 'projects/shared/src/component/zipper-table/table-settings.model';
import { ZipperTableComponent } from 'projects/shared/src/component/zipper-table/zipper-table.component';
import { Feedback } from 'projects/shared/src/models/attribute.model';
import { ApiService } from 'projects/shared/src/service/api.service';
import { SharedLibraryModule } from 'projects/shared/src/shared-library.module';

@Component({
  selector: 'app-feedback',
  imports: [SharedLibraryModule,ZipperTableComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent extends TablePaginationSettingsConfig{
  feedbackList: Feedback[] = [];
  isRefresh: boolean = false;
  constructor(private spinner: NgxSpinnerService,private apiService: ApiService) {
    super();
    
  }
  async ngOnInit(){

    this.tablePaginationSettings.enableColumn = true;
    this.tablePaginationSettings.pageSizeOptions = [50, 100];
    this.tablePaginationSettings.showFirstLastButtons = false;
    this.getList();
  }
  getList() {
    this.spinner.show();
    this.apiService.getWithHeaders('landingpage/feedback').subscribe(res => {
        if (res) {
          this.feedbackList = res;
          this.spinner.hide();
        }
    });
  }


  columns = [
    {
      name: 'name',
      displayName: 'Name',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'rank',
      displayName: 'Rank',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'unit',
      displayName: 'unit',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'number',
      displayName: 'Army Number',
      isSearchable: true,
      hide: false,
      type: 'text',
    },
    {
      name: 'message',
      displayName: 'Message',
      isSearchable: true,
      hide: false,
      type: 'text',
    }
  ];
}
