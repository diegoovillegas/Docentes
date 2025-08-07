import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuapp.docentes',
  appName: 'DocentesApp',
  webDir: 'dist/tu-app-angular', // 👈 pon la ruta donde Angular genera el build
  bundledWebRuntime: false
};

export default config;
