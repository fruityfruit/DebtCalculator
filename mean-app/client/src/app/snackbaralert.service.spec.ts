import { TestBed } from '@angular/core/testing';

import { SnackbaralertService } from './snackbaralert.service';

describe('SnackbaralertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnackbaralertService = TestBed.get(SnackbaralertService);
    expect(service).toBeTruthy();
  });
});
