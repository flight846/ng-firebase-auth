import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from './auth.service';
import { SnackbarService } from '../shared/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUser) {
      this.router.navigate(["/private"]);
    } else {
      this.router.navigate([""]);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      displayName: ["", []],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    // signup
    if (!this.isLoginMode) {
      try {
        await this.authService.signup(
          this.form.value.displayName,
          this.form.value.email,
          this.form.value.password
        );
        this.loading = false;
        this.form.reset();
        this.form.markAsUntouched();
        this.router.navigate(["/private"]);
      } catch (error) {
        this.loading = false;
        this.form.reset();
        this.form.markAsUntouched();
      }
    } else {
      try {
        await this.authService.login(
          this.form.value.email,
          this.form.value.password
        );
        this.loading = false;
        this.form.reset();
        this.form.markAsUntouched();
        this.router.navigate(["/private"]);
      } catch (error) {
        this.loading = false;
        this.form.reset();
        this.form.markAsUntouched();
      }
    }
    this.submitted = false;
  }
}
