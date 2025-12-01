import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';

import { CreateProductApiService } from './services/create-product-api.service';
import { CreateProductService } from './services/create-product.service';
import { Product } from '../../../types/product.inteface';

const MODULES = [
  CommonModule,
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
];

@Component({
  selector: 'app-create-product',
  imports: [...MODULES],
  providers: [CreateProductService, CreateProductApiService],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  formGroup!: FormGroup;
  categories$: Observable<string[]> =
    this.createProductApiService.getAllCategories();

  private imageSelected!: File;

  constructor(
    private formBuilder: FormBuilder,
    private createProductService: CreateProductService,
    private createProductApiService: CreateProductApiService,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Product
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
    });

    if (this.data) {
      this.formGroup.get('id')?.setValue(this.data.id);
      this.formGroup.get('title')?.setValue(this.data.title);
      this.formGroup.get('description')?.setValue(this.data.description);
      this.formGroup.get('category')?.setValue(this.data.category);
      this.formGroup.get('price')?.setValue(this.data.price);

      this.imageSelected = this.base64StringToFile(
        this.data.image,
        'image.jpeg'
      );

      this.formGroup.get('image')?.removeValidators(Validators.required);
    }
  }

  onSubmitForm(): void {
    const reader = new FileReader();
    reader.readAsDataURL(this.imageSelected);

    reader.onload = () => {
      this.createProductService
        .save({
          ...this.formGroup.value,
          image: reader.result,
        })
        .then(() => this.dialogRef.close());
    };
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onImageSelected(event: any): void {
    this.imageSelected = event.target.files[0];
  }

  private base64StringToFile(base64String: string, filename: string): File {
    const base64Parts = base64String.split(',');
    const base64Content = base64Parts[1];
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const file = new File([blob], filename, { type: 'image/jpeg' });

    return file;
  }
}
