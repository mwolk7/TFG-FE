export enum Roles {
  VP = 'role-pos-view',
  GP = 'role-pos-manage',
  AP = 'role-pos-assign',
  MP = 'role-pos-monitor',
  SA = 'role-sys-admin',
  ADM = 'role-ptf-admin',
  TL = 'role-leader'
}

export class  RoleBuilder {
  static all = [Roles.VP, Roles.GP, Roles.AP, Roles.MP, Roles.ADM, Roles.TL];
  static loanManager = [Roles.VP, Roles.GP];
  static groupLeader = [Roles.VP, Roles.AP, Roles.GP, Roles.TL];
  static head = [Roles.VP, Roles.GP, Roles.AP, Roles.TL];
  static portfolioManager = [Roles.VP, Roles.AP, Roles.GP, Roles.TL];
  static backOffice = [Roles.GP, Roles.TL];
  static director = [Roles.VP, Roles.AP, Roles.GP];
}
