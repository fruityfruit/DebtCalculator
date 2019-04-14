import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { OpportunityService } from './opportunity.service';

fdescribe('OpportunityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: OpportunityService = TestBed.get(OpportunityService);
    expect(service).toBeTruthy();
  });
});
