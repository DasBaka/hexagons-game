import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { Subscription } from 'rxjs';
import { storeFeature } from '../../../store/store.feature';
import { State } from '../../../store/store.interfaces';
import { Hexagon } from '../../models/classes/hexagon.class';
import { CanvasScreenService } from '../../services/game-board-hexagons.service';

const initialWidth = 1000;
const initialHeight = 1000;

@Component({
	selector: 'app-canvas-screen',
	imports: [],
	templateUrl: './canvas-screen.component.html',
	styleUrl: './canvas-screen.component.scss',
})
export class CanvasScreenComponent implements OnInit, OnDestroy {
	public stage!: Stage;
	public layer!: Layer;
	private sceneWidth = initialWidth;
	private sceneHeight = initialHeight;
	private hexagonsData: Array<{ x: number; y: number; radius: number; rotation: number; color: string }> = [];
	private hexagonsSubscription: Subscription | undefined;

	constructor(private ngZone: NgZone, private hexCreator: CanvasScreenService, private store: Store<State>) {
		this.hexCreator.createHexesData(this.sceneWidth / 2, this.sceneHeight / 2, Math.min(this.sceneWidth, this.sceneHeight) / 50);
	}

	ngOnInit() {
		this.waitForElement('screen').then(() => {
			this.stage = new Konva.Stage({
				container: 'screen',
				width: this.sceneWidth,
				height: this.sceneHeight,
			});

			this.layer = new Konva.Layer();
			this.stage.add(this.layer);

			this.hexagonsSubscription = this.store.select(storeFeature.selectBoardHexagons).subscribe((hexagons) => (this.hexagonsData = hexagons));

			this.drawHex();

			window.addEventListener('resize', this.fitStageIntoParentContainer.bind(this));

			this.ngZone.run(() => {
				this.fitStageIntoParentContainer();
			});
		});
	}

	ngOnDestroy() {
		if (this.hexagonsSubscription) {
			this.hexagonsSubscription.unsubscribe();
		}
		window.removeEventListener('resize', this.fitStageIntoParentContainer.bind(this));
	}

	drawHex() {
		this.layer.clear();
		for (let hex of this.hexagonsData) {
			const hexagon = new Hexagon(hex.x, hex.y, hex.radius, hex.rotation, hex.color);
			this.layer.add(hexagon);
		}
		this.layer.draw();
	}

	private waitForElement(id: string): Promise<void> {
		return new Promise((resolve) => {
			if (document.getElementById(id)) {
				return resolve();
			}

			const observer = new MutationObserver(() => {
				if (document.getElementById(id)) {
					resolve();
					observer.disconnect();
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		});
	}

	fitStageIntoParentContainer() {
		const container = document.getElementById('screen');
		this.sceneWidth = initialWidth;
		this.sceneHeight = initialHeight;

		if (container && this.stage) {
			const containerWidth = container.offsetWidth;
			const containerHeight = container.offsetHeight;
			const scale = Math.min(containerWidth / this.sceneWidth, containerHeight / this.sceneHeight);

			this.stage.width(this.sceneWidth * scale);
			this.stage.height(this.sceneHeight * scale);
			this.stage.scale({ x: scale, y: scale });
			this.stage.draw();
		}
	}
}
