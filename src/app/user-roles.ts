export enum UserRoles {
    All = '*',
    Admin = 'ROLE_ADMIN',
    Staff = 'ROLE_STAFF',
    Member = 'ROLE_MEMBER',
    User = 'ROLE_USER',
    
}

export const USER_ROLES = {
    StaffOrAdmin: [UserRoles.Staff, UserRoles.Admin],
    MemberOrStaffOrAdmin: [UserRoles.Member, UserRoles.Staff, UserRoles.Admin],
  };
