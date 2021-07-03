import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Roles } from '../commons/roles/roles';

@Injectable({
    providedIn: 'root'
})
export class EnablingService {
  constructor(private userService: UserService) { }

  isEnabled(enablingString: EnablingEnum) {
    let enabled = false;
    switch (enablingString) {
        case EnablingEnum.PositionsChangeStatusWorkflow:
            enabled = this.doCheckRoles(Roles.AP, Roles.GP);
            break;
        default:
            break;
    }
    return enabled;
  }

  isDisabled(enablingString: EnablingEnum): boolean {
    return !this.isEnabled(enablingString);
  }

  private doCheckRoles(...rolesToCheck: string[]): boolean {
    return this.userService.checkRoles(rolesToCheck);
  }
}

export enum EnablingEnum {
  PositionsChangeStatusWorkflow = 'PositionsChangeStatusWorkflow'
}
