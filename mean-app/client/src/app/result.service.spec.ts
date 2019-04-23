import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { ResultService } from "./result.service";

fdescribe("ResultService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it("should be created", () => {
    const service: ResultService = TestBed.get(ResultService);
    expect(service).toBeTruthy();
  });
});
