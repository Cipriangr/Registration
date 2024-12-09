describe('Registration Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('should display the registration form', () => { 
    cy.get('form').should('be.visible');
  });

  it('should display the registration form title', () => { 
    cy.get('h1').should('contain', 'Registration form');
  });

  it('should display the registration form fields', () => {
    cy.get('input[formControlName="username"]').should('be.visible');
    cy.get('input[formControlName="fullname"]').should('be.visible');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('input[formControlName="confirmPassword"]').should('be.visible');
  });

  it('should display the registration form field labels', () => { 
    cy.get('label[for="username"]').should('contain', 'User Name');
    cy.get('label[for="fullname"]').should('contain', 'Full Name');
    cy.get('label[for="email"]').should('contain', 'Email');
    cy.get('label[for="password"]').should('contain', 'Password');
    cy.get('label[for="confirmPassword"]').should('contain', 'Confirm Password');
  });

  it('should display the registration form submit button', () => {
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Register me');
  });

  it('should show error when submitting with empty fields', () => {
    cy.get('form').submit();
    cy.get('.errorForm').should('contain.text', 'Please fill out all required fields marked with an asterisk (*)');
  });

  it('should allow form submission with valid data and make a network request', () => {
    // Intercept the network request
    cy.intercept('POST', 'http://localhost:3000/register').as('registerRequest');
  
    cy.get('input[formControlName="username"]').type('Cipriangr');
    cy.get('input[formControlName="fullname"]').type('Ciprian Grumazescu');
    cy.get('input[formControlName="email"]').type('cipriangrumazescu97@gmail.com');
    cy.get('input[formControlName="password"]').type('StrongP@ss123');
    cy.get('input[formControlName="confirmPassword"]').type('StrongP@ss123');
  
    cy.get('form').submit();
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);
  
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contains('Registration data received successfully');
    });
  
    // Verify the form fields are reset
    cy.get('input[formControlName="username"]').should('have.value', '');
    cy.get('input[formControlName="fullname"]').should('have.value', '');
    cy.get('input[formControlName="email"]').should('have.value', '');
    cy.get('input[formControlName="password"]').should('have.value', '');
    cy.get('input[formControlName="confirmPassword"]').should('have.value', '');
  });

  it('should show error when submitting with empty username', () => { 
    cy.get('input[formControlName="username"]').type('ci');
    cy.get('input[formControlName="fullname"]').type('Ciprian Grumazescu');
    cy.get('input[formControlName="email"]').type('cipriangrumazescu97@gmail.com');
    cy.get('input[formControlName="password"]').type('Password123!@');
    cy.get('input[formControlName="confirmPassword"]').type('Password123!@');

    cy.get('form').submit();

    cy.get('.errorForm').should('contain.text', 'Minimum length must be 3 characters and maximum 25');
  });

  it('should show error when submitting with invalid email', () => {
    cy.get('input[formControlName="username"]').type('Cipriangr');
    cy.get('input[formControlName="fullname"]').type('Ciprian Grumazescu');
    cy.get('input[formControlName="email"]').type('cipriangrumazescu97');
    cy.get('input[formControlName="password"]').type('Password123!@');
    cy.get('input[formControlName="confirmPassword"]').type('Password123!@');

    cy.get('form').submit();

    cy.get('.errorForm').should('contain.text', 'Please enter a valid email address');
  });

  it('should show error when submitting with invalid password', () => {
    cy.get('input[formControlName="username"]').type('Cipriangr');
    cy.get('input[formControlName="fullname"]').type('Ciprian Grumazescu');
    cy.get('input[formControlName="email"]').type('cipriangrumazescu97@gmail.com');
    cy.get('input[formControlName="password"]').type('password');
    cy.get('input[formControlName="confirmPassword"]').type('password');

    cy.get('form').submit();

    cy.get('.errorForm').should('contain.text', 'Password must be 8-12 characters long, including uppercase and lowercase letters, numbers, and a special character');
  });

  it('should show asterisk on required fields', () => { 
    cy.get('.required').should('contain.text', '*');
    cy.get('.required').should('have.length', 4);
  });

  it('should have green background for valid fields', () => {
    cy.get('input[formControlName="username"]').type('Cipriangr');
    cy.get('input[formControlName="username"]').should('have.class', 'ng-valid');
    cy.get('input[formControlName="username"]').should('have.css', 'background-color', 'rgba(0, 255, 0, 0.1)');
  });

  it('should have red background for invalid fields', () => {
    cy.get('input[formControlName="email"]').type('invalid-email');
    cy.get('input[formControlName="email"]').should('have.class', 'ng-invalid');
    cy.get('input[formControlName="email"]').should('have.css', 'background-color', 'rgba(255, 0, 0, 0.1)');
  });

  it('should display the confirmation password field', () => {
    cy.get('input[formControlName="confirmPassword"]').should('be.visible');
  });

  it('should show error when confirmation password does not match password', () => {
    cy.get('input[formControlName="username"]').type('Cipriangr');
    cy.get('input[formControlName="fullname"]').type('Ciprian Grumazescu');
    cy.get('input[formControlName="email"]').type('cipriangrumazescu97@gmail.com');
    cy.get('input[formControlName="password"]').type('Password123!@');
    cy.get('input[formControlName="confirmPassword"]').type('Password123');

    cy.get('form').submit();

    cy.get('.errorForm').should('contain.text', 'Passwords do not match');
  });

})
