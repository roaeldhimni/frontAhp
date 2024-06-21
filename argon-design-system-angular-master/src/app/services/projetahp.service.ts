import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://ample-beauty-production.up.railway.app/projets/';
const CRITERS_URL = 'https://ample-beauty-production.up.railway.app/criters/';
const SOUS_CRITERS_URL = 'https://ample-beauty-production.up.railway.app/souscriters/';
const ALTERNATIVE_URL= 'https://ample-beauty-production.up.railway.app/alternatives/'
const apiUrl='https://ample-beauty-production.up.railway.app/relationCriters/' ;
const apiUrlFahp='https://ample-beauty-production.up.railway.app/relationCriterFahp/' ;

const apiSUrl='https://ample-beauty-production.up.railway.app/relationSousCriters/' ;
const apiSUrlFahp='https://ample-beauty-production.up.railway.app/relationSousCriterFahp/' ;

const apiSAltUrl='https://ample-beauty-production.up.railway.app/alternativesSousCriters/' ;
const apiSUrlFahpExpert='https://ample-beauty-production.up.railway.app/expertSousCriterAlternative/' ;

const apiSAltUrlFahp='https://ample-beauty-production.up.railway.app/sousCriterAlternativeFahp/' ;

const RELATION_CRITERS_URL ='https://ample-beauty-production.up.railway.app/relationCriters/';


@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  RELATION_CRITERS_URL = RELATION_CRITERS_URL;
   baseUrl = 'apiSUrl';
   ALTERNATIVE_URL=ALTERNATIVE_URL
apiUrl='apiUrl'
CRITERS_URL=CRITERS_URL
  constructor(private http: HttpClient,) { }
 
     
     
  

  
  getallprojets() {
    return this.http.get(API_URL + 'all' )
  }

  getprojet(id:any){

    return this.http.get(API_URL + 'criterof/'+id )
  }

  getsousCriters(id:any){

    return this.http.get(CRITERS_URL + 'souscriterof/'+id )
  }

  add(form:any){
   return this.http.post(API_URL+'/save',form)
  }

  /*login(form:any){
    return this.http.get(API_URL+'/login/'+form.username+'/'+form.password)
   }*/

   addCriters(form:any){
    return this.http.post(CRITERS_URL+'save',form)
   }

   addSousCriters(form:any){
    return this.http.post(SOUS_CRITERS_URL+'save',form)
   }

   addalternative(form:any){
    return this.http.post(ALTERNATIVE_URL+'save',form)
   }
   save(relationCriter:any){
    return this.http.post(apiUrl+'save',relationCriter)
   }
savefahp(relationCriterFahp:any){
  return this.http.post(apiUrlFahp+'save',relationCriterFahp)
   }

saveS(relationSCriter:any){
  return this.http.post(apiSUrl+'save',relationSCriter)
   }


saveSfahp(relationSCriterFahp:any){
  return this.http.post(apiSUrlFahp+'save',relationSCriterFahp)
   }

saveSfahpExpert(relationSCriterFahp:any){
  return this.http.post(apiSUrlFahpExpert+'save',relationSCriterFahp)
   }
calculateAverageBounds(): Observable<any> {
  return this.http.get<any>('https://ample-beauty-production.up.railway.app/expertSousCriterAlternative/all');
}
saveSAlt(relationSCriterAlt:any){
  return this.http.post(apiSAltUrl+'save',relationSCriterAlt)
   }


saveSAltfahp(relationSCriterAltFahp:any){
  return this.http.post(apiSAltUrlFahp+'save',relationSCriterAltFahp)
   }

updateAlternativeRankCi(id: number, alternative: any): Observable<any> {
  const url =` ${ALTERNATIVE_URL}updateRankCi/${id}`; // Assurez-vous que votre API attend l'ID de l'alternative
  return this.http.put(url, alternative);
}

getCriterIdByName(criterName: string): Observable<number> {
  return this.http.get<number>(`${CRITERS_URL}getCriterIdByName/${criterName}`);
}
getSousCriterIdByName(souscriterName: string): Observable<number> {
  return this.http.get<number>(`${SOUS_CRITERS_URL}getSCriterIdByName/${souscriterName}`);
  }
getRelationCriterFactorsByProjetId(projetId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.RELATION_CRITERS_URL}projet/${projetId}`);
  }

getRelationSousCriteres(projetId: number): Observable<any[]> {
  return this.http.get<any[]>(`https://ample-beauty-production.up.railway.app/projet/${projetId}/souscriteres`);
}// Ajoutez cette fonction à votre service Angular

getRelationSousCriteresByProjetAhpId(projetAhpId: number): Observable<any[]> {
  return this.http.get<any[]>(`${apiSUrl}projet/${projetAhpId}/souscriteres`);
}
updateSousCriter(sousCriter: any): Observable<any> {
  const url = `${SOUS_CRITERS_URL}${sousCriter.id}`; // Remplacez SOUS_CRITERS_URL par l'URL de votre API
  return this.http.put(url, sousCriter);
}
getRelationAlternativesSousCriteres(projetAhpId: number): Observable<any[]> {
  return this.http.get<any[]>(`${apiSAltUrl}projet/${projetAhpId}`);
}
updateAlternative(id: number, alternative: any): Observable<any> {
  const url = `${ALTERNATIVE_URL}update/${id}`; // Assurez-vous que votre API attend l'ID de l'alternative
  return this.http.put(url, alternative);
}
updateAlternativeRank(id: number, alternative: any): Observable<any> {
  const url =` ${ALTERNATIVE_URL}updateRank/${id}`; // Assurez-vous que votre API attend l'ID de l'alternative
  return this.http.put(url, alternative);
}

getAlternativeByName(alternativeName: string): Observable<any> {
  return this.http.get(`${ALTERNATIVE_URL}getByName/${alternativeName}`);
}

getAlternativesByProjectId(projectId: number) {
  return this.http.get<any[]>(`https://ample-beauty-production.up.railway.app/getByProjectId/${projectId}`);
}
updateCRValueForProjet(projetAhpId: number, crValue: number): Observable<any> {
  return this.http.put(`${CRITERS_URL}/${projetAhpId}/updateCR`, { cr: crValue });
}

getLatestProjectId(): Observable<number> {
  return this.http.get<number>('https://ample-beauty-production.up.railway.app/projets/latestProjectId');
}
updateCRValueForSousCriterByCriterId(criterId: number, crValue: number): Observable<any> {
  return this.http.post(`${SOUS_CRITERS_URL}/saveCRForCriter/${criterId}/${crValue}`, {});
}
updateRelCriterer(criter1Id: number, criter2Id: number, newValue: number) {
  const url =` ${RELATION_CRITERS_URL}update/${criter1Id}/${criter2Id}`; 
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put(url, newValue, { headers });
}
updateRelCritererSCR(souscriter1: number, souscriter2: number, newValue: number) {
  const url = `${apiSUrl}update/${souscriter1}/${souscriter2}`; 
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put(url, newValue, { headers });
}
update(criterId: number, criter: any): Observable<any> {
  const url = `${CRITERS_URL}update/${criterId}`;
  return this.http.put(url, criter);
}
updateCriterWeightsInDatabase(criterId: number, newWeight: number): Observable<any> {
  const url = `${apiUrl}updateWeight/${criterId}`;
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put(url, newWeight, { headers: headers });
}
refreshCritersData(): Observable<any> {
  return this.http.get<any>(`${this.CRITERS_URL}/all`);
}
updateRelCritererSCRAlt(souscriter: number, alternative: number, newValue: number) {
  const url = `${apiSAltUrl}update/${souscriter}/${alternative}`; 
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put(url, newValue, { headers });
}
updateSubcriterWeightsInDatabase(souscriterId: number, newWeight: number): Observable<any> {
  const url = `${SOUS_CRITERS_URL}updateWeight/${souscriterId}`;
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put(url, newWeight, { headers: headers });
}
updateSubcriterCRInDatabase(souscriterId: number, newCr: number): Observable<any> {
  const url = `${SOUS_CRITERS_URL}updateCr/${souscriterId}`;
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.put(url, newCr, { headers: headers });
}


getExpertUsernameByEmail(email: string): Observable<string> {
  const EXPERT_USERNAME_URL = `https://ample-beauty-production.up.railway.app/experts/expert/username/${email}`;
  return this.http.get(EXPERT_USERNAME_URL, { responseType: 'text' });
}

sendEmail(emails: string[], subject: string, message: string) {
  // Définir l'URL pour l'envoi d'e-mail dans votre backend Spring
  const EMAIL_URL = 'https://ample-beauty-production.up.railway.app/criters/send-email';

  // Créer l'objet de demande pour l'envoi d'e-mail
  const requestBody = {
    emails: emails,
    subject: subject,
    message: message
  };

  // Envoyer une demande POST pour l'envoi d'e-mail
  return this.http.post(EMAIL_URL, requestBody);
}
}