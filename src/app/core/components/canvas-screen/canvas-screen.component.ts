import { AfterContentInit, AfterViewInit, Component, NgZone } from '@angular/core';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { Hexagon } from '../../models/classes/hexagon.class';

const initialWidth = 500;
const initialHeigth = 500;

@Component({
	selector: 'app-canvas-screen',
	imports: [],
	templateUrl: './canvas-screen.component.html',
	styleUrl: './canvas-screen.component.scss',
})
export class CanvasScreenComponent implements AfterViewInit, AfterContentInit {
	stage!: Stage;
	layer!: Layer;
	sceneWidth = initialWidth;
	sceneHeight = initialHeigth;

	constructor(private ngZone: NgZone) {}

	ngAfterViewInit() {
		this.stage = new Konva.Stage({
			container: 'screen',
			width: this.sceneWidth,
			height: this.sceneHeight,
		});

		this.layer = new Konva.Layer();

		var hexagon = new Hexagon(this.sceneWidth / 2, this.sceneHeight / 2, this.sceneWidth);

		// add the shape to the layer
		this.layer.add(hexagon);

		// add the this.layer to the this.stage
		this.stage.add(this.layer);

		this.layer.draw();
		window.addEventListener('resize', this.fitStageIntoParentContainer.bind(this));
	}

	ngAfterContentInit() {
		// Use setTimeout to ensure DOM is fully rendered
		setTimeout(() => {
			this.ngZone.run(() => {
				this.fitStageIntoParentContainer();
			});
		}, 0);
	}

	fitStageIntoParentContainer() {
		var container = document.getElementById('stage-parent');
		this.sceneWidth = initialWidth;
		this.sceneHeight = initialHeigth;

		if (container && this.stage) {
			var containerWidth = container.offsetWidth;
			var containerHeight = container.offsetHeight;
			var scale = Math.min(containerWidth / this.sceneWidth, containerHeight / this.sceneHeight);

			this.stage.width(this.sceneWidth * scale);
			this.stage.height(this.sceneHeight * scale);
			this.stage.scale({ x: scale, y: scale });
			this.stage.draw();
		}
	}
}
