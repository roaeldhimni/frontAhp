import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProjetService } from '../services/projetahp.service';

@Component({
  selector: 'app-expert',
  templateUrl: './expert.component.html',
  styleUrls: ['./expert.component.css']
})export class ExpertComponent implements OnInit {
  expertSession: any;
  alternatives: any[]; // Déclaration de la propriété alternatives
  sousCriters: any[]; // Déclaration de la propriété sousCriters
  criteres: any[]; // Déclaration de la propriété sousCriters
  envoiReussi: boolean = false;
  index: number = 0;

  constructor(private userService: UserService,
    private ahpService: ProjetService,

  ) { 
    this.altfact = [
      [1, 1, 3],
      [1, 3, 5],
      [3, 5, 7],
      [5, 7, 9],
      [7, 9, 9]
    ];
  }

  ngOnInit(): void {
    this.expertSession = JSON.parse(sessionStorage.getItem("EXPERT"));
    if (this.expertSession && this.expertSession.projetId) {
      this.userService.getAlternativesByProjectId(this.expertSession.projetId).subscribe((data: any) => {
        console.log("Alternatives et Sous Criter:", data);
        this.alternatives = data.alternatives; // Définir les alternatives
        this.sousCriters = data.sousCriters; // Définir les sous-critères
        
        // Initialisation de facteuralternative
        this.facteuralternative = {};
        this.sousCriters.forEach(sousCriter => {
          this.facteuralternative[sousCriter.id] = {};
          this.alternatives.forEach(alternative => {
            this.facteuralternative[sousCriter.id][alternative.id] = null; // Initialisation à null ou une valeur par défaut selon le besoin
          });
        });
  
        // Utilisez les données pour afficher les alternatives dans votre template HTML
      });
    }
  }
  
  
  altfact: number[][];
  facteuralternative: any = {};

  xx(deviceValue: any, i: number, ii: number, j: number) {
    console.log(deviceValue.value);
    this.facteuralternative[i][ii][j] = deviceValue.value;
    console.log('DHIMNIIIIIIIIII :',this.facteuralternative[i][ii][j]);
  }


  saveSousCriterAlternative() {
    console.log("ROOOOOOOOOOOOOOOOOOOOOOOOOOOOOAAAAAAAAAA");
    for (let sousCriterId in this.facteuralternative) {
      for (let alternativeId in this.facteuralternative[sousCriterId]) {
        const facteurValues = this.facteuralternative[sousCriterId][alternativeId].split(',').map(Number);
  
        // Enregistrer la relation entre le sous-critère et l'alternative dans la base de données
        const relationSCriterAlt = {
          sousCriter: { id: sousCriterId },
          alternative: { id: alternativeId },
          facteur: {
            lowerBound: facteurValues[0],
            midlbound: facteurValues[1],
            upperBound: facteurValues[2]
          }
        };
  
        console.log("relationSCriterAlt", relationSCriterAlt);
        
        // Utilisez une fonction de sauvegarde pour chaque objet relationSCriterAlt
        this.ahpService.saveSfahpExpert(relationSCriterAlt).subscribe(
          response => {
            console.log('Successfully saved relationSCriter:', response);

          },
          error => {
            console.error('Failed to save relationSCriter:', error);
          }
        );
      }
    }

  }
showFinalStep(){
  this.envoiReussi=true;
  this.openNext();
}
  
openNext() {
  this.index = (this.index === 14) ? 0 : this.index + 1;
}
  
}


