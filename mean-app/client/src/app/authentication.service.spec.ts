import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from "./home/home.component";
import { MatSnackBarModule } from "@angular/material";

fdescribe("AuthenticationService", () => {

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        HttpClientModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
      ]
    });
  });
  it("should be created", () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
