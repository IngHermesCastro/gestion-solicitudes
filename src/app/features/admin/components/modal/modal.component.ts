import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {

  @Input() descripcion: string = '';
  @Input() respuestaIA: string = '';
  @Input() visible: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  onSave() {
    this.save.emit(this.respuestaIA);
  }

  onClose() {
    this.close.emit();
  }
}
