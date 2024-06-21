import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { ProjetService } from '../services/projetahp.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
 

  constructor( private ahpService:ProjetService,
    private userService:UserService) { }

  ngOnInit(): void {

    this.getprojects();

    
  }
  criterFacteurs: any[] = [];
sousCriteres: any[] = []; // Initialisez sousCriteres comme un tableau vide
relationMatrixSousCriteres: any[][] = [];

cities: Number[] = [
  1, 3, 5, 7, 9, 0.333333 , 0.2,0.142857 , 0.111111
];
etap1PoidsSCR:any={};
etap2PoidsSCR:any={};
etap3PoidsSCR:any={};
  action:boolean=false
  etap2:boolean=false
  showCriteriaMatrixContent:boolean=false
  index: number = 0;
  projetAhp:any={}
  projetcurrent:any={}
  //criters:any={}
  criters: any[] = []; // Initialisez criters comme un tableau vide

  numberCriters:any 
  modificationCriters:boolean=false
  sousCriters:any={}
  n:number[] = []
  alternativesAndRanks: any[] = [];
  showStep5Content: boolean = false;
  etap3:boolean=false 
  showmodification : boolean[]= []
  showmodificationsub : any={}

  factors: any[] = [];
  currentIndex: number = 0;
  citiesAlter: Number[] = [
    1,2,3,4,5,6,7,8,9,10
  ];
  updateRelationSCRAlt(souscriter: number, alternative: number, newValue: number){
    this.ahpService.updateRelCritererSCRAlt(souscriter, alternative, newValue).subscribe(data => {
      // Gérer la réponse du service si nécessaire
      console.log('Relation mise à jour avec succès', data);
  }, error => {
      // Gérer les erreurs si la mise à jour échoue
      console.error('Erreur lors de la mise à jour de la relation', error);
  });
  
  }
  updateSCRAlt(i: number, j: number, newValue: number) {
    const souscriter = this.sousCriteres[i];
    const alternative = this.alternatives[j];
    console.log(souscriter);
    console.log(alternative);
    console.log(newValue);
    this.updateRelationSCRAlt(souscriter.id, alternative.id, newValue);
    
  }
  // Déclarez ces variables dans votre composant TypeScript
  openNextt() {
    // Vérifiez s'il y a encore des matrices à afficher
    if (this.currentIndex < this.criters.length - 1) {
      // Incrémentez l'index pour passer au prochain critère
      this.currentIndex++;
    }
  }
  
  openPrevv() {
    // Décrémentez l'index pour afficher le critère précédent
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  

  openNext() {
    this.index = (this.index === 8) ? 0 : this.index + 1;
}

openPrev() {
    this.index = (this.index === 0) ? 8 : this.index - 1;
}

  arrayOne(n: number): any[] {
    return Array(n);
 }
 updateInverse(i: number, j: number, newValue: number): number {
  const inverseJ = this.criters.findIndex(c => c.id === this.criters[i].id);
  let inverseValue;

  // Correspondances statiques entre les nombres sélectionnés et leurs inverses
  const inverseMap: { [key: number]: number } = {
    1: 1,
    3: 0.333333,
    5: 0.2,
    7: 0.142857,
    9: 0.111111,
    0.333333: 3,
    0.2: 5,
    0.142857: 7,
    0.111111: 9
  };

  inverseValue = inverseMap[newValue];
  this.relationMatrix[j][inverseJ] = inverseValue;
  return inverseValue;
}
updateRelation(criter1Id: number, criter2Id: number, newValue: number) {
  this.ahpService.updateRelCriterer(criter1Id, criter2Id, newValue).subscribe(data => {
    // Gérer la réponse du service si nécessaire
    console.log('Relation mise à jour avec succès', data);
}, error => {
    // Gérer les erreurs si la mise à jour échoue
    console.error('Erreur lors de la mise à jour de la relation',error);
});

}update(i: number, j: number, newValue: number) {
  const criter1 = this.criters[i];
  const criter2 = this.criters[j];
  console.log(criter1);
  console.log(criter2);
  console.log(newValue);
  this.updateRelation(criter1.id, criter2.id, newValue);
  const inverseValue = this.updateInverse(i, j, newValue); // Calcul de l'inverse
  this.updateRelation(criter2.id, criter1.id, inverseValue); 
 // Envoi de l'inverse au backend
}
 
 // Ajoutez une propriété pour stocker la matrice des relations critères-facteurs
relationMatrix: any[][] = [];

 getprojects(){
   this.userService.getUserProjcts().subscribe(data =>{
    this.projetAhp=data
    console.log(this.projetAhp)

  })
 }
 updateInverseSCR(i: number, row: number, col: number, newValue: number):number {
  const inverseMap: { [key: number]: number } = {
    1: 1,
    3: 0.333333,
    5: 0.2,
    7: 0.142857,
    9: 0.111111,
    0.333333: 3,
    0.2: 5,
    0.142857: 7,
    0.111111: 9
  };

  const inverseValue = inverseMap[newValue];

  // Mettre à jour la valeur principale dans la matrice
  this.sousCriteresMatrix[i][row][col] = newValue;

  // Trouver l'indice de l'inverse
  
  // Mettre à jour la valeur inverse dans la matrice
  this.sousCriteresMatrix[i][col][row] = inverseValue;
console.log(newValue);
console.log(inverseValue);
return inverseValue;
  
}
updateSCR(i: number, rowIndex: number,colIndex:number, newValue: number) {
  console.log(i);
  console.log(rowIndex);
  console.log(colIndex);
  console.log(newValue);
  const souscriter1 = this.sousCriters[i][rowIndex];
  
  const souscriter2 = this.sousCriters[i][colIndex];
  console.log(souscriter1);
  console.log(souscriter2);
  console.log(newValue);
  this.updateRelationSCR(souscriter1.id, souscriter2.id, newValue);
  const inverseValue = this.updateInverseSCR(i,rowIndex,colIndex, newValue); // Calcul de l'inverse
  this.updateRelationSCR(souscriter2.id, souscriter1.id, inverseValue);
   // Envoi de l'inverse au backend
  this.showMatriceSous(i);
}
updateRelationSCR(souscriter1: number, souscriter2: number, newValue: number){
  this.ahpService.updateRelCritererSCR(souscriter1, souscriter2, newValue).subscribe(data => {
    // Gérer la réponse du service si nécessaire
    console.log('Relation mise à jour avec succès', data);
}, error => {
    // Gérer les erreurs si la mise à jour échoue
    console.error('Erreur lors de la mise à jour de la relation', error);
});

}
 async getprojectdetails(p: any) {
  this.projetcurrent = p;
  this.numberCriters = p.numbreCriters;
  console.log(p);
  console.log(this.numberCriters);

  // Appel à votre service pour récupérer les relations critère-facteur pour le projet actuel
  this.ahpService.getRelationCriterFactorsByProjetId(p.id).subscribe(data => {
    this.criterFacteurs = data;
    console.log("Relations critère-facteur pour le projet actuel : ", this.criterFacteurs);

    // Appel à votre service pour récupérer les détails du projet
    this.ahpService.getprojet(p.id).subscribe((projData: any[]) => {
      this.criters = projData;
      console.log(projData);

      // Maintenant que nous avons toutes les données nécessaires, créons la matrice des relations critères-facteurs
      this.createRelationMatrix();

      // Appel à votre service pour récupérer les relations de sous-critères pour le projet actuel
      this.ahpService.getRelationSousCriteresByProjetAhpId(p.id).subscribe(sousCriteresData => {
        // Assurez-vous d'associer correctement les relations aux sous-critères
        this.sousCriters = sousCriteresData;
        console.log("Relations de sous-critères pour le projet actuel : ", this.sousCriters);

        // Remplir la matrice des sous-critères avec les facteurs correspondants
        this.fillSousCriteresMatrix();

        this.etap2 = true;
        this.openNext();
      });



    });
  });

  for (let j = 0; j < this.numberCriters; j++) {
    this.sousCriters[j] = {};
    this.showmodification[j] = false;
    this.showCriteriaMatrixContent = true;
    this.showmodificationsub[j] = {};
  }

  console.log(this.showmodification);
}

// Fonction pour créer et remplir la matrice des relations critères-facteurs
createRelationMatrix() {
  // Vérifiez que les données nécessaires sont disponibles
  if (this.criters.length > 0 && this.criterFacteurs.length > 0) {
    // Initialisation de la matrice avec des valeurs vides
    this.relationMatrix = Array(this.numberCriters).fill([]).map(() => Array(this.numberCriters).fill(''));

    // Remplissage de la matrice avec les facteurs correspondants
    this.criterFacteurs.forEach(relation => {
      const critere1Index = this.criters.findIndex(critere => critere.id === relation.criter1.id);
      const critere2Index = this.criters.findIndex(critere => critere.id === relation.criter2.id);
      this.relationMatrix[critere1Index][critere2Index] = relation.facteur;
      //this.relationMatrix[critere2Index][critere1Index] = relation.facteur; // Pour la symétrie
    });

    console.log(this.relationMatrix);
  } else {
    console.error("Les données nécessaires pour créer la matrice des relations critères-facteurs ne sont pas disponibles.");
  }
}
sousCriteresMatrix: any[][] = []; // Déclaration de la matrice des sous-critères
// Ajoutez une propriété pour stocker les noms uniques des sous-critères du premier critère
uniqueSousCriteres: string[] = [];
fillSousCriteresMatrix() {
  if (this.sousCriters.length > 0 && this.criters.length > 0) {
    this.sousCriteresMatrix = [];

    this.criters.forEach(critere => {
      const relationsCritere = this.sousCriters.filter(sousCritere => sousCritere.sousCriter1.criter.id === critere.id || sousCritere.sousCriter2.criter.id === critere.id);
      const uniqueSousCriteresSet = new Set<string>();

      relationsCritere.forEach(relation => {
        uniqueSousCriteresSet.add(relation.sousCriter1.name);
        uniqueSousCriteresSet.add(relation.sousCriter2.name);
      });

      const uniqueSousCriteres = Array.from(uniqueSousCriteresSet);

      const sousCriteresMatrixCritere = Array(uniqueSousCriteres.length).fill(null).map(() => Array(uniqueSousCriteres.length).fill(null));

      relationsCritere.forEach(relation => {
        const sousCriter1Index = uniqueSousCriteres.indexOf(relation.sousCriter1.name);
        const sousCriter2Index = uniqueSousCriteres.indexOf(relation.sousCriter2.name);

        // Modification ici
        let facteur = relation.facteur;
        if (Number.isInteger(facteur)) {
          facteur = Math.floor(facteur); // Si le facteur est un entier, le laisser tel quel
        } else {
          facteur = parseFloat(facteur.toFixed(6)); // Si le facteur est un float, le formater avec 6 chiffres après la virgule
        }

        sousCriteresMatrixCritere[sousCriter1Index][sousCriter2Index] = facteur;
        
      });

      this.sousCriteresMatrix.push(sousCriteresMatrixCritere);
      console.log("hadi", this.sousCriteresMatrix);
      this.uniqueSousCriteres = uniqueSousCriteres;
    });

    console.log(this.sousCriteresMatrix);
  } else {
    console.error("Les données nécessaires pour créer la matrice des relations sous-critères ne sont pas disponibles.");
  }
  console.log("souscritmatde0", this.sousCriteresMatrix[0]);
}

////////////////////////

relationMatrixAlternativesSousCriteres: any[] = [];
alternatives: any[] = [];

getSousCritereAlternativeFactor(sousCritereId: number, alternativeId: number): number {
  const relation = this.relationMatrixAlternativesSousCriteres.find(rel => rel.sousCriter.id === sousCritereId && rel.alternative.id === alternativeId);
  return relation ? relation.facteur : 0; // Si la relation existe, retourner le facteur, sinon retourner 0
}


passerEtape4(critere: any) {
  // Appel à votre service pour récupérer les relations sous-critères-alternatives pour le projet actuel
  this.ahpService.getRelationAlternativesSousCriteres(this.projetcurrent.id).subscribe(data => {
    console.log("Données récupérées pour les relations sous-critères-alternatives :", data); // Vérifiez les données récupérées
    this.relationMatrixAlternativesSousCriteres = data;
    console.log("Relations sous-critères-alternatives pour le projet actuel : ", this.relationMatrixAlternativesSousCriteres);
    
    // Récupérez la liste des alternatives uniques
    this.alternatives = this.relationMatrixAlternativesSousCriteres
      .map(rel => rel.alternative)
      .filter((alternative, index, self) =>
        index === self.findIndex(a => a.id === alternative.id)
      );
    console.log("Alternatives récupérées :", this.alternatives); // Vérifiez les alternatives récupérées


 // Récupérez la liste des sous-critères uniques
 this.sousCriteres = this.relationMatrixAlternativesSousCriteres
 .map(rel => rel.sousCriter)
 .filter((sousCriter, index, self) =>
   index === self.findIndex(sc => sc.id === sousCriter.id)
 );
console.log("Sous-critères récupérés :", this.sousCriteres); // Vérifiez les sous-critères récupérés



    // Maintenant, remplissez la matrice des sous-critères avec les facteurs correspondants pour chaque alternative
    this.fillSousCriteresAlternativesMatrix();

    this.showCriteriaMatrixContent = true;
    this.openNext(); // Passer à l'étape suivante
  });
}

goToEtape5() {
  this.openNext();
  this.ahpService.getAlternativesByProjectId(this.projetcurrent.id) // Remplacez 1 par l'ID de votre projet
    .subscribe(
      alternatives => {
        this.alternatives = alternatives;
      },
      error => {
        console.error('Erreur lors de la récupération des alternatives:', error);
      }
    );
}
relationMatrixSousCriteresAlternatives: any[][] = [];

fillSousCriteresAlternativesMatrix() {
  console.log("entree a la fct fill");
  console.log("Sous-critères:", this.sousCriteres);
  console.log("Alternatives:", this.alternatives);
  // Assurez-vous que les données nécessaires sont disponibles
  if (this.sousCriteres.length > 0 && this.alternatives.length > 0) {
    // Initialiser la matrice avec des valeurs vides
    this.relationMatrixSousCriteresAlternatives = Array(this.sousCriteres.length).fill([]).map(() => Array(this.alternatives.length).fill(''));

    // Remplir la matrice avec les facteurs correspondants pour chaque sous-critère et chaque alternative
    this.sousCriteres.forEach((sousCritere, i) => {
      this.alternatives.forEach((alternative, j) => {
        const relation = this.relationMatrixAlternativesSousCriteres.find(rel => rel.sousCriter.id === sousCritere.id && rel.alternative.id === alternative.id);
        if (relation) {
          this.relationMatrixSousCriteresAlternatives[i][j] = relation.facteur;
        } else {
          this.relationMatrixSousCriteresAlternatives[i][j] = 0; // Si la relation n'existe pas, mettre le facteur à 0
        }
      });
    });

    console.log(this.relationMatrixSousCriteresAlternatives);
  } else {
    console.error("Les données nécessaires pour créer la matrice des relations sous-critères-alternatives ne sont pas disponibles.");
  }
}





///////////////////
 modif(j:any){
  this.showmodification[j]=true ;
  console.log(this.showmodification);
  
}

edit(form:any , j : any){
  this.ahpService.addCriters(form).subscribe(data =>{
    this.criters[j]=data   
    console.log(this.criters[j])
    this.showmodification[j]=false
 })
}

 getsousCriters(){

  
  for(let i =0 ; i<this.numberCriters ; i++){
    this.n[i]=this.criters[i].numbresousCriters
    this.ahpService.getsousCriters(this.criters[i].id).subscribe(data =>{
      this.sousCriters[i]=data 
      })

      for(let j =0 ; j<this.n[i] ; j++){
        this.showmodificationsub[i][j]=false
      }
  }

  console.log("sous crit",this.sousCriters)
  console.log(this.n);
  this.etap3=true
  this.openNext()
    
}

editsub(form:any , i:any , j:any){
  this.ahpService.addSousCriters(form).subscribe(data=>{
    this.sousCriters[i][j]=data ;
    this.showmodificationsub[i][j]=true
  })

}
modifsub(i:any,j:any){
this.showmodificationsub[i][j]=false
}CalculPoidCR(){
  const n = this.numberCriters;
  const tempRelationMatrix = []; // Matrice temporaire pour les calculs

  // Copie de la matrice relationMatrix dans tempRelationMatrix
  for (let i = 0; i < n; i++) {
    tempRelationMatrix.push([...this.relationMatrix[i]]);
  }
  for(let j=0;j<this.numberCriters;j++){
    this.etap2PoidsSCR[j]={}
  }
  for(let jj=0;jj<this.numberCriters;jj++){
    for(let j=0;j<this.numberCriters;j++){
         if(j==jj){
           tempRelationMatrix[j][j]=1
           this.etap2PoidsSCR[j][j]=1
         }else{
          tempRelationMatrix[j][jj]=1/tempRelationMatrix[jj][j]
          
          this.etap2PoidsSCR[j][jj]=1/tempRelationMatrix[jj][j]
         // this.facteur[j][jj]=this.facteur[j][jj].toFixed(3)
         // this.facteur[jj][j]=this.facteur[jj][j].toFixed(3)
}
     }
  }

  

  for(let jj=0;jj<this.numberCriters;jj++){
    this.etap1PoidsSCR[jj]=0 ;
    for(let j=0;j<this.numberCriters;j++){
      this.etap1PoidsSCR[jj]=this.etap1PoidsSCR[jj]+tempRelationMatrix[j][jj];//somme des facteurs 
    }
  }
  console.log("---------etape 1-MATRICE---- ");
  console.log(this.etap1PoidsSCR);

  for(let jj=0;jj<this.numberCriters;jj++){
    for(let j=0;j<this.numberCriters;j++){
      this.etap2PoidsSCR[j][jj]=this.etap2PoidsSCR[j][jj]/this.etap1PoidsSCR[jj];//division par la somme
    }
  }

  console.log("---------etape 2--MATRICE----- ");
  console.log(this.etap2PoidsSCR);

  for(let jj=0;jj<this.numberCriters;jj++){
    this.etap3PoidsSCR[jj]=0 ;
    for(let j=0;j<this.numberCriters;j++){
      this.etap3PoidsSCR[jj]=this.etap3PoidsSCR[jj]+this.etap2PoidsSCR[jj][j];
    }
    this.etap3PoidsSCR[jj]=this.etap3PoidsSCR[jj]/this.numberCriters
    this.etap3PoidsSCR[jj]=this.etap3PoidsSCR[jj].toFixed(3)//CALCUL DU POIDS DES CRITERS 
  }

console.log("---------etape 3-----LES POIDS DES CRIERES ");
console.log(this.etap3PoidsSCR);


this.criters.forEach((critere, index) => {
  const criterId = critere.id;
  const newWeight = this.etap3PoidsSCR[index]; // Nouveau poids du critère à l'index correspondant
  this.ahpService.updateCriterWeightsInDatabase(criterId, newWeight).subscribe(response => {
    this.criters[index].poids = newWeight;

  });
});
return this.etap3PoidsSCR;
}

landa:number=0;
IC:number=0;
CR:number=0;

etap1CR:any={}
etap2CR:any={}
nouveauCR: number;
showNouveauCR: boolean = false;

IA:number[]=[0,0,0.58,0.9,1.12,1.24,1.32,1.41,1.45,1.49];
valIa:number=0;
calculCR(): number {
  // Calcul des poids des critères à l'aide de la fonction CalculPoidCR()
  this.etap3PoidsSCR = this.CalculPoidCR();

  console.log("Poids des critères :", this.etap3PoidsSCR);

  // Affichage de la matrice de relation
  console.log("Matrice de relation :", this.relationMatrix);

  // Initialisation de la variable landa
  this.landa = 0;

  // Calcul de la somme des produits des éléments de chaque ligne de la matrice de relation avec les poids des critères
  for (let i = 0; i < this.numberCriters; i++) {
    this.etap1CR[i] = 0;
    for (let jj = 0; jj < this.numberCriters; jj++) {
      this.etap1CR[i] += this.relationMatrix[i][jj] * this.etap3PoidsSCR[jj];
    }
  }

  console.log("Produits des éléments de chaque ligne :", this.etap1CR);

  // Calcul de la somme des ratios entre les produits des éléments de chaque ligne et les poids des critères
  for (let i = 0; i < this.numberCriters; i++) {
    this.etap2CR[i] = this.etap1CR[i] / this.etap3PoidsSCR[i];
    this.landa += this.etap2CR[i];
  }

  // Calcul de la moyenne des ratios landa
  this.landa /= this.numberCriters;

  console.log("Landa :", this.landa);

  // Calcul de l'indice de cohérence (IC)
  this.IC = (this.landa - this.numberCriters) / (this.numberCriters - 1);
  this.IC = parseFloat(this.IC.toFixed(14)); // Arrondir à 10 décimales
  
  console.log("IC :", this.IC);

  // Récupération de la valeur IA correspondant au nombre de critères
  this.valIa = this.IA[this.numberCriters + 1];

  console.log("IA :", this.valIa);
// Calcul du CR
this.CR = this.IC / this.valIa;
const tolerance = 0.000001; // Tolérance pour considérer une valeur comme égale à zéro
if (Math.abs(this.CR) <= tolerance) {
    this.CR = 0;
} else {
    // Formatage de la valeur si elle est très petite mais non nulle
    if (Math.abs(this.CR) < 1e-6) {
        this.CR = parseFloat(this.CR.toFixed(10)); // Limite le nombre de décimales après la virgule
    }
}

console.log("CR :", this.CR);


  // Récupération de l'ID du projet à partir de projetcurrent
  const projetId = this.projetcurrent.id;

  // Mise à jour du CR dans la base de données
  this.ahpService.updateCRValueForProjet(projetId, this.CR).subscribe(
    response => {
      console.log('La valeur de CR a été mise à jour avec succès dans la base de données.');
      // Autres actions après la mise à jour...
    },
    error => {
      console.error('Une erreur s\'est produite lors de la mise à jour de la valeur de CR : ', error);
    }
  );

  // Affichage du nouveau CR
  this.nouveauCR = this.CR;
  this.showNouveauCR = true;

  // Retourne la valeur du CR calculée
  return this.CR;
}

////////////////:: calculer poids pour sous criters 




etap1Poids:any = {};
leveltwo: any = {};
nouveauSubCR: number;
showNouveauSubCR:  boolean[]= [];
etap1subCR:any ={}
etap2subCR:any ={}
landasub:any = {}
ICsub:number[]= []
CRsub :number[]= []
valIAsub : number[]= []
etap2Poids:any={};
  etap3Poids:any={};
showModifiedWeights:  boolean[]= [];
calculsubCR() {
  for (let j = 0; j < this.numberCriters; j++) {
      console.log("Calculating weights for sub-criteria matrix " + j);
      console.log("Sub-criteria matrix: ");
      console.log(this.sousCriteresMatrix[j]);


      // Initialize etap1subCR for storing intermediate results
      this.etap1subCR[j]={}
      this.etap2subCR[j] = {};
      var etap3PoidsN=this.etap3Poids[j][0];
      console.log("etap3utilisée",etap3PoidsN)

      // Loop through each row in the sub-criteria matrix
      for (let i = 0; i < this.sousCriters[j].length; i++) {
          this.etap1subCR[j][i] = 0;
          // Compute the sum of products of each element in the row with corresponding weights
          for (let jj = 0; jj < this.sousCriters[j].length; jj++) {

            
            this.etap1subCR[j][i] += this.sousCriteresMatrix[j][i][jj] * etap3PoidsN[jj];
          }
      }

      console.log("Intermediate results: ");
      console.log(this.etap1subCR);

      // Compute the sum of each row divided by its corresponding weight
      this.landasub[j] = 0;
      for (let i = 0; i < this.sousCriters[j].length; i++) {
          this.etap2subCR[j][i] = this.etap1subCR[j][i] / etap3PoidsN[i];
          this.landasub[j] += this.etap2subCR[j][i];
      }

      console.log("Intermediate division results: ");
      console.log(this.etap2subCR);

      // Compute the average of the sum
      this.landasub[j] /= this.sousCriters[j].length;
      console.log("Average: ");
      console.log(this.landasub);

      // Compute inconsistency index (IC)
      this.ICsub[j] = (this.landasub[j] - this.sousCriters[j].length) / (this.sousCriters[j].length - 1);
      console.log("Inconsistency Index: ");
      console.log(this.ICsub);

      // Get the value from the inconsistency index array
      this.valIAsub[j] = this.IA[this.sousCriters[j].length + 1];
      console.log("Inconsistency Value: ");
      console.log(this.valIAsub);

      // Compute Consistency Ratio (CR)
      this.CRsub[j] = this.ICsub[j] / this.valIAsub[j];
      console.log("Consistency Ratio (CR): " + this.CRsub[j]);
      const tolerance = 0.000001; // Tolérance pour considérer une valeur comme égale à zéro
if (Math.abs(this.CRsub[j]) <= tolerance) {
    this.CRsub[j] = 0;
} else {
    // Formatage de la valeur si elle est très petite mais non nulle
    if (Math.abs(this.CRsub[j]) < 1e-6) {
        this.CRsub[j] = parseFloat(this.CRsub[j].toFixed(10)); // Limite le nombre de décimales après la virgule
    }
}
    

      this.sousCriters[j].forEach((sousCritere, index) => {
        const sousCritereId = sousCritere.id; // Supposons que chaque sous-critère a un identifiant unique
        const newCr = this.CRsub[j]; // Nouveau poids du sous-critère à l'index correspondant
        this.ahpService.updateSubcriterCRInDatabase(sousCritereId, newCr).subscribe(response => {
          this.sousCriters[j][index].cr = newCr;
        });
      });
      this.nouveauSubCR = this.CRsub[j];
      this.showNouveauSubCR[j] = true;
  }
}

showMatriceSous(i: number) {
  // Réinitialisation des tableaux de poids
  this.etap1Poids[i] = Array(this.sousCriters[i].length).fill(0);
  this.etap2Poids[i] = [];
  this.etap3Poids[i] = [];
  this.leveltwo[i] = [];
  this.showModifiedWeights[i] = true;
  // Copie de la matrice des sous-critères dans une matrice temporaire
  const tempRelationMatrix = JSON.parse(JSON.stringify(this.sousCriteresMatrix[i]));

  // Calcul des poids
  for (let j = 0; j < this.sousCriters[i].length; j++) {
    let etap2PoidsRow = {};
    let etap3PoidsRow = [];
    let leveltwoRow = [];

    for (let jj = 0; jj < this.sousCriters[i].length; jj++) {
      if (j === jj) {
        etap2PoidsRow[j] = 1;
      } else {
        tempRelationMatrix[j][jj] = 1 / tempRelationMatrix[jj][j];
        etap2PoidsRow[jj] = 1 / tempRelationMatrix[jj][j];
      }
    }

    this.etap2Poids[i].push(etap2PoidsRow);
  }

  // Étape 1
  for (let j = 0; j < this.sousCriters[i].length; j++) {
    for (let jj = 0; jj < this.sousCriters[i].length; jj++) {
      this.etap1Poids[i][jj] += tempRelationMatrix[j][jj];
    }
  }

  // Étape 2
  for (let j = 0; j < this.sousCriters[i].length; j++) {
    for (let jj = 0; jj < this.sousCriters[i].length; jj++) {
      this.etap2Poids[i][j][jj] /= this.etap1Poids[i][jj];
    }
  }

  // Étape 3
  for (let j = 0; j < this.sousCriters[i].length; j++) {
    let etap3PoidsRow = [];
    let leveltwoRow = [];

    for (let jj = 0; jj < this.sousCriters[i].length; jj++) {
      let sum = 0;
      for (let k = 0; k < this.sousCriters[i].length; k++) {
        sum += this.etap2Poids[i][jj][k];
      }
      let value = sum / this.sousCriters[i].length;
      etap3PoidsRow.push(value.toFixed(3));
      leveltwoRow.push((value * this.etap3PoidsSCR[i]).toFixed(3));
    }
    this.etap3Poids[i].push(etap3PoidsRow);
    this.leveltwo[i].push(leveltwoRow);
  }
  console.log("poids des ss criteres",this.etap3Poids[i][0]);
  // Mise à jour des poids des sous-critères dans la base de données
  const newWeights = this.etap3Poids[i][0]; // Récupère les nouveaux poids pour les sous-critères
  const promises = this.sousCriters[i].map((sousCritere, index) => {
    const sousCritereId = sousCritere.id;
    const newWeight = newWeights[index]; // Utilise la nouvelle variable pour récupérer le poids
    return this.ahpService.updateSubcriterWeightsInDatabase(sousCritereId, newWeight).toPromise();
  });

  return Promise.all(promises);
}

}
