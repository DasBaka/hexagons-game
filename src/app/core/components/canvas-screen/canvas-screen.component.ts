import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { BoardHexDataInterface } from '../../models/interfaces/board-hex-data.interface';
import { CanvasScreenService } from '../../services/game-board-hexagons.service';
import { Hexagon } from '../../models/classes/hexagon.class';
import { IState } from '../../../store/store.interfaces';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { storeFeature } from '../../../store/store.feature';

const initialWidth = 1000;
const initialHeight = 1000;

/** Component responsible for rendering and managing the canvas screen.*/
@Component({
  selector: 'app-canvas-screen',
  imports: [],
  templateUrl: './canvas-screen.component.html',
  styleUrl: './canvas-screen.component.scss'
})
export class CanvasScreenComponent implements OnInit, OnDestroy {
  public stage!: Stage;
  public layer!: Layer;
  private sceneWidth = initialWidth;
  private sceneHeight = initialHeight;
  private hexagonsData: BoardHexDataInterface[][] = [];
  private hexagonsSubscription: Subscription | undefined;

  constructor(
    private ngZone: NgZone,
    private hexCreator: CanvasScreenService,
    private store: Store<IState>
  ) {
    this.hexCreator.createHexesData(
      this.sceneWidth / 2,
      this.sceneHeight / 2,
      Math.min(this.sceneWidth, this.sceneHeight) / 50
    );
  }

  ngOnInit() {
    this.waitForElement('screen').then(() => {
      this.stage = new Konva.Stage({
        container: 'screen',
        width: this.sceneWidth,
        height: this.sceneHeight
      });

      this.layer = new Konva.Layer();
      this.stage.add(this.layer);

      this.hexagonsSubscription = this.store.select(storeFeature.selectBoardHexagons).subscribe((hexagons) => {
        this.hexagonsData = hexagons;
      });

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

  /** Draws hexagons on the Konva layer based on the current hexagon data.*/
  private drawHex(): void {
    this.layer.clear();
    for (let level = 0; level < this.hexagonsData.length; level++) {
      const currentLevel = this.hexagonsData[level];
      for (let i = 0; i < currentLevel.length; i++) {
        const hex = currentLevel[i];
        const { x, y, radius, rotation, instanceType } = hex;
        const name = hex.ringLevel + '|' + hex.id;
        const hexagon = new Hexagon({ x, y, radius, rotation, instanceType, name });

        // TODO: refactor this inside adjectant class #adjectantsByName #bridgesByName
        hexagon.on('mouseenter', () => {
          const adjectants = [...hex.adjectantsByName, ...hex.bridgesByName];

          for (const adjectantByName of adjectants) {
            const found = this.stage.findOne(`#${adjectantByName}`) as Hexagon;
            if (found !== undefined) {
              found.recolor('yellow');
            }
          }
        });
        hexagon.on('mouseleave', () => {
          const adjectants = [...hex.adjectantsByName, ...hex.bridgesByName];

          for (const adjectantByName of adjectants) {
            const found = this.stage.findOne(`#${adjectantByName}`) as Hexagon;
            if (found !== undefined) {
              found.setBaseColor();
            }
          }
        });

        this.layer.add(hexagon);
        // const text1 = new Konva.Text({
        // 	x: hex.x - 0.166 * hex.radius,
        // 	y: hex.y - 0.666 * hex.radius,
        // 	text: hex.ringLevel > 11 ? '' : hex.ringLevel.toString(),
        // 	fontSize: 11,
        // 	fill: 'black',
        // });
        // this.layer.add(text1);
        // const text2 = new Konva.Text({
        // 	x: hex.x - 0.166 * hex.radius,
        // 	y: hex.y - 0.166 * hex.radius,
        // 	text: hex.id.toString(),
        // 	fontSize: 11,
        // 	fill: 'black',
        // });
        // this.layer.add(text2);
      }
    }
    this.layer.draw();
  }

  /** Returns a Promise that resolves when an element with the specified ID is found in the DOM.*/
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
        subtree: true
      });
    });
  }

  /** Adjusts the size and scale of the Konva stage to fit within its parent container.*/
  private fitStageIntoParentContainer() {
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
