import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  public loadingButton: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    document.body.setAttribute('class', 'authentication-bg');

    this.loginForm = this.formBuilder.group({
      email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() { 
    document.body.classList.remove('authentication-bg')
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
  this.submitted = true;
  this.loadingButton = true;

  if (this.loginForm.invalid) {
    return;
  }

  const finishLoading = () => {
    setTimeout(() => {
      this.loadingButton = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000); // Espera para navegación
    }, 2000); // Espera antes de desactivar botón
  };

  if (environment.defaultauth === 'firebase') {
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .then((res: any) => {
        document.body.removeAttribute('class');
        finishLoading();
      })
      .catch(error => {
        this.error = error ? error : '';
        this.loadingButton = false;
      });
  } else {
    this.authFackservice.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          finishLoading();
        },
        error => {
          this.error = error ? error : '';
          this.loadingButton = false;
        }
      );
  }
}

}
