class Mold {
    constructor() {
      this.position = createVector(random(width), random(height));
      this.velocity = p5.Vector.random2D();
      this.maxSpeed = 1;
      this.size = 2;
      this.sensorAngle = 45;
      this.sensorDistance = 10;
      this.rotationAngle = 45;
    }
    
    update() {  
      this.sense();
      this.move();
    }
    
    sense() {
      let ahead = this.getSensorPosition(0);
      let right = this.getSensorPosition(this.sensorAngle);
      let left = this.getSensorPosition(-this.sensorAngle);
      
      let aheadIntensity = this.getTrailIntensity(ahead);
      let rightIntensity = this.getTrailIntensity(right);
      let leftIntensity = this.getTrailIntensity(left);
      
      if (aheadIntensity > leftIntensity && aheadIntensity > rightIntensity) {
        // Continue in the same direction
      } else if (aheadIntensity < leftIntensity && aheadIntensity < rightIntensity) {
        this.velocity.rotate(random([-1, 1]) * this.rotationAngle);
      } else if (leftIntensity > rightIntensity) {
        this.velocity.rotate(-this.rotationAngle);
      } else if (rightIntensity > leftIntensity) {
        this.velocity.rotate(this.rotationAngle);
      }
    }
    
    move() {
      this.position.add(this.velocity);
      this.position.x = (this.position.x + width) % width;
      this.position.y = (this.position.y + height) % height;
    }
    
    getSensorPosition(angle) {
      return p5.Vector.add(this.position, p5.Vector.fromAngle(this.velocity.heading() + radians(angle), this.sensorDistance));
    }
    
    getTrailIntensity(pos) {
      let x = floor(pos.x);
      let y = floor(pos.y);
      let index = 4 * (y * width + x);
      return pixels[index] + pixels[index + 1] + pixels[index + 2];
    }
    
    display() {
      stroke(hue, 80, 100, 0.5);
      point(this.position.x, this.position.y);
    }
  }
  
  class FastMold extends Mold {
    constructor() {
      super();
      this.maxSpeed = 2;
      this.size = 1.5;
    }
    
    move() {
      super.move();
      this.velocity.setMag(this.maxSpeed);
    }
    
    display() {
      stroke((hue + 120) % 360, 80, 100, 0.5);
      point(this.position.x, this.position.y);
    }
  }
  
  class SensitiveMold extends Mold {
    constructor() {
      super();
      this.sensorDistance = 15;
      this.rotationAngle = 60;
      this.size = 2.5;
    }
    
    sense() {
      super.sense();
      // Additional sensing for food sources
      let nearestFood = this.findNearestFood();
      if (nearestFood) {
        let toFood = p5.Vector.sub(nearestFood, this.position);
        if (toFood.mag() < 50) {
          this.velocity = toFood.setMag(this.maxSpeed);
        }
      }
    }
    
    findNearestFood() {
      let nearest = null;
      let recordDist = Infinity;
      for (let food of foodSources) {
        let d = this.position.dist(food);
        if (d < recordDist) {
          recordDist = d;
          nearest = food;
        }
      }
      return nearest;
    }
    
    display() {
      stroke((hue + 240) % 360, 80, 100, 0.5);
      point(this.position.x, this.position.y);
    }
  }