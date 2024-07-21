/*

Jonas Kjeldmand Jensen, July 2024

----- Emergent Pattern Simulation: Digital Slime Mold Behavior -----
Inspired by nature's self-organizing systems and complex adaptive behaviors.

This interactive visualization explores the fascinating world of decentralized 
decision-making and pattern formation. Drawing parallels from biological systems, 
particularly the behavior of Physarum polycephalum (slime mold), this simulation 
demonstrates how simple rules can lead to complex, emergent behaviors.

Each digital 'mold' agent navigates the canvas using local sensory information, 
leaving behind a trail of pheromones. These trails influence the movement of other
agents, creating a feedback loop that results in mesmerizing, organic patterns.

This project serves as a thought-provoking exploration of swarm intelligence,
decentralized systems, and the beauty of emergent complexity in user interface design.
*/

// Simulation parameters (feel free to modify these)
const MOLD_COUNT = 4000;  // Number of mold particles
const TRAIL_FADE_RATE = 5;  // How quickly the trail fades (higher = faster fade)
const CANVAS_WIDTH = 800;  // Width of the canvas
const CANVAS_HEIGHT = 600;  // Height of the canvas

let molds = [];
let pixelDensity;

function setup() {
    createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity = window.devicePixelRatio;
  
  // Initialize mold particles
  for (let i = 0; i < MOLD_COUNT; i++) {
    molds.push(new Mold());
  }
  
  // Set up accessibility description
  textSize(16);
  textAlign(CENTER, CENTER);
  fill(255);
  text('Slime Mold Simulation', width/2, height/2);
  describe('This sketch simulates behaviors of slime molds. Particles move across the screen, leaving trails and creating organic patterns.', LABEL);
}

function draw() {
  // Apply a semi-transparent background to create trail fade effect
  background(0, TRAIL_FADE_RATE);
  
  // Load pixel data for sensing
  loadPixels();
  
  // Update and display each mold particle
  for (let mold of molds) {
    mold.update();
    mold.display();
  }
  
  // Optional: Display frame rate for performance monitoring
  // fill(255);
  // text(`FPS: ${frameRate().toFixed(2)}`, 50, 20);
}

// Optional: Resize canvas when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}