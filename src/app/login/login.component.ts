import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {routerTransition} from '../router.animations';

import {ApiResponse} from '../api-response';

import {UtilService} from '../util.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  redirectTo: string;
  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    'username': '',
    'password': '',
  };
  formErrorMessages = {
    'username': {
      'required': 'Username is required!',
    },
    'password': {
      'required': 'Password is required!',
    },
  };

  buildForm(): void { //4
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private authService: AuthService,
  ) {
    this.buildForm();
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  ngOnInit() {
  }

  onLoggedin() {
    // TODO: make login process
    localStorage.setItem('isLoggedin', 'true');
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages); //5-1
    if (this.form.valid) {
      this.authService.login(this.form.value.username, this.form.value.password) //5-2
        .then(data => {
          this.router.navigate([this.redirectTo ? this.redirectTo : '/']); //5-3
        })
        .catch(response => {
          this.errorResponse = response;
          this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors); //5-4
        });
    }
  }

}