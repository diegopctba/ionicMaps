import { NgModule } from '@angular/core';
import { RoutePage } from './route';
import { SearchPlace } from './route';

@NgModule({
  declarations: [
    RoutePage,
    SearchPlace
  ],
  
  exports: [
    RoutePage,
    SearchPlace
  ]
})
export class RouteModule {}
