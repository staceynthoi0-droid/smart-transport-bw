import { UserRole } from '@/hooks/useAuth';

export const DEMO_ACCOUNTS: Array<{
  role: UserRole;
  label: string;
  email: string;
  password: string;
  fullName: string;
}> = [
  {
    role: 'commuter',
    label: 'Demo Commuter',
    email: 'commuter.demo@smarttransportbw.co.bw',
    password: 'Demo1234!',
    fullName: 'Demo Commuter',
  },
  {
    role: 'driver',
    label: 'Demo Driver',
    email: 'driver.demo@smarttransportbw.co.bw',
    password: 'Driver1234!',
    fullName: 'Demo Driver',
  },
];
