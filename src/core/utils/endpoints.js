// export class Endpoints {
//   static devUrl = "http://localhost:3000";
//   // static prodUrl = "https://well-nest-back.vercel.app";
//   static baseUrl = Endpoints.devUrl;
//   static doctors = `doctors`;
//   static patients = `patients`;
//   static departments = `departments`;
//   static appointments = `appointments`;
//   static doctorSchedule = 'calendar';
//   static login = `auth/login`;
//   static me = `auth/me`;
// }

export class Endpoints {
  static devUrl = "http://localhost:3000";
  // static prodUrl = "https://well-nest-back.vercel.app";
  static baseUrl = Endpoints.devUrl;

  static doctors = `${Endpoints.baseUrl}/doctors`;
  static patients = `${Endpoints.baseUrl}/patients`;
  static departments = `${Endpoints.baseUrl}/departments`;
  static appointments = `${Endpoints.baseUrl}/appointments`;
  static doctorSchedule = `${Endpoints.baseUrl}/calendar`;

  static login = `${Endpoints.baseUrl}/auth/login`;
  static me = `${Endpoints.baseUrl}/auth/me`;
}
