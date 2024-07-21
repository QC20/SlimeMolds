class Mold {
  constructor() {
    // Mold appearance
    this.radius = 0.5;
    this.color = color(255);  // White color for mold particles
    
    // Position and movement
    this.position = this.getInitialPosition();
    this.heading = random(360);
    this.velocity = p5.Vector.fromAngle(radians(this.heading));
    this.rotationAngle = 45;  // Angle to rotate when changing direction
    
    // Sensor properties
    this.sensorAngle = 45;
    this.sensorDistance = 10;
    this.sensors = {
      right: createVector(),
      left: createVector(),
      front: createVector()
    };
  }
  
  getInitialPosition() {
    // Start molds near the center of the canvas
    const centerX = width / 2;
    const centerY = height / 2;
    const spreadFactor = 20;  // Adjust this to change initial spread
    return createVector(
      random(centerX - spreadFactor, centerX + spreadFactor),
      random(centerY - spreadFactor, centerY + spreadFactor)
    );
  }
  
  update() {
    this.move();
    this.updateSensors();
    this.adjustDirection();
  }
  
  move() {
    // Update position based on velocity
    this.position.add(this.velocity);
    
    // Wrap around canvas edges
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
  }
  
  updateSensors() {
    // Calculate sensor positions based on current position and heading
    this.updateSensorPosition(this.sensors.right, this.heading + this.sensorAngle);
    this.updateSensorPosition(this.sensors.left, this.heading - this.sensorAngle);
    this.updateSensorPosition(this.sensors.front, this.heading);
  }
  
  updateSensorPosition(sensor, angle) {
    const x = this.position.x + this.sensorDistance * cos(angle);
    const y = this.position.y + this.sensorDistance * sin(angle);
    sensor.set(x, y);
    
    // Wrap sensor positions around canvas edges
    sensor.x = (sensor.x + width) % width;
    sensor.y = (sensor.y + height) % height;
  }
  
  adjustDirection() {
    // Get trail intensity at each sensor position
    const rightIntensity = this.getTrailIntensity(this.sensors.right);
    const leftIntensity = this.getTrailIntensity(this.sensors.left);
    const frontIntensity = this.getTrailIntensity(this.sensors.front);
    
    // Determine new heading based on sensor readings
    if (frontIntensity > leftIntensity && frontIntensity > rightIntensity) {
      // Continue in the same direction
    } else if (frontIntensity < leftIntensity && frontIntensity < rightIntensity) {
      // Randomly choose left or right
      this.heading += random() < 0.5 ? this.rotationAngle : -this.rotationAngle;
    } else if (leftIntensity > rightIntensity) {
      this.heading -= this.rotationAngle;
    } else if (rightIntensity > leftIntensity) {
      this.heading += this.rotationAngle;
    }
    
    // Update velocity based on new heading
    this.velocity = p5.Vector.fromAngle(radians(this.heading));
  }
  
  getTrailIntensity(position) {
    // Calculate the index in the pixel array
    const x = floor(position.x);
    const y = floor(position.y);
    const index = 4 * (y * width + x);
    
    // Return the red channel value (assuming grayscale trail)
    return pixels[index];
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2);
    
    // Uncomment to visualize sensors and heading
    // this.displayDebug();
  }
  
  displayDebug() {
    // Display heading
    stroke(255, 0, 0);
    line(this.position.x, this.position.y, 
         this.position.x + this.radius * 6 * this.velocity.x, 
         this.position.y + this.radius * 6 * this.velocity.y);
    
    // Display sensors
    fill(255, 0, 0);
    noStroke();
    ellipse(this.sensors.right.x, this.sensors.right.y, this.radius);
    ellipse(this.sensors.left.x, this.sensors.left.y, this.radius);
    ellipse(this.sensors.front.x, this.sensors.front.y, this.radius);
  }
}