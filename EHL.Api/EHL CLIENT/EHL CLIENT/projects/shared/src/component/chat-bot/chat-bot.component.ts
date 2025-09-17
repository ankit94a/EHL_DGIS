import { Component, Inject } from '@angular/core';
import { SharedLibraryModule } from '../../shared-library.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'lib-chat-bot',
    imports: [SharedLibraryModule],
    templateUrl: './chat-bot.component.html',
    styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
isExpanded: boolean = false;
  message: any;
  constructor(@Inject(MAT_DIALOG_DATA) Data , private dialogRef: MatDialogRef<ChatBotComponent>){}

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  sendMessage(){
    // if (this.message.trim()) {
    //   // Your message sending logic here
    //   console.log("Message sent: ", this.message);
    //   this.message = '';  // Clear the input after sending the message
    // }
  }
   close() {
    this.dialogRef.close(true);
  }

}
