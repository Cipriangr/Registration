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
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/)]],
    })
  }

  checkValidInput(inputType: string): boolean {
    const control = this.contactFormGroup.get(inputType);
  
    if (!control) {
      return false;
    }
  
    return control.touched || control.dirty ? control.valid : true;
  }
  
  confirmPassword(): boolean {
    const password = this.contactFormGroup.get('password')?.value;
    const confirmPassword = this.contactFormGroup.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  isPassWordValidInput(): boolean { 
    const confirmPasswordControl = this.contactFormGroup.get('confirmPassword');
    if (!confirmPasswordControl?.touched && !confirmPasswordControl?.dirty) {
      return true;
    }
    return this.checkValidInput('confirmPassword') && this.confirmPassword();
  }

  submitForm(event: Event): void {
    event.preventDefault();
    if (!this.contactFormGroup.valid || !this.isPassWordValidInput()) {
      this.errorForm = true;
      return;
    }

    const { confirmPassword, ...registrationData } = this.contactFormGroup.value;
    this.errorForm = false;
    const registerSub = this.coreService.registerUser(registrationData).subscribe({
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
