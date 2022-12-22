function p(x, y) {
  return { x, y };
}

function ln(p1, p2) {
  return [p1, p2];
}

function poly(...points) {
  return points;
}

function isPointInTriangle(point, triangle) {
  var x = point.x,
    y = point.y;
  var x1 = triangle[0].x,
    y1 = triangle[0].y;
  var x2 = triangle[1].x,
    y2 = triangle[1].y;
  var x3 = triangle[2].x,
    y3 = triangle[2].y;

  var s = y1 * x3 - x1 * y3 + (y3 - y1) * x + (x1 - x3) * y;
  var t = x1 * y2 - y1 * x2 + (y1 - y2) * x + (x2 - x1) * y;

  if (s < 0 != t < 0) return false;

  var A = -y2 * x3 + y1 * (x3 - x2) + x1 * (y2 - y3) + x2 * y3;
  if (A < 0.0) {
    s = -s;
    t = -t;
    A = -A;
  }
  return s > 0 && t > 0 && s + t < A;
}

// Comment this function
// Description: Checks if two lines intersect
function doLinesIntersect(line1, line2) {
  var x1 = line1[0].x;
  var y1 = line1[0].y;
  var x2 = line1[1].x;
  var y2 = line1[1].y;
  var x3 = line2[0].x;
  var y3 = line2[0].y;
  var x4 = line2[1].x;
  var y4 = line2[1].y;

  var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator == 0) {
    return false;
  }

  var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

  return t > 0 && t < 1 && u > 0;
}

// Check if two polygons intersect
function doPolygonsIntersect(polygon1, polygon2) {
  var i, j, k, l;
  for (i = 0; i < polygon1.length; i++) {
    j = (i + 1) % polygon1.length;
    for (k = 0; k < polygon2.length; k++) {
      l = (k + 1) % polygon2.length;
      if (
        doLinesIntersect(
          [polygon1[i], polygon1[j]],
          [polygon2[k], polygon2[l]]
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

function isPointInPolygon(
  point = { x: 0, y: 0 },
  polygon = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 20 },
  ]
) {
  var i,
    j,
    c = false;
  for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (
      polygon[i].y > point.y != polygon[j].y > point.y &&
      point.x <
      ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) /
      (polygon[j].y - polygon[i].y) +
      polygon[i].x
    ) {
      c = !c;
    }
  }
  return c;
}

function drawPolygon(points) {
  beginShape();
  for (const point of points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}

const geometry = {
  rotatePoint: function(point, center, degrees) {
    var radians = degrees * Math.PI / 180;
    var x = Math.cos(radians) * (point.x - center.x) - Math.sin(radians) * (point.y - center.y) + center.x;
    var y = Math.sin(radians) * (point.x - center.x) + Math.cos(radians) * (point.y - center.y) + center.y;
    return { x: x, y: y };
  },

  rotatePoints: function(polygon, center, degrees) {
    var newPolygon = [];
    for (const point of polygon) {
      newPolygon.push(this.rotatePoint(point, center, degrees));
    }
    return newPolygon;
  },

  scalePoint: function(point, center, scale) {
    var x = (point.x - center.x) * scale + center.x;
    var y = (point.y - center.y) * scale + center.y;
    return { x: x, y: y };
  },

  scalePoints: function(polygon, center, scale) {
    var newPolygon = [];
    for (const point of polygon) {
      newPolygon.push(this.scalePoint(point, center, scale));
    }
    return newPolygon;
  },

  makeRect: function(width, height) {
    return [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ];
  },

  centerPolygon: function(center, polygon) {
    var newPolygon = [];
    for (const point of polygon) {
      newPolygon.push({ x: point.x - center.x, y: point.y - center.y });
    }
    return newPolygon;
  },

  translatePoints(polygon, x, y) {
    var newPolygon = [];
    for (const point of polygon) {
      newPolygon.push({ x: point.x + x, y: point.y + y });
    }
    return newPolygon;
  }
}

class Polygon {
  constructor(points) {
    this.points = points;
    this.center = this.getCenter();
    this.direction = 0;
    this.scale = 1;
    this.color = [255, 255, 255];
    this.x = 0;
    this.y = 0;
    this.calculateFinalImage();
    this.show = true;
    this.debug = {
      showCenter: false,
    }
    return this;
  }

  setPoints(points) {
    this.points = points;
    this.center = this.getCenter();
    this.calculateFinalImage();
  }

  getCenter() {
    var x = 0;
    var y = 0;
    for (const point of this.points) {
      x += point.x;
      y += point.y;
    }
    return { x: x / this.points.length, y: y / this.points.length };
  }

  setDirection(direction) {
    if (direction === this.direction) return;
    this.direction = direction;
    this.calculateFinalImage();
  }

  setScale(scale) {
    if (scale === this.scale) return;
    this.scale = scale;
    this.calculateFinalImage();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  calculateFinalImage() {
    this.finalImage = geometry.rotatePoints(this.points, this.center, this.direction);
    this.finalImage = geometry.scalePoints(this.finalImage, this.center, this.scale);
    this.finalImage = geometry.centerPolygon(this.center, this.finalImage);
  }

  isTouchingPoint(point) {
    return isPointInPolygon(p(point.x - this.x, point.y - this.y), this.finalImage);
  }

  isTouchingPolygon(polygon) {
    return doPolygonsIntersect(this.finalImage, polygon.finalImage);
  }

  draw() {
    push();
    noStroke();
    translate(this.x, this.y);
    fill(this.color[0], this.color[1], this.color[2]);
    drawPolygon(this.finalImage);
    if (this.debug.showCenter) {
      stroke('red');
      strokeWeight(3);
      point(0, 0);
    }
    pop();
  }
}

class ImageSprite extends Polygon {
  constructor(img = { width: 0, height: 0, emptyImage: true }) {
    const points = geometry.makeRect(img.width, img.width);
    super(points);
    if (img.emptyImage) {
      this.setImage(img);
    }
    this.displayType = 0;
    this.opacity = 100;
    this.tint = 255;
  }

  setImage(img) {
    this.image = img;
    this.width = img.width;
    this.height = img.height;
    this.setPoints(geometry.makeRect(img.width, img.height));
  }

  draw() {
    if (!this.image) return console.error('No image set');
    push();
    translate(this.x, this.y);
    angleMode(DEGREES);
    rotate(this.direction);
    tint(255, this.opacity * 2.55);
    scale(this.scale);
    image(this.image, -this.center.x, -this.center.y);
    pop();
  }
}