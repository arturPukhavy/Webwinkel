import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Output() close = new EventEmitter<void>();
  @Input() message: string;

  onClose() {
    this.close.emit();
  }
}