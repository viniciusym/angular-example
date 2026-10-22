import { TestBed } from '@angular/core/testing';
import { AlbumsServices } from './albums-services';

describe('AlbumsServices', () => {
  let service: AlbumsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
