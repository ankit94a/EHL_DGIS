import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphanumericOnly]',
  standalone:true
})
export class AlphanumericOnlyDirective {

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^a-zA-Z0-9\s]/g, '');

    if (this.control?.control) {
      this.control.control.setValue(cleaned, { emitEvent: false });
    } else {
      input.value = cleaned;
    }
  }
}
