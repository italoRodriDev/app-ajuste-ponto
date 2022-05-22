import { AlertsService } from './../../services/utils/alerts/alerts.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { FormGroup } from '@angular/forms';
import { FormsService } from 'src/app/services/forms/forms.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  
  formSignUp: FormGroup = this.formsService.formSignUp;
  listManagers: Array<User> = [];
  managerSubscription: Subscription;

  constructor(
    private alertService: AlertsService,
    private formsService: FormsService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.onChangeModeManager();
  }

  onClickCreateAccount() {

    const token = this.formSignUp.controls.tokenValid.value;
    
    if(token){
      this.authService.createAccountUser();  
    } else{
      this.alertService.showToast('Token invalido!');
    }

  }

  onChangeModeManager() {
    this.formSignUp.valueChanges.subscribe((data) => {
      setTimeout(() => {
        switch (data.token) {
          case '123456':
            this.formSignUp.patchValue({ tokenValid: true });
            break;
          default:
            this.formSignUp.patchValue({ tokenValid: false });
        }
      }, 3000);
    });
  }
}
