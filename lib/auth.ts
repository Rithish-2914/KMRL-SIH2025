export type UserRole = 'station_controller' | 'engineer' | 'finance' | 'hr' | 'executive' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  malayalam_name: string
  role: UserRole
  department: string
  avatar?: string
}

export const mockUsers: Record<string, { password: string; user: User }> = {
  'controller@kmrl.gov.in': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'controller@kmrl.gov.in',
      name: 'Rajesh Kumar',
      malayalam_name: 'രാജേഷ് കുമാർ',
      role: 'station_controller',
      department: 'Operations',
    },
  },
  'engineer@kmrl.gov.in': {
    password: 'demo123',
    user: {
      id: '2',
      email: 'engineer@kmrl.gov.in',
      name: 'Priya Menon',
      malayalam_name: 'പ്രിയ മേനോൻ',
      role: 'engineer',
      department: 'Maintenance',
    },
  },
  'finance@kmrl.gov.in': {
    password: 'demo123',
    user: {
      id: '3',
      email: 'finance@kmrl.gov.in',
      name: 'Anand Nair',
      malayalam_name: 'ആനന്ദ് നായർ',
      role: 'finance',
      department: 'Finance',
    },
  },
  'hr@kmrl.gov.in': {
    password: 'demo123',
    user: {
      id: '4',
      email: 'hr@kmrl.gov.in',
      name: 'Lakshmi Pillai',
      malayalam_name: 'ലക്ഷ്മി പിള്ള',
      role: 'hr',
      department: 'Human Resources',
    },
  },
  'executive@kmrl.gov.in': {
    password: 'demo123',
    user: {
      id: '5',
      email: 'executive@kmrl.gov.in',
      name: 'Dr. Suresh Babu',
      malayalam_name: 'ഡോ. സുരേഷ് ബാബു',
      role: 'executive',
      department: 'Executive',
    },
  },
  'admin@kmrl.gov.in': {
    password: 'admin123',
    user: {
      id: '6',
      email: 'admin@kmrl.gov.in',
      name: 'Admin User',
      malayalam_name: 'അഡ്മിൻ ഉപയോക്താവ്',
      role: 'admin',
      department: 'IT',
    },
  },
}

export function authenticateUser(email: string, password: string): User | null {
  const account = mockUsers[email.toLowerCase()]
  if (account && account.password === password) {
    return account.user
  }
  return null
}

export function getRoleDashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    station_controller: '/dashboard/controller',
    engineer: '/dashboard',
    finance: '/dashboard',
    hr: '/dashboard',
    executive: '/dashboard',
    admin: '/admin',
  }
  return paths[role]
}

export function getRolePermissions(role: UserRole) {
  const permissions = {
    station_controller: {
      canUpload: true,
      canApprove: true,
      canViewAll: false,
      canManageUsers: false,
      canAccessAdmin: false,
    },
    engineer: {
      canUpload: true,
      canApprove: true,
      canViewAll: false,
      canManageUsers: false,
      canAccessAdmin: false,
    },
    finance: {
      canUpload: true,
      canApprove: true,
      canViewAll: true,
      canManageUsers: false,
      canAccessAdmin: false,
    },
    hr: {
      canUpload: true,
      canApprove: true,
      canViewAll: true,
      canManageUsers: true,
      canAccessAdmin: false,
    },
    executive: {
      canUpload: false,
      canApprove: true,
      canViewAll: true,
      canManageUsers: false,
      canAccessAdmin: false,
    },
    admin: {
      canUpload: true,
      canApprove: true,
      canViewAll: true,
      canManageUsers: true,
      canAccessAdmin: true,
    },
  }
  return permissions[role]
}
