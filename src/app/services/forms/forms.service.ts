import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
const EMPTY_REGEX = /(.|\s)*\S(.|\s)*/;

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  readonly userNameValidator = ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]];
  readonly emailValidator = ['', [Validators.email, Validators.minLength(8), Validators.maxLength(100), Validators.required]];
  readonly passValidator = ['', [Validators.minLength(8), Validators.maxLength(8), Validators.required]];
  readonly tokenValidator = ['', [Validators.minLength(6), Validators.maxLength(6), Validators.required]];

  readonly searchValidator = ['', [Validators.pattern(EMPTY_REGEX), Validators.minLength(20), Validators.maxLength(200)]];
  readonly nameValidator = ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]];
  readonly textValidator = ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]];
  readonly titleValidator = ['', [Validators.minLength(3), Validators.maxLength(45), Validators.required]];
  readonly descValidator = ['', [Validators.minLength(8), Validators.maxLength(200), Validators.required]];
  readonly numberAddressValidator = ['', [Validators.minLength(1), Validators.maxLength(10), Validators.required]];
  readonly phoneValidator = ['', [Validators.minLength(11), Validators.maxLength(11), Validators.required]];
  readonly formattedAddressValidator = ['', [Validators.minLength(10), Validators.maxLength(300), Validators.required]];
  readonly reqValidator = ['', [Validators.required]];

  // -> Formulario de cadastro
  formSignUp: FormGroup = this.fb.group({
    userName: this.userNameValidator,
    password: this.passValidator,
    type: this.reqValidator,
    tokenValid: this.reqValidator,
    token: this.reqValidator,
  });

  // -> Formulario de login
  formSign: FormGroup = this.fb.group({
    userName: this.userNameValidator,
    password: this.passValidator,
  });

  // -> Formulario de ajuste de ponto
  formAdjustmentPoint: FormGroup = this.fb.group({
    id: [],
    dateJorney: this.reqValidator,
    nameUser: this.nameValidator,
    typeAdjustment: this.reqValidator,
    reasonAdjustment: this.reqValidator,
    hourStart: this.reqValidator,
    hourEnd: this.reqValidator,
    typeAction: this.reqValidator,
    adjustment: this.reqValidator,
    urlEvidence: this.reqValidator
  });

  constructor(private fb: FormBuilder) {
    this.configInit();
   }

  configInit(){

    this.formSignUp.patchValue({
      type: 'COLABORADOR'
    })
  }

}
