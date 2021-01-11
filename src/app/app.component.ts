import {
  ViewChild,
  ElementRef,
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import 'fabric';
declare const fabric: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  // @ViewChild('myCanvas') myCanvas: ElementRef;
  myCanvas: any;
  image = new Image();
  url: string;
  isCanvasDrawn: boolean = true;
  canvas: any;
  polygon: any;
  isDrawing: boolean = true;

  newPt: any;
  constructor() {}

  ngAfterViewInit() {
    this.canvas.on('mouse:up', options => {
      if (options.button === 1) {
        this.getClickCoords(options.e);
      }
    });

    this.canvas.on('mouse:down', event => {
      if (event.button === 3) {
        this.makePolygon();
      }
    });
  }

  selectFile(event: any): void {
    var canvas = this.canvas;
    if (event.target.files) {
      var reader = new FileReader();
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        // var pugImg = this.image;
        // pugImg.onload = function(img) {
        //   var pug = new fabric.Image(pugImg, {
        //     angle: 0,
        //     width: 1280,
        //     height: 720,
        //     left: canvas.width / 2,
        //     top: canvas.height / 2,
        //     scaleX: 1,
        //     scaleY: 1
        //   });
        //   canvas.add(pug);
        // };
        // pugImg.src = this.url;
        this.image.src = this.url;
      };
      let ctx: CanvasRenderingContext2D = this.myCanvas.getContext('2d');
      this.image.onload = () => {
        ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
        this.isCanvasDrawn = true;
        ctx.drawImage(this.image, 0, 0, 1280, 720);
      };
    }
  }

  getClickCoords(event: any) {
    if (this.isCanvasDrawn && this.isDrawing) {
      console.log(
        'Coordinate x: ' + event.layerX,
        'Coordinate y: ' + event.layerY
      );

      this.newPt = {
        x: event.layerX,
        y: event.layerY
      };
      this.points.push(this.newPt);
      this.canvas.add(this.polygon);
    }
  }

  makePolygon() {
    this.isDrawing = false;
    console.log('right click makePolygon');
    // this.canvas.add(this.polygon);
    console.log(this.points);
  }

  //POLYGON CODE
  points = [];

  // image = new Image(); //ALREADY INITIALISED ABOVE
  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas', { fireRightClick: true });
    console.log('canvas check', this.canvas);
    console.log(this.canvas.height);
    console.log(this.canvas.width);
    console.log('this.canvas.lowerCanvasEl', this.canvas.lowerCanvasEl);
    this.myCanvas = this.canvas.lowerCanvasEl;

    this.polygon = new fabric.Polygon(this.points, {
      left: 0,
      top: 0,
      fill: 'lightyellow',
      strokeWidth: 1,
      stroke: 'lightgrey',
      scaleX: 4,
      scaleY: 4,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue'
    });
    this.canvas.viewportTransform = [0.25, 0, 0, 0.25, 0, 0];
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
    }

    poly.hasBorders = !poly.edit;
    this.canvas.requestRenderAll();
  }
}
