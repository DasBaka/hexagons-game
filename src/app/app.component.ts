import { Component } from '@angular/core';
import { CanvasScreenComponent } from './canvas-screen/canvas-screen.component';

@Component({
	selector: 'app-root',
	imports: [CanvasScreenComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'hexagons';
}
