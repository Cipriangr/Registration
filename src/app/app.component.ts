import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
