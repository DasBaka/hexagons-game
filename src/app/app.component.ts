import { Component } from '@angular/core';
import { CanvasScreenComponent } from './core/core.component';

@Component({
	selector: 'app-root',
	imports: [CanvasScreenComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'hexagons';
}
