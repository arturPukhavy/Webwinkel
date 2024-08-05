import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}