// Neuron.js

import * as THREE from 'three';
import Experience from '../Experience.js';
// import { materialOpacity } from 'three/examples/jsm/nodes/Nodes.js';

export default class Neuron {
	constructor(options = {}) {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('neuron');
		}

		// Resource
		this.resource = this.resources.items.mouseModel;

		// Options for position, rotation, scale
		this.position = options.position || new THREE.Vector3(0, 0, 0);
		this.rotation = options.rotation || new THREE.Euler(0, 0, 0);
		this.scale = options.scale || new THREE.Vector3(0.2, 0.2, 0.2);

		this.setModel();

		// Flashing properties
		this.isFlashing = false;
		this.flashDuration = options.flashDuration || 0.2; // default flash duration in seconds
		this.flashTime = 0;
		this.originalColor = 0x0b0b0b; // Set default color to black
		this.flashColor = 0xf0f0f0; // Flash color (white)
		this.easingOut = options.easingOut || 0.1; // Easing effect for fade-out
	}

	setModel() {
		this.model = this.resource.scene.clone(); // Clone the model for unique instances
		this.model.scale.copy(this.scale);
		this.model.position.copy(this.position);
		this.model.rotation.copy(this.rotation);

		// Set material to a MeshBasicMaterial to allow color change
		this.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				// child.castShadow = true;
				child.material = new THREE.MeshBasicMaterial({
					color: this.flashColor,
					transparent: true,
					opacity: 0.3
				});
				// child.material = new THREE.MeshPhysicalMaterial({
				// 	color: new THREE.Color(0xff8888), // Light blue tint
				// 	transparent: true, // Enable transparency
				// 	// roughness: 0.2, // Low roughness for a smooth surface
				// 	// metalness: 0.1, // Minimal metalness for a glassy look
				// 	// clearcoat: 1.0, // High clearcoat for polished effect
				// 	// clearcoatRoughness: 0.1, // Slightly rough clearcoat for realism
				// 	transmission: 0.7 // Allow light to pass through
				// });
			}
		});

		this.scene.add(this.model);
	}

	// Method to trigger a flash
	triggerFlash() {
		this.isFlashing = true;
		this.flashTime = 0; // Reset the flash time
	}

	update(deltaTime) {
		// If flashing, update flash effect
		if (this.isFlashing) {
			this.flashTime += deltaTime;

			// Calculate progress (0 to 1) based on easing
			const progress = this.flashTime / this.flashDuration;
			const easedProgress = Math.pow(1 - progress, this.easingOut); // Ease-out effect

			// Update color based on progress, interpolating from white back to black
			this.model.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material.color.lerpColors(
						new THREE.Color(this.flashColor), // Start from flash color (white)
						new THREE.Color(this.originalColor), // Fade to original color (black)
						easedProgress
					);
				}
			});

			// End flash effect when duration is reached
			if (this.flashTime >= this.flashDuration) {
				this.isFlashing = false;
			}
		}
	}
}
