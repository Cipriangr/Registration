import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../core.service';
import { RegistrationComponent } from './registration.component';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let mockCoreService: jest.Mocked<CoreService>;

  beforeEach(async () => {
    mockCoreService = {
      registerUser: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegistrationComponent],
      providers: [{ provide: CoreService, useValue: mockCoreService }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    test('should initialize the form group', () => {
      expect(component.contactFormGroup).toBeDefined();
      expect(component.contactFormGroup.controls['username']).toBeDefined();
      expect(component.contactFormGroup.controls['email']).toBeDefined();
      expect(component.contactFormGroup.controls['password']).toBeDefined();
      expect(component.contactFormGroup.controls['fullname']).toBeDefined();
    });

    test('should have initial form values as empty', () => {
      expect(component.contactFormGroup.get('username')?.value).toBe('');
      expect(component.contactFormGroup.get('email')?.value).toBe('');
      expect(component.contactFormGroup.get('password')?.value).toBe('');
      expect(component.contactFormGroup.get('fullname')?.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    test('should validate username', () => {
      const usernameControl = component.contactFormGroup.get('username');
      
      // Invalid cases
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeFalsy();
      
      usernameControl?.setValue('ab');
      expect(usernameControl?.valid).toBeFalsy();
      
      usernameControl?.setValue('a'.repeat(26));
      expect(usernameControl?.valid).toBeFalsy();
      
      // Valid case
      usernameControl?.setValue('validuser');
      expect(usernameControl?.valid).toBeTruthy();
    });

    test('should validate email', () => {
      const emailControl = component.contactFormGroup.get('email');
      
      // Invalid cases
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalsy();
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      
      // Valid case
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    test('should validate password', () => {
      const passwordControl = component.contactFormGroup.get('password');
      
      // Invalid cases
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalsy();
      
      passwordControl?.setValue('short');
      expect(passwordControl?.valid).toBeFalsy();
      
      passwordControl?.setValue('onlylowercase');
      expect(passwordControl?.valid).toBeFalsy();
      
      // Valid case
      passwordControl?.setValue('StrongP@ss123');
      expect(passwordControl?.valid).toBeTruthy();
    });
  });

  describe('Input Validation Method', () => {
    test('should return true for untouched valid fields', () => {
      const result = component.checkValidInput('username');
      expect(result).toBeTruthy();
    });

    test('should return false for invalid touched fields', () => {
      const usernameControl = component.contactFormGroup.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();
      
      const result = component.checkValidInput('username');
      expect(result).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    test('should prevent submission for invalid form', () => {
      const preventDefaultSpy = jest.fn();
      const event = { preventDefault: preventDefaultSpy } as any;

      // Set an invalid form
      component.contactFormGroup.get('username')?.setValue('');
      component.contactFormGroup.get('email')?.setValue('');
      component.contactFormGroup.get('password')?.setValue('');

      component.submitForm(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.errorForm).toBeTruthy();
    });

    test('should submit form successfully', () => {
      // Mock successful registration response
      const mockResponse = { status: 'success', message: 'Registration Successful' };
      mockCoreService.registerUser.mockReturnValue(of(mockResponse));

      // Spy on alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Create a valid form
      component.contactFormGroup.setValue({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'StrongP@ss123'
      });

      const event = { preventDefault: jest.fn() } as any;

      // Submit the form
      component.submitForm(event);

      // Expectations
      expect(mockCoreService.registerUser).toHaveBeenCalledWith(
        component.contactFormGroup.value
      );
      expect(alertSpy).toHaveBeenCalledWith(mockResponse.message);
      expect(component.contactFormGroup.pristine).toBeTruthy();
    });

    test('should handle registration error', () => {
      // Mock error response
      mockCoreService.registerUser.mockReturnValue(
        throwError(() => new Error('Registration Failed'))
      );

      // Spy on alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Create a valid form
      component.contactFormGroup.setValue({
        username: 'testuser',
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'StrongP@ss123'
      });

      const event = { preventDefault: jest.fn() } as any;

      // Submit the form
      component.submitForm(event);

      // Expectations
      expect(mockCoreService.registerUser).toHaveBeenCalledWith(
        component.contactFormGroup.value
      );
      expect(alertSpy).toHaveBeenCalledWith('There was an error while submitting the form. Please try again');
      expect(component.contactFormGroup.pristine).toBeTruthy();
    });
  });

  describe('Component Destruction', () => {
    test('should unsubscribe from subscriptions on destroy', () => {
      const unsubscribeSpy = jest.spyOn(component.subscriptions, 'unsubscribe');
      
      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});