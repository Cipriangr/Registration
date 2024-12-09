import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../core.service';
import { RegistrationComponent } from './registration.component';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { RequestStatus } from '../interfaces';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let coreServiceMock: { registerUser: jest.Mock };

  beforeEach(async () => {
    coreServiceMock = {
      registerUser: jest.fn(),
    };
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CoreService, useValue: coreServiceMock }
      ]
    }).overrideComponent(RegistrationComponent, {
      set: {
        providers: [{ provide: CoreService, useValue: coreServiceMock }],
      },
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.contactFormGroup.get('username')?.value).toBe('');
    expect(component.contactFormGroup.get('fullname')?.value).toBe('');
    expect(component.contactFormGroup.get('email')?.value).toBe('');
    expect(component.contactFormGroup.get('password')?.value).toBe('');
  });

  it('should return true if the form control is valid', () => {
    component.contactFormGroup.get('username')?.setValue('testuser');
    component.contactFormGroup.get('username')?.markAsTouched();
  
    const result = component.checkValidInput('username');
    expect(result).toBe(true);
  });

  it('should return false if the form control is not found', () => {
    const result = component.checkValidInput('nonExistentControl');
    expect(result).toBe(false);
  });  

  it('should validate required fields', () => {
    const form = component.contactFormGroup;
    expect(form.valid).toBeFalsy();
    
    form.controls['username'].setValue('testuser');
    form.controls['email'].setValue('test@test.com');
    form.controls['password'].setValue('Test123!@');
    form.controls['confirmPassword'].setValue('Test123!@');
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate password pattern', () => {
    const passwordControl = component.contactFormGroup.get('password');
    
    passwordControl?.setValue('weak');
    expect(passwordControl?.errors?.['pattern']).toBeTruthy();
    
    passwordControl?.setValue('StrongPass123!');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should submit form successfully', fakeAsync(() => {
    component.contactFormGroup.setValue({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'StrongP@ss123',
      confirmPassword: 'StrongP@ss123'
    });

    coreServiceMock.registerUser.mockReturnValue(
      of({ message: 'Registration successful!', status: 'success' })
    );

    const event = { preventDefault: jest.fn() } as any;
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // tick the async operation
    component.submitForm(event);
    tick();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(coreServiceMock.registerUser).toHaveBeenCalledWith({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'StrongP@ss123',
    });
    expect(alertSpy).toHaveBeenCalledWith(RequestStatus.SuccesSubmittingForm);
  }));

  it('should set errorForm to true and not call registerUser if form is invalid', () => {
    component.contactFormGroup.setValue({
      username: '',
      fullname: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  
    const event = { preventDefault: jest.fn() } as any;
    component.submitForm(event);
  
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.errorForm).toBe(true);
    expect(coreServiceMock.registerUser).not.toHaveBeenCalled();
  });
  

  it('should handle registration error', fakeAsync(() => {
    component.contactFormGroup.setValue({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'StrongP@ss123',
      confirmPassword: 'StrongP@ss123'
    });

    coreServiceMock.registerUser.mockReturnValue(
      throwError(() => new Error('Registration Failed'))
    );

    const event = { preventDefault: jest.fn() } as any;
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.submitForm(event);
    tick();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(coreServiceMock.registerUser).toHaveBeenCalledWith({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'StrongP@ss123',
    });
    expect(alertSpy).toHaveBeenCalledWith(RequestStatus.ErrorSubmittingForm);
  }));

  it('should unsubscribe from subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should return true when passwords match in confirmPassword method', () => {
    component.contactFormGroup.get('password')?.setValue('StrongP@ss123');
    component.contactFormGroup.get('confirmPassword')?.setValue('StrongP@ss123');
    
    const result = component.confirmPassword();
    expect(result).toBe(true);
  });

  it('should return false when passwords do not match in confirmPassword method', () => {
    component.contactFormGroup.get('password')?.setValue('StrongP@ss123');
    component.contactFormGroup.get('confirmPassword')?.setValue('DifferentP@ss123');
    
    const result = component.confirmPassword();
    expect(result).toBe(false);
  });

  it('should return true for isPassWordValidInput when confirmPassword is untouched and dirty', () => {
    const confirmPasswordControl = component.contactFormGroup.get('confirmPassword');
    confirmPasswordControl?.markAsUntouched();
    confirmPasswordControl?.markAsPristine();
    
    const result = component.isPassWordValidInput();
    expect(result).toBe(true);
  });

  it('should return true for isPassWordValidInput when confirmPassword is valid and matches password', () => {
    component.contactFormGroup.get('password')?.setValue('StrongP@ss123');
    component.contactFormGroup.get('confirmPassword')?.setValue('StrongP@ss123');
    component.contactFormGroup.get('confirmPassword')?.markAsTouched();
    component.contactFormGroup.get('confirmPassword')?.markAsDirty();
    
    const result = component.isPassWordValidInput();
    expect(result).toBe(true);
  });

  it('should return false for isPassWordValidInput when confirmPassword is invalid or does not match password', () => {
    component.contactFormGroup.get('password')?.setValue('StrongP@ss123');
    component.contactFormGroup.get('confirmPassword')?.setValue('DifferentP@ss123');
    component.contactFormGroup.get('confirmPassword')?.markAsTouched();
    component.contactFormGroup.get('confirmPassword')?.markAsDirty();
    
    const result = component.isPassWordValidInput();
    expect(result).toBe(false);
  });
});
