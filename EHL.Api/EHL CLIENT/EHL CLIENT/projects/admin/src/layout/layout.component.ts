
import { Component } from '@angular/core';
import { SharedLibraryModule } from '../../../shared/src/shared-library.module';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/src/component/header/header.component';
import { SidebarComponent } from '../../../shared/src/component/sidebar/sidebar.component';
import { ChatBotComponent } from 'projects/shared/src/component/chat-bot/chat-bot.component';
import { BISMatDialogService } from 'projects/shared/src/service/insync-mat-dialog.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SuggestionComponent } from 'projects/shared/src/component/suggestion/suggestion.component';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-layout',
  imports: [SharedLibraryModule, RouterModule, HeaderComponent, SidebarComponent, NgxSpinnerModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  sideBarOpen = true;
  isSideBarLoaded: boolean = false;
  isMinimized: boolean = false;
  showRightAvatar = true;
  showLeftAvatar = true;
  isDragging = false;
  dragTarget: 'left' | 'right' | null = null;

  rightPosition = { x: 1500, y: 650 };
  leftPosition = { x: 20, y: window.innerHeight - 170 };

  offset = { x: 0, y: 0 };
  rightDialogRef?: MatDialogRef<ChatBotComponent>;
  leftDialogRef?: MatDialogRef<SuggestionComponent>;

  constructor(private router: Router, private dialogService: BISMatDialogService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sideBarOpen = !(event.url === '/wing' || event.url === '/master-sheet' || event.url === '/policy' || event.url === '/role-of-mag');
      }
    });
  }
  ngOnInit() {
    const savedRight = localStorage.getItem('rightAvatarPosition');
    if (savedRight) this.rightPosition = JSON.parse(savedRight);

    const savedLeft = localStorage.getItem('leftAvatarPosition');
    if (savedLeft) this.leftPosition = JSON.parse(savedLeft);
  }
  changeClass() {
    this.isMinimized = !this.isMinimized;
  }

  isLoaded($event: any) {
    this.isSideBarLoaded = $event
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  chatbox(side: 'left' | 'right') {
    if (side === 'right') {
      this.showRightAvatar = false;
      this.dialogService.openDialogForChatBox(ChatBotComponent, {}).then(res => {
        if (res) {
          this.showRightAvatar = true;
        }
      });
    } else {
      this.showLeftAvatar = false;
      this.dialogService.openDialogForChatBox(SuggestionComponent, { data: { side: 'left' } }, false).then(res => {
        if (res) {
          this.showLeftAvatar = true;
        }
      });
    }
  }


  startDrag(event: MouseEvent, side: 'left' | 'right'): void {
    this.isDragging = true;
    this.dragTarget = side;
    const pos = side === 'right' ? this.rightPosition : this.leftPosition;
    this.offset.x = event.clientX - pos.x;
    this.offset.y = event.clientY - pos.y;
    document.addEventListener('mousemove', this.onDragBound);
    document.addEventListener('mouseup', this.stopDragBound);
    event.preventDefault();
  }

  onDrag = (event: MouseEvent): void => {
    if (this.isDragging && this.dragTarget) {
      let pos = this.dragTarget === 'right' ? this.rightPosition : this.leftPosition;
      const newX = event.clientX - this.offset.x;
      const newY = event.clientY - this.offset.y;
      pos.x = Math.max(0, Math.min(newX, window.innerWidth - 60));
      pos.y = Math.max(0, Math.min(newY, window.innerHeight - 60));
    }
  };

  stopDrag = (): void => {
    if (this.dragTarget === 'right') {
      localStorage.setItem('rightAvatarPosition', JSON.stringify(this.rightPosition));
    } else if (this.dragTarget === 'left') {
      localStorage.setItem('leftAvatarPosition', JSON.stringify(this.leftPosition));
    }

    this.isDragging = false;
    this.dragTarget = null;

    document.removeEventListener('mousemove', this.onDragBound);
    document.removeEventListener('mouseup', this.stopDragBound);
  };

  onDragBound = this.onDrag.bind(this);
  stopDragBound = this.stopDrag.bind(this);
}
