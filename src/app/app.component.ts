// import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
// import 'fabric';
// declare const fabric: any;

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   @ViewChild('myCanvas') myCanvas: ElementRef;
//   image = new Image();
//   url: string;
//   isDrawn: boolean = false;

//   constructor() {}

//   ngOnInit() {}

//   ngAfterViewInit() {
//     this.myCanvas.nativeElement.addEventListener('mousedown', (e: any) => {
//       this.getMousePosition(e);
//     });
//   }

//   selectFile(event: any): void {
//     if (event.target.files) {
//       var reader = new FileReader();
//       reader.readAsDataURL(event.target.files[0]);
//       reader.onload = (event: any) => {
//         this.url = event.target.result;
//         this.image.src = this.url;
//       };

//       let ctx: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext(
//         '2d'
//       );

//       this.image.onload = () => {
//         ctx.clearRect(
//           0,
//           0,
//           this.myCanvas.nativeElement.width,
//           this.myCanvas.nativeElement.height
//         );
//         // ctx.canvas.height =
//         // this.myCanvas.nativeElement.width = this.image.width;
//         // this.myCanvas.nativeElement.height = this.image.height;
//         this.isDrawn = true;
//         ctx.drawImage(this.image, 0, 0, 1280, 720);
//       };
//     }
//   }

//   getMousePosition(event: any) {
//     if (this.isDrawn) {
//       let rect = this.myCanvas.nativeElement.getBoundingClientRect();
//       let x = event.clientX - rect.left;
//       let y = event.clientY - rect.top;
//       console.log('Coordinate x: ' + x, 'Coordinate y: ' + y);
//     }
//   }
// }

//LAKSHAY SIR CORRECTION
import { Component, OnInit } from '@angular/core';

import 'fabric';
declare const fabric: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  points = [
    {
      x: 3,
      y: 4
    },
    {
      x: 16,
      y: 3
    },
    {
      x: 25,
      y: 55
    },
    {
      x: 19,
      y: 44
    }
  ];
  canvas: any;

  image = new Image();
  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas');
    const polygon = new fabric.Polygon(this.points, {
      left: 100,
      top: 50,
      fill: 'lightyellow',
      strokeWidth: 1,
      stroke: 'green',
      scaleX: 4,
      scaleY: 4,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue'
    });
    this.canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
    this.canvas.add(polygon);
  }

  public Edit() {
    function polygonPositionHandler(dim, finalMatrix, fabricObject) {
      let x =
          fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
        y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
      return fabric.util.transformPoint(
        new fabric.Point(x, y),
        fabric.util.multiplyTransformMatrices(
          fabricObject.canvas.viewportTransform,
          fabricObject.calcTransformMatrix()
        )
      );
    }
    function anchorWrapper(anchorIndex, fn) {
      return function(eventData, transform, x, y) {
        var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint(
            new fabric.Point(
              fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
              fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
            ),
            fabricObject.calcTransformMatrix()
          ),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = fabricObject._getNonTransformedDimensions(),
          newX =
            (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
            polygonBaseSize.x,
          newY =
            (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
            polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      };
    }
    function actionHandler(eventData, transform, x, y) {
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(
          new fabric.Point(x, y),
          'center',
          'center'
        ),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x:
            (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
            polygon.pathOffset.x,
          y:
            (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
            polygon.pathOffset.y
        };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      return true;
    }
    let poly = this.canvas.getObjects()[0];
    this.canvas.setActiveObject(poly);
    poly.edit = !poly.edit;
    if (poly.edit) {
      let lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      poly.controls = poly.points.reduce(function(acc, point, index) {
        acc['p' + index] = new fabric['Control']({
          pointIndex: index,
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler
          ),
          actionName: 'modifyPolygon'
        });
        return acc;
      }, {});
    } else {
      poly.cornerColor = 'blue';
      poly.cornerStyle = 'rect';
      poly.controls = fabric.Object.prototype['controls'];
    }
    poly.hasBorders = !poly.edit;
    this.canvas.requestRenderAll();
  }
}
