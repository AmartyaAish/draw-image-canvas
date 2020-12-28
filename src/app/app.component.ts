import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('myCanvas') myCanvas: ElementRef;
  image = new Image();
  constructor() {}

  url: string;

  selectFile(event: any): void {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.image.src = this.url;
      };

      let ctx: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext(
        '2d'
      );

      this.image.onload = () => {
        ctx.clearRect(
          0,
          0,
          this.myCanvas.nativeElement.width,
          this.myCanvas.nativeElement.height
        );
        // ctx.canvas.height =
        // this.myCanvas.nativeElement.width = this.image.width;
        // this.myCanvas.nativeElement.height = this.image.height;
        ctx.drawImage(this.image, 0, 0, 1280, 720);
      };
    }
  }

  ngOnInit() {}
}
