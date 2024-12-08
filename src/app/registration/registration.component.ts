import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { Subscription } from 'rxjs';
import { RequestStatus } from '../interfaces';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [CoreService]
})
export class RegistrationComponent implements OnInit, OnDestroy {
  contactFormGroup!: FormGroup;
  errorForm: boolean = false;
  coreService = inject(CoreService);
  subscriptions = new Subscription();
  submitMessage: string = '';

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.contactFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      fullname: ['', [Validators.minLength(3), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/)]],
    })
  }

  checkValidInput(inputType: string): boolean {
    const control = this.contactFormGroup.get(inputType);
  
    if (!control) {
      return false;
    }
  
    return control.touched || control.dirty ? control.valid : true;
  }
  

  submitForm(event: Event): void {
    event.preventDefault();
    if (!this.contactFormGroup.valid) {
      this.errorForm = true;
      return;
    }

    this.errorForm = false;
    const registerSub = this.coreService.registerUser(this.contactFormGroup.value).subscribe({
      next: () => {
        alert(RequestStatus.SuccesSubmittingForm);
        this.contactFormGroup.reset();
      },
      error: () => {
        alert(RequestStatus.ErrorSubmittingForm);
        this.contactFormGroup.reset();
      },
    });
    this.subscriptions.add(registerSub)
  }

  ngOnDestroy(): void { 
    this.subscriptions.unsubscribe();
  }
}
