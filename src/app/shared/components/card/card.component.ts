import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from '../../../types/product.inteface';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input()
  product: Product | null = null;

  @Input()
  isManageable = false;

  @Output() onDelete = new EventEmitter<Product | null>();

  @Output() onEdit = new EventEmitter<Product | null>();

  onDeleteClick(): void {
    this.onDelete.emit(this.product);
  }

  onEditClick(): void {
    this.onEdit.emit(this.product);
  }
}
