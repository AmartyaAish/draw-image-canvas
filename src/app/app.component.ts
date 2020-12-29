import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
// import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('myCanvas') myCanvas: ElementRef;
  image = new Image();
  url: string;
  isDrawn: boolean = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.myCanvas.nativeElement.addEventListener('mousedown', (e: any) => {
      this.getMousePosition(e);
    });
  }

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
        this.isDrawn = true;
        ctx.drawImage(this.image, 0, 0, 1280, 720);
      };
    }
  }

  getMousePosition(event: any) {
    if (this.isDrawn) {
      let rect = this.myCanvas.nativeElement.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      console.log('Coordinate x: ' + x, 'Coordinate y: ' + y);
    }
  }
}
