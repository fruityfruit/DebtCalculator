import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { ProfileService } from "./profile.service";

fdescribe("ProfileService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it("should be created", () => {
    const service: ProfileService = TestBed.get(ProfileService);
    expect(service).toBeTruthy();
  });
});
