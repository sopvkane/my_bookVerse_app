// src/app/ai-image-dialog/ai-image-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ai-image-dialog',
  templateUrl: './ai-image-dialog.component.html',
  styleUrls: ['./ai-image-dialog.component.scss']
})
export class AiImageDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AiImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
