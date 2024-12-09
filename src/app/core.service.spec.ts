import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoreService } from './core.service';
import { RequestType, userData } from './interfaces';
import { expect } from '@jest/globals';
import { environment } from '../environments/environment';

describe('CoreService', () => {
  let service: CoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoreService]
    });
    service = TestBed.inject(CoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockUserData: userData = {
      username: 'testuser', password: 'testpass',
      email: 'test@test.com'
    };
    const mockResponse: RequestType = { status: 'true', message: 'User registered successfully' };

    service.registerUser(mockUserData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiBaseUrl + '/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });
});