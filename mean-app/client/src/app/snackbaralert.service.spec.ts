import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatSnackBarModule } from "@angular/material";
import { SnackbaralertService } from "./snackbaralert.service";

fdescribe("SnackbaralertService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [ MatSnackBarModule ]
  }));

  it("should be created", () => {
    const service: SnackbaralertService = TestBed.get(SnackbaralertService);
    expect(service).toBeTruthy();
  });
});
