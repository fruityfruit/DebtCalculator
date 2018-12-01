import { TestBed } from '@angular/core/testing';

import { OpportunityformService } from './opportunityform.service';

describe('OpportunityformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpportunityformService = TestBed.get(OpportunityformService);
    expect(service).toBeTruthy();
  });
});
