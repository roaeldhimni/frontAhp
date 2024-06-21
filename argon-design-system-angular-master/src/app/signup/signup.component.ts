import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    focus2;

    form:any = {} ; 

    danger : boolean = false ;
    sucess : boolean = false ;
    message : string = '';
    constructor(private userService:UserService) { }

    ngOnInit() {}

    signup(){
        if(this.form.username==null || this.form.email==null || this.form.password=='' ){
           this.message ="Registration Failed . Please verify your information !"
           this.sucess=false ;
           this.danger=true ;
        }else{
            console.log(this.form);
            if(this.form.role === "user"){
                this.userService.add(this.form).subscribe(data=>{
                    console.log("operation : " + data);
                    if(data){
                        this.message ="User Registration Success !"
                        this.sucess=true ;
                        this.danger=false ;
                    }else{
                        this.message ="User Registration Failed !"
                        this.sucess=false ;
                        this.danger=true ;
                    }
                });
            } else if(this.form.role === "expert"){
                console.log("this is an expert");
                this.userService.addExpert(this.form).subscribe(data=>{
                    console.log("operation : " + data);
                    if(data){
                        this.message ="Expert Registration Success !"
                        this.sucess=true ;
                        this.danger=false ;
                    }else{
                        this.message ="Expert Registration Success !"
                        this.sucess=true ;
                        this.danger=false ;
                    }
                });
            }
            
            
        }
    }
    
    }
