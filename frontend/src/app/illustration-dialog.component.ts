// // src/app/illustration-dialog/illustration-dialog.component.ts
// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// @Component({
//   selector: 'app-illustration-dialog',
//   template: `
//     <div class="illustration-dialog">
//       <img [src]="data.imageUrl" alt="Illustration" />
//     </div>
//   `,
//   styles: [`
//     .illustration-dialog img {
//       max-width: 100%;
//       height: auto;
//       display: block;
//     }
//   `]
// })
// export class IllustrationDialogComponent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}
// }
