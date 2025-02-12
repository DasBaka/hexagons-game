import { CanvasScreenComponent } from './core/core.component';
import { Component } from '@angular/core';

/** Root component of the Hexagons application. */
@Component({
  selector: 'app-root',
  imports: [CanvasScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'hexagons';
}
