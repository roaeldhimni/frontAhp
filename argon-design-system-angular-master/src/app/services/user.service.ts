import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://ample-beauty-production.up.railway.app/users/';
const EXPERT_URL = 'https://ample-beauty-production.up.railway.app/experts/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    ) { }
 
     headers = new HttpHeaders();
     
  
user:any = JSON.parse(sessionStorage.getItem("USER")) ;

expert:any = JSON.parse(sessionStorage.getItem("EXPERT")) ;

  
  getallusers(): Observable<any> {
    return this.http.get(API_URL + 'all' )
  }

  add(form:any){
   return this.http.post(API_URL+'/saveUser',form)
  }

  login(form:any){
    return this.http.get(API_URL+'/login/'+form.username+'/'+form.password)
   }

   loginUser(form:any){
    return this.http.get(API_URL+'/loginUser/'+form.username+'/'+form.password)
   }

   getUserProjcts(){
    return this.http.get(API_URL+'/getProjets/'+this.user.id)
   }

   getexpertEmails(): Observable<any> {
    return this.http.get(EXPERT_URL + 'emails' )
  }
  addExpert(form:any){
    return this.http.post(EXPERT_URL+'/save',form)
   }

findExpertByEmail(email: string): Observable<any> {
  return this.http.get(EXPERT_URL + 'findByEmail/' + email);
}

updateProjectId(expertId: number, projectId: number): Observable<any> {
  return this.http.put(EXPERT_URL + 'updateProjectId/' + expertId, { projectId });
}
loginExp(form:any){
  return this.http.get(EXPERT_URL+'/login/'+form.username+'/'+form.password)
   }
loginExpert(form:any){
  return this.http.get(EXPERT_URL+'/loginExpert/'+form.username+'/'+form.password)
   }
getAlternativesByProjectId(projectId: number) {
  return this.http.get<any[]>(`https://ample-beauty-production.up.railway.app/experts/projectDetails/${projectId}`);
}
  
}