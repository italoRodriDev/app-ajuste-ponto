import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FormsService } from 'src/app/services/forms/forms.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formSign: FormGroup = this.formService.formSign;

  constructor(
    private formService: FormsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.formSign.reset();
  }

  onClickLogin() {
    this.authService.signUser();
  }
  
}
