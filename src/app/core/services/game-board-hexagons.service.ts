import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateStore } from '../../store/store.feature';

@Injectable({
	providedIn: 'root',
})
export class CanvasScreenService {
	constructor(private store: Store) {}

	createHexesData(centerX: number, centerY: number, hexRadius: number) {
		let hexagonArray: Array<{ x: number; y: number; radius: number }> = [];
		const PI2 = Math.PI * 2;

		hexagonArray.push({ x: centerX, y: centerY, radius: hexRadius });

		for (let i = 1; i <= 10; i++) {
			for (let j = 0; j < 6; j++) {
				const currentX = centerX + Math.cos((j * PI2) / 6) * hexRadius * 2 * i;
				const currentY = centerY + Math.sin((j * PI2) / 6) * hexRadius * 2 * i;
				hexagonArray.push({ x: currentX, y: currentY, radius: hexRadius });
				for (let k = 1; k < i; k++) {
					const newX = currentX + Math.cos((j * PI2) / 6 + PI2 / 3) * hexRadius * 2 * k;
					const newY = currentY + Math.sin((j * PI2) / 6 + PI2 / 3) * hexRadius * 2 * k;
					hexagonArray.push({ x: newX, y: newY, radius: hexRadius });
				}
			}
		}

		this.store.dispatch(updateStore({ key: 'boardHexagons', value: hexagonArray }));
	}
}
