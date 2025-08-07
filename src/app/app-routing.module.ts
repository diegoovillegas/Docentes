import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

const routes: Routes = [

 {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
   {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./pages/estudiantes/estudiantes.module').then( m => m.EstudiantesPageModule)
  },
  {
    path: 'detalle-alumno',
    loadChildren: () => import('./pages/detalle-estudiante/detalle-estudiante.module').then( m => m.DetalleEstudiantePageModule)
  },
{
  path: 'historial',
  loadComponent: () => import('./pages/historial/historial.page').then(m => m.HistorialPage)
},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
