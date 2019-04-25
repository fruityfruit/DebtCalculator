import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatSnackBarModule } from "@angular/material";
import { SnackbarService } from "./snackbar.service";

fdescribe("SnackbarService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [ MatSnackBarModule ]
  }));

  it("should be created", () => {
    const service: SnackbarService = TestBed.get(SnackbarService);
    expect(service).toBeTruthy();
  });
});
