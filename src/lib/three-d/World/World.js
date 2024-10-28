// World.js

import Experience from '../Experience.js';
import Environment from './Environment.js';
import Neuron from './Neuron.js';
import * as THREE from 'three';

export default class World {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Configuration for neurons
		this.numNeurons = 120; // Total number of neurons
		this.rectangleLength = 5; // Length of the rectangle in units
		this.rectangleWidth = 5; // Width of the rectangle in units
		this.rectangleDepth = 0.5; // Depth of the rectangle in units

		// Flash timing parameters
		this.flashFrequency = 0.1; // Probability of each neuron flashing per update

		// Array to store multiple Neuron instances
		this.neurons = [];

		// Wait for resources
		this.resources.on('ready', () => {
			// Setup
			this.environment = new Environment();

			// Create neurons with random placement, rotation, and scale
			this.createRandomNeuronPlacement();

			// Add box helper and axis labels
			this.addBoxHelper();
			// this.addAxisLabels();
		});
	}

	createRandomNeuronPlacement() {
		const rows = Math.ceil(Math.sqrt(this.numNeurons));
		const columns = Math.ceil(this.numNeurons / rows);

		// Calculate spacing based on rectangle dimensions
		const xSpacing = this.rectangleLength / columns;
		const ySpacing = this.rectangleWidth / rows;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < columns; col++) {
				if (this.neurons.length >= this.numNeurons) break; // Stop if we've created enough neurons

				// Base position based on grid layout
				let xPos = (col - columns / 2) * xSpacing;
				let yPos = (row - rows / 2) * ySpacing;

				// Apply random displacement within half the spacing for each cell
				const xDisplacement = (Math.random() - 0.5) * xSpacing;
				const yDisplacement = (Math.random() - 0.5) * ySpacing;
				xPos += xDisplacement;
				yPos += yDisplacement;

				// Random z position within the depth bounds
				const zPos = (Math.random() - 0.5) * this.rectangleDepth;

				// Random rotation along the Y axis
				const rotationY = Math.random() * Math.PI * 2;

				// Slightly random scale around a base value
				const baseScale = 0.25;
				const scaleVariation = Math.random() * 0.25 - 0.125;
				const finalScale = baseScale + scaleVariation;

				// Create a neuron with the calculated random position, rotation, and scale
				const neuron = new Neuron({
					position: new THREE.Vector3(xPos, zPos, yPos),
					rotation: new THREE.Euler(0, rotationY, 0),
					scale: new THREE.Vector3(finalScale, finalScale, finalScale),
					flashDuration: 0.05,
					easingOut: 0.1
				});

				this.neurons.push(neuron); // Store each neuron
			}
		}
	}

	addBoxHelper() {
		// Define the bounding box dimensions
		const boxGeometry = new THREE.BoxGeometry(
			this.rectangleLength + 0.5,
			this.rectangleDepth + 1.25,
			this.rectangleWidth + 0.5
		);
		const boxMesh = new THREE.Mesh(boxGeometry); // Temporary mesh to create helper
		boxMesh.position.set(0, 0, 0); // Center box in scene

		// Create and add the BoxHelper
		const boxHelper = new THREE.BoxHelper(boxMesh, 0xf0f0f0);
		this.scene.add(boxHelper);
	}

	// addAxisLabels() {
	// 	// Label intervals for each axis based on cuboid dimensions
	// 	const intervals = 5;
	// 	const xInterval = this.rectangleLength / intervals;
	// 	const yInterval = this.rectangleWidth / intervals;
	// 	const zInterval = this.rectangleDepth / intervals;

	// 	const createLabel = (text, position) => {
	// 		const loader = new THREE.FontLoader();
	// 		loader.load('path/to/font.json', (font) => {
	// 			const textGeometry = new THREE.TextGeometry(text, {
	// 				font: font,
	// 				size: 0.1,
	// 				height: 0.02
	// 			});
	// 			const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
	// 			const textMesh = new THREE.Mesh(textGeometry, textMaterial);
	// 			textMesh.position.copy(position);
	// 			this.scene.add(textMesh);
	// 		});
	// 	};

	// 	// Add labels along each axis at intervals
	// 	for (let i = 0; i <= intervals; i++) {
	// 		// X-axis labels
	// 		createLabel(
	// 			`${i * 100}`,
	// 			new THREE.Vector3(
	// 				i * xInterval - this.rectangleLength / 2,
	// 				-this.rectangleWidth / 2,
	// 				-this.rectangleDepth / 2
	// 			)
	// 		);

	// 		// Y-axis labels
	// 		createLabel(
	// 			`${i * 100}`,
	// 			new THREE.Vector3(
	// 				-this.rectangleLength / 2,
	// 				i * yInterval - this.rectangleWidth / 2,
	// 				-this.rectangleDepth / 2
	// 			)
	// 		);

	// 		// Z-axis labels
	// 		createLabel(
	// 			`${i * 100}`,
	// 			new THREE.Vector3(
	// 				-this.rectangleLength / 2,
	// 				-this.rectangleWidth / 2,
	// 				i * zInterval - this.rectangleDepth / 2
	// 			)
	// 		);
	// 	}
	// }

	update() {
		// Update each neuron instance
		this.neurons.forEach((neuron) => {
			// Randomly trigger flash based on frequency
			if (Math.random() < this.flashFrequency) {
				neuron.triggerFlash();
			}
			neuron.update(this.experience.time.delta * 0.00015); // Pass delta time for flash update
		});
	}
}
