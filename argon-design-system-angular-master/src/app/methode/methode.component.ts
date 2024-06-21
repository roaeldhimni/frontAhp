import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-methode',
  templateUrl: './methode.component.html',
  styleUrls: ['./methode.component.css']
})
export class MethodeComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  validation(){
    
    this.router.navigate(['firstpage'])
         
}
historique(){
    
  this.router.navigate(['fahp'])
       
}
}
