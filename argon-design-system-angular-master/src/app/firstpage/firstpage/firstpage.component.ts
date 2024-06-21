import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})
export class FirstpageComponent implements OnInit {
  focus;
  focus1;
  constructor(private router:Router) { }

  form : any ={}
 

  ngOnInit(): void {
    
    this.form =JSON.parse(sessionStorage.getItem("USER"));
    
  }

  validation(){
    
      this.router.navigate(['ahp'])
           
  }

  historique(){
    
    this.router.navigate(['historique'])
         
}

}
