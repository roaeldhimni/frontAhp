import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { max } from 'moment';
import { TreeNode } from 'primeng/api';
import { ProjetService } from '../services/projetahp.service';
import { HttpParams } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-ahp',
  templateUrl: './ahp.component.html',
  styleUrls: ['./ahp.component.css']
})
export class AhpComponent implements OnInit {
  @ViewChild('mySvg') mySvg!: ElementRef<SVGElement>;
  ngAfterViewInit() {
    // Assurez-vous que mySvg est défini avant d'appeler drawRanksGraph
    if (this.mySvg) {
      this.drawRanksGraph();
    }
  }

  nom!: string;
  numbre!: number;
  numbreS!: number;
  numbreAlternative: number;

  showinputs: boolean = false;
  showmatrice: boolean = true;;
  showSousCriter: boolean = false;
  showarbre: boolean = false;
  showalterINputsAlternative: boolean = false;
  showtab7: boolean = false;
  showSousmatrice: boolean = false;
  showetapetapfinaltopsis: boolean = false;


  index: number = 0;
  a: number = 0;
  projetActuel: any;
  showNextButton: boolean = false;
  showPrevButton: boolean = false;
  showEtape12: boolean = true;

  // Fonction appelée lorsque vous cliquez sur "Show comparison matrix of Sub-Criteria"
  showComparisonMatrix() {
    this.showNextButton = true;
    this.showPrevButton = true;
  }
  projetahp: any = {};
  critersahp: any = {};
  souscritersahp: any = {};
  idproject: any;
  idcriters: {};
  radio: any = {};

  numbersS: number[] = [0, 0, 0];
  showSousCriters: boolean[] = [false, false];

  selectedValue: any;
  n: any = {};
  facteur: any = {};
  etap1Poids: any = {};
  etap1PoidsSCR: any = {};
  showCR: boolean = true; // Ajoutez cette variable pour gérer l'affichage du CR
  matrice: any = {};
  facteurSoucCriter: any = {};
  etap2Poids: any = {};
  etap3Poids: any = {};
  etap2PoidsSCR: any = {};
  etap3PoidsSCR: any = {};

  ranks: number[];

  topsisetap1: any = {};
  aplus: any = {};
  amoins: any = {};
  classement: any = {

  }

  dplus: any = {}
  dmoins: any = {}
  ci: number[] = []
  b: number = 0;

  form: any = {};
  formS: any = {};
  alternative: any = {};
  facteuralternative: any = {};
  facteur2alternative: any = {}

  formAlternative: any = {};
  formRelationCriter: any = {};

  leveltwo: any = {};

  currentCriterionIndex: number = 0;

  etap1CR: any = {}
  etap2CR: any = {}

  etap1subCR: any = {}
  etap2subCR: any = {}
  landasub: any = {}
  ICsub: number[] = []
  CRsub: number[] = []
  valIAsub: number[] = []

  landa: number = 0;
  IC: number = 0;
  CR: number = 0;

  tableauCriter: string[] = this.form;

  cities: Number[];
  altfact: Number[];

  IA: number[] = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  valIa: number = 0;

  constructor(
    private ahpService: ProjetService
  ) {
    for (let jj = 0; jj < 5; jj++) {
      this.classement[jj] = {
        ci: 0,
        claassment: 0,
      }
    }
    this.cities = [
      1, 3, 5, 7, 9, 1 / 3, 1 / 5, 1 / 7, 1 / 9
    ];
    this.altfact = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ]

  }

  data: TreeNode[] = [];

  ngOnInit() {
    if (this.showEtape12 && this.ranksParPermutation.length > 0) {
      this.drawRanksGraph();
    }

  }

  nodes: any = [
    {
      name: '',
      cssClass: 'ngx-org-ceo',

      title: ' ',
      childs: [

      ]

    }];
  updateInverseSous(rowIndex: number, colIndex: number, newValue: any, critereIndex: number) {
    // Mettre à jour la valeur de la matrice avec la nouvelle valeur sélectionnée
    this.facteurSoucCriter[critereIndex][rowIndex][colIndex] = newValue;

    // Mettre à jour la valeur inverse dans la matrice si nécessaire
    if (colIndex !== rowIndex) {
      const inverseValue = 1 / newValue;
      this.facteurSoucCriter[critereIndex][colIndex][rowIndex] = inverseValue;
    }
  }
  isNanOrUndefined(value: any): boolean {
    return isNaN(value) || typeof value === 'undefined';
  }
  getDisplayedWeight(weight: any): string {
    // Vérifiez si le poids est un objet
    if (typeof weight === 'object') {
      return ''; // Retournez une chaîne vide si c'est un objet
    } else {
      return weight.toString(); // Retournez la valeur du poids sous forme de chaîne sinon
    }
  }
  executeAllFunctions() {
    // Ajoutez des journaux pour vérifier les valeurs des facteurs avant l'enregistrement
    console.log('Facteurs avant l\'enregistrement :', this.facteurSoucCriter);

    // Appelez les fonctions dans l'ordre approprié
    this.addfacteurCriters();
    this.showMatriceSous();


    // Enregistrez les relations entre sous-critères
    this.saveRelationSCriter().then(() => {
      // Une fois que les relations sont enregistrées, vous pouvez calculer les poids
      this.calculsubCR();


      // Ensuite, vous pouvez mettre à jour les poids des sous-critères dans votre modèle
      this.setSCR();

      console.log('Après l\'enregistrement, facteurs soumis :', this.facteurSoucCriter);
    }).catch(error => {
      console.error('Error saving relations:', error);
    });
  }
  showstep11(levelTwo: any): void {
    this.showTable = true;
    this.openNext();
    this.generatePermutations(levelTwo); // Générer les permutations une seule fois
  }

  saveAndCalculateCR() {
    this.saveRelationCriter().then(() => {
      // Toutes les opérations de sauvegarde sont terminées, vous pouvez maintenant calculer le CR
      this.calculCR();
    }).catch(error => {
      console.error('Error saving relations:', error);
    });
  }
  showinfo() {
    console.log("Matrice Criters")
    console.log(this.facteur)
    this.arbre();
    console.log(this.matrice)

    this.showmatrice = true
    this.saveAndCalculateCR();

  }

  showInputs() {
    this.showinputs = true;
    for (let i = 0; i < this.numbre; i++) {
      this.critersahp[i] = {
        id: '',
        name: '',
        numbresousCriters: '',
        poids: 0,
        projetAhp: { id: ' ' }

      }

      this.souscritersahp[i] = {}
      this.formAlternative[i] = {}

      this.facteuralternative[i] = {}
      this.facteur2alternative[i] = {}
      this.aplus[i] = {}
      this.amoins[i] = {}

    }

  }
  showsousCrit(i: number) {
    console.log(this.numbersS)
    console.log(this.showSousCriters)
    this.showSousCriters[i] = true;
    this.formS[i] = {}
    this.etap1subCR[i] = {}
    this.etap2subCR[i] = {}
    this.facteurSoucCriter[i] = {}
    this.etap1Poids[i] = {}
    this.etap2Poids[i] = {}
    this.etap3Poids[i] = {}
    this.leveltwo[i] = {}



    this.etap2PoidsSCR[i] = {}
    this.alternative

  }

  showsous() {
    this.showSousCriter = true;

  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  showDATA() {
    this.tableauCriter = this.form;

    console.log(this.form)
    console.log("SOUS CRITERS")
    console.log(this.formS)
    console.log("Nombre de Sous Criters")
    console.log(this.n)
    console.log(this.tableauCriter + " ici ");

    this.nodes[0].name = this.nom;
    for (let j = 0; j < this.numbre; j++) {
      this.nodes[0].childs[j] = {
        name: ' ',
        cssClass: 'ngx-org-ceo',

        title: '',
        childs: []
      }
      this.nodes[0].childs[j].name = this.form[j];
      for (let jj = 0; jj < this.n[j]; jj++) {
        this.nodes[0].childs[j].childs[jj] = {
          name: ' ',
          cssClass: 'ngx-org-ceo',

          title: '',
          childs: []
        }
        this.nodes[0].childs[j].childs[jj].name = this.formS[j][jj]

        this.souscritersahp[j][jj] = {
          name: '',
          poids: 0,
          criter: { id: '' }

        }
        this.facteuralternative[j][jj] = {}
        this.facteur2alternative[j][jj] = {}


      }
      for (let j = 0; j < this.numbre; j++) {
        this.facteur[j] = {}
        this.matrice[j] = {}
        this.etap2PoidsSCR[j] = {}
        for (let jj = 0; jj < this.n[j]; jj++) {
          this.facteurSoucCriter[j][jj] = {}
          this.etap2Poids[j][jj] = {}

          this.etap3Poids[j][jj] = {}
          this.leveltwo[j][jj] = {}
        }
      }


    }

    this.showarbre = true;


  }

  updateInverse(rowIndex: number, colIndex: number, newValue: any) {
    // Mettre à jour la valeur de la matrice avec la nouvelle valeur sélectionnée
    this.facteur[rowIndex][colIndex] = newValue;

    // Mettre à jour la valeur en-dessous de la diagonale si nécessaire
    if (colIndex > rowIndex) {
      // Mettre à jour la valeur inverse dans la matrice
      const inverseValue = 1 / newValue;
      this.facteur[colIndex][rowIndex] = inverseValue;
    }
  }
  calculCR(): number {
    console.log("Matrice ! ! ");
    console.log(this.facteur);

    for (let i = 0; i < this.numbre; i++) {
      this.etap1CR[i] = 0;
      for (let jj = 0; jj < this.numbre; jj++) {
        this.etap1CR[i] += this.facteur[i][jj] * this.etap3PoidsSCR[jj];
      }
    }

    console.log("Multiplication donne ! ");
    console.log(this.etap1CR);

    this.landa = 0;
    for (let i = 0; i < this.numbre; i++) {
      this.etap2CR[i] = 0;
      this.etap2CR[i] = this.etap1CR[i] / this.etap3PoidsSCR[i];
      this.landa += this.etap2CR[i];
    }
    this.landa /= this.numbre;

    console.log("Landa ! ");
    console.log(this.landa);

    this.IC = (this.landa - this.numbre) / (this.numbre - 1);
    console.log("IC ! ");
    console.log(this.IC);

    console.log("IA ! ");
    this.valIa = this.IA[this.numbre + 1];
    console.log(this.valIa);

    console.log("CR! ");
    this.CR = this.IC / this.valIa;
    console.log(this.CR);

    // Retourne la valeur du CR calculée
    return this.CR;
  }


  envoyerCRVersBaseDeDonnees() {
    // Call the method to calculate CR
    const crValue = this.calculCR();

    // Call the service method to update CR value for the latest project ID
    this.ahpService.getLatestProjectId().subscribe(
      latestProjectId => {
        this.ahpService.updateCRValueForProjet(latestProjectId, crValue).subscribe(
          response => {
            console.log('Le CR a été envoyé avec succès à la base de données !');
          },
          error => {
            console.error('Une erreur s\'est produite lors de l\'envoi du CR à la base de données : ', error);
          }
        );
      },
      error => {
        console.error('Une erreur s\'est produite lors de la récupération de l\'ID du dernier projet : ', error);
      }
    );
  }



  calculsubCR() {
    for (let j = 0; j < this.numbre; j++) {
      console.log("Matrice sub ! ! " + j)
      console.log(this.facteurSoucCriter[j])
      for (let i = 0; i < this.n[j]; i++) {

        this.etap1subCR[j][i] = 0;
        for (let jj = 0; jj < this.n[j]; jj++) {
          this.etap1subCR[j][i] = this.etap1subCR[j][i] + this.facteurSoucCriter[j][i][jj] * this.etap3Poids[j][jj]
        }
      }
      console.log("Multiplication donne ! ")
      console.log(this.etap1subCR)
      this.landasub[j] = 0;
      for (let i = 0; i < this.n[j]; i++) {
        this.etap2subCR[j][i] = 0;
        this.etap2subCR[j][i] = this.etap1subCR[j][i] / this.etap3Poids[j][i]
      }
      console.log(this.etap2subCR);

      for (let i = 0; i < this.n[j]; i++) {
        this.landasub[j] = this.etap2subCR[j][i] + this.landasub[j]
      }


      this.landasub[j] = this.landasub[j] / this.n[j]
      console.log(this.landasub);


      this.ICsub[j] = (this.landasub[j] - this.n[j]) / (this.n[j] - 1)

      console.log(this.ICsub);


      this.valIAsub[j] = this.IA[this.n[j] + 1]
      console.log(this.valIAsub);

      this.CRsub[j] = this.ICsub[j] / this.valIAsub[j]
      console.log(this.CRsub[j] + "CR of sub : " + j);
      const criterId = this.critersahp[j].id
      console.log("crDKFD", criterId) /* Your code to get the criterId */
      const crValue = this.CRsub[j];
      console.log("fkfk", crValue) /* Your code to get the criterId */

      // Call the service function to store CR value for subcriteria
      this.ahpService.updateCRValueForSousCriterByCriterId(criterId, crValue).subscribe(
        response => {
          // Handle the response here if needed
          console.log('CR value for subcriteria stored successfully:', response);
        },
        error => {
          // Handle error here
          console.error('Error storing CR value for subcriteria:', error);
        }
      );
    }
  }

















  showMatriceSous() {
    console.log(this.facteurSoucCriter)
    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {
        for (let j = 0; j < this.n[i]; j++) {
          if (j == jj) {
            this.facteurSoucCriter[i][j][j] = 1
            this.etap2Poids[i][j][j] = 1
          } else {
            this.facteurSoucCriter[i][j][jj] = 1 / this.facteurSoucCriter[i][jj][j]
            this.etap2Poids[i][j][jj] = 1 / this.facteurSoucCriter[i][jj][j]
          }
        }
      }
    }

    console.log(" ---------Matrice Sous cirt----------")
    console.log(this.facteurSoucCriter)
    this.showSousmatrice = true;

    for (let i = 0; i < this.numbre; i++) {

      for (let jj = 0; jj < this.n[i]; jj++) {
        this.etap1Poids[i][jj] = 0;
        for (let j = 0; j < this.n[i]; j++) {
          this.etap1Poids[i][jj] = this.etap1Poids[i][jj] + this.facteurSoucCriter[i][j][jj];
        }
      }
    }
    console.log("---------etape 1----- ");
    console.log(this.etap1Poids);

    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {
        for (let j = 0; j < this.n[i]; j++) {
          this.etap2Poids[i][j][jj] = this.etap2Poids[i][j][jj] / this.etap1Poids[i][jj];
        }
      }
    }

    console.log("---------etape 2----- ");
    console.log(this.etap2Poids);

    for (let i = 0; i < this.numbre; i++) {

      for (let jj = 0; jj < this.n[i]; jj++) {
        this.etap3Poids[i][jj] = 0;
        for (let j = 0; j < this.n[i]; j++) {
          this.etap3Poids[i][jj] = this.etap3Poids[i][jj] + this.etap2Poids[i][jj][j];
        }
        this.etap3Poids[i][jj] = this.etap3Poids[i][jj] / this.n[i]
        this.etap3Poids[i][jj] = this.etap3Poids[i][jj].toFixed(3);
        this.leveltwo[i][jj] = this.etap3Poids[i][jj] * this.etap3PoidsSCR[i]
        this.leveltwo[i][jj] = this.leveltwo[i][jj].toFixed(3);

      }
    }
    console.log("---------etape 3----- ");
    console.log(this.etap3Poids);
    console.log("---------Level two ----- ");
    console.log(this.leveltwo);
  }



  arbre() {
    for (let jj = 0; jj < this.numbre; jj++) {
      for (let j = 0; j < this.numbre; j++) {
        if (j == jj) {
          this.facteur[j][j] = 1
          this.etap2PoidsSCR[j][j] = 1
        } else {
          this.facteur[j][jj] = 1 / this.facteur[jj][j]

          this.etap2PoidsSCR[j][jj] = 1 / this.facteur[jj][j]
          // this.facteur[j][jj]=this.facteur[j][jj].toFixed(3)
          // this.facteur[jj][j]=this.facteur[jj][j].toFixed(3)
        }
      }
    }



    for (let jj = 0; jj < this.numbre; jj++) {
      this.etap1PoidsSCR[jj] = 0;
      for (let j = 0; j < this.numbre; j++) {
        this.etap1PoidsSCR[jj] = this.etap1PoidsSCR[jj] + this.facteur[j][jj];
      }
    }
    console.log("---------etape 1-MATRICE---- ");
    console.log(this.etap1PoidsSCR);

    for (let jj = 0; jj < this.numbre; jj++) {
      for (let j = 0; j < this.numbre; j++) {
        this.etap2PoidsSCR[j][jj] = this.etap2PoidsSCR[j][jj] / this.etap1PoidsSCR[jj];
      }
    }

    console.log("---------etape 2--MATRICE----- ");
    console.log(this.etap2PoidsSCR);

    for (let jj = 0; jj < this.numbre; jj++) {
      this.etap3PoidsSCR[jj] = 0;
      for (let j = 0; j < this.numbre; j++) {
        this.etap3PoidsSCR[jj] = this.etap3PoidsSCR[jj] + this.etap2PoidsSCR[jj][j];
      }
      this.etap3PoidsSCR[jj] = this.etap3PoidsSCR[jj] / this.numbre
      this.etap3PoidsSCR[jj] = this.etap3PoidsSCR[jj].toFixed(3)
    }

    console.log("---------etape 3----- ");
    console.log("poids", this.etap3PoidsSCR);
  }
  setSCR() {
    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {
        this.souscritersahp[i][jj].poids = this.etap3Poids[i][jj];
        console.log(this.souscritersahp[i][jj].poids);

        // Appel du service pour mettre à jour le poids du sous-critère
        this.ahpService.updateSousCriter(this.souscritersahp[i][jj]).subscribe(
          data => {
            console.log('Sous-critère mis à jour avec succès :', data);
          },
          error => {
            console.error('Erreur lors de la mise à jour du sous-critère :');
          }
        );
      }
    }
  }
  // Méthode pour vérifier si la matrice actuelle est la dernière
  isLastMatrix(): boolean {
    return this.currentCriterionIndex === this.numbre - 1;
  }
  openNextt() {
    // Vérifiez s'il y a encore des critères à afficher
    if (this.currentCriterionIndex < this.numbre - 1) {
      // Incrémentez l'index du critère actuel pour passer au suivant
      this.currentCriterionIndex++;
    }
  }
  openPrevv() {
    // Décrémenter l'index pour afficher la matrice précédente
    this.currentCriterionIndex = (this.currentCriterionIndex === 0) ? 0 : this.currentCriterionIndex - 1;
  }
  openNext() {
    this.index = (this.index === 13) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 13 : this.index - 1;
  }

  change(deviceValue: any, i: number, ii: number) {

    console.log(deviceValue.value);

    this.facteur[i][ii] = deviceValue.value;



  }

  ///////////////////////////////////////////////////////////////////
  saveRelationCriter() {
    const savePromises = [];

    for (let i in this.facteur) {
      for (let j in this.facteur[i]) {
        if (this.facteur[i][j] !== undefined && this.facteur[i][j] !== 0) {
          const criter1Name = this.tableauCriter[i];
          const criter2Name = this.tableauCriter[j];

          const savePromise = new Promise((resolve, reject) => {
            this.ahpService.getCriterIdByName(criter1Name).subscribe(
              criter1Id => {
                this.ahpService.getCriterIdByName(criter2Name).subscribe(
                  criter2Id => {
                    const relationCriter = {
                      id: {
                        criter1: criter1Id,
                        criter2: criter2Id
                      },
                      facteur: this.facteur[i][j]
                    };

                    if (i === j) {
                      relationCriter.facteur = 1;
                    }

                    console.log("relationCriter", relationCriter);
                    this.ahpService.save(relationCriter).subscribe(
                      response => {
                        console.log('Successfully saved relationCriter:', response);
                        resolve(response); // Resolve la promesse une fois que l'enregistrement est terminé
                      },
                      error => {
                        console.error('Failed to save relationCriter:', error);
                        reject(error); // Rejette la promesse en cas d'erreur
                      }
                    );
                  }
                );
              }
            );
          });

          savePromises.push(savePromise);
        }
      }
    }

    // Attendre que toutes les promesses de sauvegarde soient résolues avant de continuer
    return Promise.all(savePromises);
  }

  ///////////////////////////////////////////////////////////////////
  saveRelationSCriter() {
    const savePromises = [];

    for (let critereIndex in this.form) {
      for (let rowIndex in this.facteurSoucCriter[critereIndex]) {
        for (let colIndex in this.facteurSoucCriter[critereIndex][rowIndex]) {
          const value = this.facteurSoucCriter[critereIndex][rowIndex][colIndex];
          if (value !== undefined && value !== 0) {
            const critereName = this.tableauCriter[critereIndex];
            const sousCriter1Name = this.formS[critereIndex][rowIndex];
            const sousCriter2Name = this.formS[critereIndex][colIndex];

            console.log('Critère:', critereName);
            console.log('Sous-critère 1:', sousCriter1Name);
            console.log('Sous-critère 2:', sousCriter2Name);
            console.log('Facteur:', value);

            const savePromise = new Promise((resolve, reject) => {
              this.ahpService.getSousCriterIdByName(sousCriter1Name).subscribe(
                sousCriter1Id => {
                  this.ahpService.getSousCriterIdByName(sousCriter2Name).subscribe(
                    sousCriter2Id => {
                      const relationSCriter = {
                        id: {
                          sousCriter1: sousCriter1Id,
                          sousCriter2: sousCriter2Id
                        },
                        facteur: value
                      };

                      console.log('Relation à enregistrer:', relationSCriter);

                      this.ahpService.saveS(relationSCriter).subscribe(
                        response => {
                          console.log('Successfully saved relationSCriter:', response);
                          resolve(response);
                        },
                        error => {
                          console.error('Failed to save relationSCriter:', error);
                          reject(error);
                        }
                      );
                    }
                  );
                }
              );
            });

            savePromises.push(savePromise);
          }
        }
      }
    }

    return Promise.all(savePromises);
  }

  ////////////////////////////////////////////////////////////////////
  saveSousCriterAlternative() {
    console.log("hana");
    for (let ii in this.form) {
      for (let i in this.formS[ii]) {
        for (let j = 0; j < this.numbreAlternative; j++) {

          // Vérifier si la valeur est définie et différente de 0 (ou d'une autre valeur par défaut)
          if (this.facteuralternative[ii][i][j] !== undefined && this.facteuralternative[ii][i][j] !== 0) {
            console.log("kawtarscralt");

            const critereName = this.tableauCriter[ii]; // Récupérer le nom du critère
            const sousCriter1Name = this.formS[ii][i]; // Récupérer le nom du sous-critère 1
            const alternative = this.formAlternative[j]; // Récupérer l'objet de l'alternative
            console.log(critereName);
            console.log(sousCriter1Name);
            console.log(alternative);

            this.ahpService.getSousCriterIdByName(sousCriter1Name).subscribe(
              sousCriter1Id => {
                // Enregistrer la relation entre le sous-critère et l'alternative dans la base de données
                const relationSCriterAlt = {
                  id: {
                    sousCriter: sousCriter1Id,
                    alternative: alternative.id // Supposons que l'ID de l'alternative soit accessible via la propriété id
                  },
                  facteur: this.facteuralternative[ii][i][j]
                };
                console.log("relationSCriterAlt", relationSCriterAlt);
                this.ahpService.saveSAlt(relationSCriterAlt).subscribe(
                  response => {
                    console.log('Successfully saved relationSCriter:', response);
                  },
                  error => {
                    console.error('Failed to save relationSCriter:', error);
                  }
                );
              }
            );
          }
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////////

  changee(deviceValue: any, i: number, ii: number, j: number) {

    console.log(deviceValue.value);

    this.facteurSoucCriter[j][i][ii] = deviceValue.value;



  }

  addprojet() {
    this.projetahp.user = JSON.parse(sessionStorage.getItem("USER"))
    this.projetahp.name = this.nom;
    this.projetahp.methode = "ahptopsis"; 

    this.projetahp.numbreCriters = this.numbre;
    this.projetahp.cr = this.CR.toFixed(3);
    this.projetahp.numbreAlternatives = this.numbreAlternative
    console.log(this.projetahp)

    this.ahpService.add(this.projetahp).subscribe(data => {
      this.projetahp = data
      console.log(this.projetahp)

    })
  }
  addcriters() {
    for (let jj = 0; jj < this.numbre; jj++) {
      this.critersahp[jj].name = this.form[jj];
      this.critersahp[jj].numbresousCriters = this.n[jj];
      this.critersahp[jj].poids = this.etap3PoidsSCR[jj];
      this.critersahp[jj].projetAhp.id = this.projetahp.id;
    }

    console.log(this.critersahp);

    // Ajout des critères
    for (let jj = 0; jj < this.numbre; jj++) {
      this.ahpService.addCriters(this.critersahp[jj]).subscribe(data => {
        this.critersahp[jj] = data;
        console.log(this.critersahp[jj]);

        // Si c'est le dernier critère, ajoutez les sous-critères
        if (jj === this.numbre - 1) {
          this.addSousCriters();
        }
      });
    }
  }

  addSousCriters() {
    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {

        this.souscritersahp[i][jj].name = this.formS[i][jj]
        this.souscritersahp[i][jj].poids = 0.0
        this.souscritersahp[i][jj].criter.id = this.critersahp[i].id

      }
    }
    console.log("JSON CRITERS AVANT")
    console.log(this.souscritersahp)

    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {

        this.ahpService.addSousCriters(this.souscritersahp[i][jj]).subscribe(data => {
          this.souscritersahp[i][jj] = data
        })
      }

    }

    console.log("JSON CRITERS APRES")
    console.log(this.souscritersahp)
  }

  /*
  // Appel à la fonction addRelationCriter à la fin de l'étape 5
  addRelationCriterAtStep5() {
    // Parcourir votre tableau de facteurs et appeler la fonction change pour chaque paire de critères
    for (let i = 0; i < this.facteur.length; i++) {
      for (let ii = 0; ii < this.facteur[i].length; ii++) {
        this.change({ value: this.facteur[i][ii] }, i, ii);
      }
    }
  }*/

  /*
  change(deviceValue: any, i: number, ii: number) {
    console.log(deviceValue.value);
  
    // Mettre à jour la matrice de facteurs
    this.facteur[i][ii] = deviceValue.value;
  
    // Vérifier si la valeur de i existe dans la table criter
    if (i >= this.tableauCriter.length) {
      console.error('Invalid value of i:', i);
      return; // Arrêter le processus si i est invalide
    }else{console.log('valid i criter existant')}
  
    // Créer l'objet relationCriter
    const relationCriter = {
      id: {
        criter1: i,
        criter2: ii
      },
      facteur: deviceValue.value
    };
  
    // Appeler le service pour ajouter la relation de critère dans la base de données
    this.ahpService.addRelationCriter(relationCriter).subscribe(
      response => {
        console.log('Successfully saved relationCriter:', response);
      },
      error => {
        console.error('Failed to save relationCriter:', error);
      }
    );
  }
  */


  showALternatives() {
    this.showalterINputsAlternative = true;


  }

  showetap7() {
    this.showtab7 = true;
    console.log("ALternatives : ----")
    console.log(this.alternative)

    this.addAlternatives()
  }
  xx(deviceValue: any, i: number, ii: number, j: number) {

    console.log(deviceValue.value);

    this.facteuralternative[i][ii][j] = deviceValue.value;


  }
  show() {

    console.log(this.facteuralternative)
  }

  etap1topsis() {


    for (let i = 0; i < this.numbre; i++) {
      this.topsisetap1[i] = {}
      for (let j = 0; j < this.n[i]; j++) {
        this.topsisetap1[i][j] = 0



        for (let jj = 0; jj < this.numbreAlternative; jj++) {
          this.topsisetap1[i][j] = this.topsisetap1[i][j] + this.facteuralternative[i][j][jj] * this.facteuralternative[i][j][jj]
        }




      }

      for (let j = 0; j < this.n[i]; j++) {
        this.topsisetap1[i][j] = Math.sqrt(this.topsisetap1[i][j])
      }
    }

    console.log("Etape 1 TOPSIS ---");

    console.log(this.topsisetap1);
  }

  etap2topsis() {



    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {
        for (let j = 0; j < this.numbreAlternative; j++) {
          console.log("testroa", this.topsisetap1[i][jj])
          this.facteur2alternative[i][jj][j] = this.facteuralternative[i][jj][j] * this.leveltwo[i][jj] / this.topsisetap1[i][jj]

          this.facteur2alternative[i][jj][j] = this.facteur2alternative[i][jj][j].toFixed(3)
          console.log("facteur2alternative", this.facteur2alternative)
        }
      }
    }

    console.log("Etap 2 Topsis");
    console.log("", this.facteur2alternative);

    console.log("Facteur Alternative");
    console.log(this.facteuralternative)



  }

  onCheckboxChange(deviceValue: any) {

    console.log(deviceValue);


  }

  max: any;
  min: any;
  choices: string[] = [];

  setradio(e: string, j: any, i: any): void {
    this.max = this.facteur2alternative[j][i][0]
    this.min = this.facteur2alternative[j][i][0]
    for (let jj = 0; jj < this.numbreAlternative; jj++) {
      if (this.max < this.facteur2alternative[j][i][jj]) {
        this.max = this.facteur2alternative[j][i][jj]
      }
      if (this.min > this.facteur2alternative[j][i][jj]) {
        this.min = this.facteur2alternative[j][i][jj]
      }
    }

    if (e == "+") {
      console.log("maximiser");
      this.aplus[j][i] = this.max
      this.amoins[j][i] = this.min
      this.choices[j * this.numbre + i] = "maximiser";

    } else {
      console.log("minimiser")

      this.aplus[j][i] = this.min
      this.amoins[j][i] = this.max
      this.choices[j * this.numbre + i] = "minimiser";

    }
    console.log("apluslwla", this.aplus)
    console.log("moinslwla", this.amoins)

    console.log("Contenu du tableau choices :", this.choices);

  }



  setradioo(e: string, i: any): void {
    for (let j = 0; j < 10; j++) {
      this.form[j] = j
    }
    this.form = Array.of(this.form)
    console.log(this.form[0]);
    if (e == "+") {
      console.log(Math.max(...this.form))


    } else {
      console.log("minimiser")
      console.log(Math.min(...this.form))
    }
  }

  addAlternatives() {
    console.log(this.numbreAlternative + ' numbre Alter')
    for (let i = 0; i < this.numbreAlternative; i++) {
      this.formAlternative[i] = {
        name: '',
        projetAhp: { id: '' }
      }

      this.formAlternative[i].name = this.alternative[i];
      this.formAlternative[i].projetAhp.id = this.projetahp.id
    }
    console.log(this.formAlternative)

    for (let i = 0; i < this.numbreAlternative; i++) {

      this.ahpService.addalternative(this.formAlternative[i]).subscribe(data => {
        this.formAlternative[i] = data
        console.log(this.formAlternative[i])
      })
    }
  }
  setAlternatives() {
    let promises = [];
    for (let jj = 0; jj < this.numbreAlternative; jj++) {
      const alternativeName = this.alternative[jj]; // Correction ici
      promises.push(
        new Promise((resolve, reject) => {
          this.ahpService.getAlternativeByName(alternativeName).subscribe(
            (alternative: any) => {
              if (alternative) {
                alternative.ci = parseFloat(this.ci[jj].toFixed(6));
                // Mettre à jour la valeur de ci
                this.ahpService.updateAlternative(alternative.id, alternative).subscribe(
                  response => {
                    console.log("Alternative ${alternativeName} mise à jour avec succès :", response);
                    resolve(true); // Resolves the promise when the update is successful
                  },
                  error => {
                    console.error("Erreur lors de la mise à jour de l'alternative ${alternativeName} :", error);
                    reject(error); // Rejects the promise if there is an error
                  }
                );
              } else {
                console.error("Alternative ${alternativeName} non trouvée.");
                reject("Alternative ${alternativeName} non trouvée.");
              }
            },
            error => {
              console.error("Erreur lors de la récupération de l'alternative ${alternativeName} :", error);
              reject(error);
            }
          );
        })
      );
    }

    // Return a promise that resolves when all updates are done
    return Promise.all(promises);
  }

  setRank() {
    let promises = [];
    for (let jj = 0; jj < this.numbreAlternative; jj++) {
      const alternativeName = this.alternative[jj]; // Correction ici
      promises.push(
        new Promise((resolve, reject) => {
          this.ahpService.getAlternativeByName(alternativeName).subscribe(
            (alternative: any) => {
              if (alternative) {
                alternative.rank = this.ranks[jj];
                // Mettre à jour la valeur de ci
                this.ahpService.updateAlternativeRank(alternative.id, alternative).subscribe(
                  response => {
                    console.log("mise a jour du rank avec succes, response");
                    resolve(true); // Resolves the promise when the update is successful
                  },
                  error => {
                    console.error("Erreur lors de la mise à jour de rank, error");
                    reject(error); // Rejects the promise if there is an error
                  }
                );
              } else {
                console.error("Alternative non trouvée.");
                reject("Alternative non trouvée.");
              }
            },
            error => {
              console.error("Erreur lors de la récupération de l'alternative  :", error);
              reject(error);
            }
          );
        })
      );
    }

    // Return a promise that resolves when all updates are done
    return Promise.all(promises);
  }
  addfacteurCriters() {
    console.log(this.numbre);


    for (let i = 0; i < this.numbre; i++) {
      this.formRelationCriter[i] = {}
      for (let j = 0; j < this.numbre; j++) {
        this.formRelationCriter[i][j] = {
          facteur: '',
          criter1: { id: '' },
          criter2: { id: '' },
        }
      }
    }

    for (let i = 0; i < this.numbre; i++) {
      for (let j = 0; j > i && j < this.numbre; j++) {

        this.formAlternative[i][j].facteur = this.facteur[i][j]
        this.formAlternative[i][j].criter1.id = this.critersahp[i].id
        this.formAlternative[i][j].criter2.id = this.critersahp[j].id
      }
    }

    console.log(this.formAlternative);
  }


  etapfinal1() {

    for (let jj = 0; jj < this.numbreAlternative; jj++) {

      this.dplus[jj] = 0;
      this.dmoins[jj] = 0;

      for (let i = 0; i < this.numbre; i++) {

        for (let j = 0; j < this.n[i]; j++) {
          this.dplus[jj] = this.dplus[jj] + (this.facteur2alternative[i][j][jj] - this.aplus[i][j]) * (this.facteur2alternative[i][j][jj] - this.aplus[i][j])
          this.dmoins[jj] = this.dmoins[jj] + (this.facteur2alternative[i][j][jj] - this.amoins[i][j]) * (this.facteur2alternative[i][j][jj] - this.amoins[i][j])
        }
      }
      this.dmoins[jj] = Math.sqrt(this.dmoins[jj])
      this.dplus[jj] = Math.sqrt(this.dplus[jj])
    }
    for (let jj = 0; jj < this.numbreAlternative; jj++) {
      this.b = this.dplus[jj] + this.dmoins[jj]
      this.ci[jj] = this.dmoins[jj] / this.b
    }

    console.log("dmoins1", this.dmoins)
    console.log("dplus", this.dplus)
    console.log(this.ci)
    var sorted = this.ci.slice().sort(function (a, b) { return b - a })
    this.ranks = this.ci.map(function (v) { return sorted.indexOf(v) + 1 });
    console.log(this.ranks);
    this.setAlternatives();
    this.setRank();
    Promise.all([this.setAlternatives(), this.setRank()]).then(() => {
      this.showetapetapfinaltopsis = true;
    });
    this.showetapetapfinaltopsis = true;
  }


  
  showTable: boolean = false;
  permutations: any[][] = [];

  ////////////////////////////////////////////////////////////////
  showIntermediateStep: boolean = false;


  generatePermutations(levelTwo: any): void {
    const values: any[] = Object.values(levelTwo);
    const flattenedValues: any[] = values.reduce((acc: any[], curr: any) => acc.concat(Object.values(curr)), []);

    // Fonction pour générer une permutation spécifique
    function generateSpecificPermutation(arr: any[], swapIndex: number): any[] {
      const perm: any[] = [...arr]; // Copie du tableau
      perm[0] = arr[swapIndex]; // Échanger la première valeur avec la valeur cible
      perm[swapIndex] = arr[0]; // Mettre la valeur initiale dans la position cible
      return perm;
    }

    // Générer les permutations spécifiques pour les autres lignes
    const permutations: any[][] = [];
    for (let i = 0; i < flattenedValues.length; i++) {
      const permutation: any[] = generateSpecificPermutation(flattenedValues, i);
      permutations.push(permutation);
    }

    // Ajouter une dernière ligne avec la valeur moyenne
    const sum = flattenedValues.reduce((acc: any, val: any) => acc + parseFloat(val), 0);
    const average = sum / flattenedValues.length;
    const averageRow = new Array(flattenedValues.length).fill(average.toFixed(3));
    permutations.push(averageRow);

    // Mettre à jour les permutations finales
    this.permutations = permutations;
    console.log('permutations:', this.permutations);
    this.etap1topsissensitivity();

// Update showIntermediateStep to show the new tabPanel
this.showIntermediateStep = true;

    this.reclaculetap2topsis();
    this.drawRanksGraph();

  }





  etap1topsissensitivity() {


    for (let i = 0; i < this.numbre; i++) {
      console.log('criteres : ', this.numbre);

      this.topsisetap1[i] = {}
      for (let j = 0; j < this.n[i]; j++) {
        console.log('n[i] : ', this.n[i]);

        this.topsisetap1[i][j] = 0



        for (let jj = 0; jj < this.numbreAlternative; jj++) {
          console.log('numbreAlternative : ', this.numbreAlternative);
          console.log('facteuralternative :', this.facteuralternative[i][j][jj])
          this.topsisetap1[i][j] = this.topsisetap1[i][j] + this.facteuralternative[i][j][jj] * this.facteuralternative[i][j][jj]
          console.log('topsisetap1[i][j] :', this.topsisetap1[i][j]);

        }




      }

      for (let j = 0; j < this.n[i]; j++) {
        console.log('topsisetap1[i][j] :', this.topsisetap1[i][j]);
        this.topsisetap1[i][j] = Math.sqrt(this.topsisetap1[i][j])
      }
    }

    console.log("Etape 1 TOPSIS ---");

    console.log(this.topsisetap1);
  }
  etap2topsisParPermutation: number[][][][] = [];
  aplusParPermutation: number[][][] = [];
  amoinsParPermutation: number[][][] = [];

  dplusParPermutation: number[][] = [];
  dmoinsParPermutation: number[][] = [];

  ranksParPermutation: number[][] = [];

  ciParPermutation: number[][] = []; // Nouveau tableau pour stocker ci par permutation
  // Ajouter un tableau pour stocker les noms des alternatives
alternativeNames: string[] = [];

  reclaculetap2topsis(): void {
    // Initialisation des tableaux de résultats
    const etap2topsisParPermutation: number[][][][] = [];
    const aplusParPermutation: number[][][] = [];
    const amoinsParPermutation: number[][][] = [];
    const dplusParPermutation: number[][] = [];
    const dmoinsParPermutation: number[][] = [];
    const ciParPermutation: number[][] = [];
    const ranksParPermutation: number[][] = []; // Nouveau tableau pour stocker les rangs par permutation

    // Boucle pour parcourir toutes les permutations
    for (let p = 0; p < this.permutations.length; p++) {
      let permutationIndex = 0;

      const etap2topsisPourCettePermutation: number[][][] = [];
      const aplusPourCettePermutation: number[][] = [];
      const amoinsPourCettePermutation: number[][] = [];

      // Boucle pour parcourir tous les critères
      for (let i = 0; i < this.numbre; i++) {
        const etap2topsisPourCeCritere: number[][] = [];
        const aplusPourCeCritere: number[] = [];
        const amoinsPourCeCritere: number[] = [];

        // Boucle pour parcourir tous les sous-critères de chaque critère
        for (let critere = 0; critere < this.n[i]; critere++) {
          const leveltwo = this.permutations[p][permutationIndex];
          permutationIndex++;

          const etap2topsisPourCeSousCritere: number[] = [];

          for (let j = 0; j < this.numbreAlternative; j++) {
            const altName = this.alternative[j];
            // Vérifier si l'alternative n'est pas déjà dans le tableau alternativeNames
            if (!this.alternativeNames.includes(altName)) {
                this.alternativeNames.push(altName);
            }
            const etap2topsis = this.facteuralternative[i][critere][j] * leveltwo / this.topsisetap1[i][critere];
            etap2topsisPourCeSousCritere.push(etap2topsis);
          }

          const choice = this.choices[i * this.numbre + critere];
          const maxEtMin = this.getMaxAndMin(etap2topsisPourCeSousCritere, choice);
          aplusPourCeCritere.push(maxEtMin.max);
          amoinsPourCeCritere.push(maxEtMin.min);

          etap2topsisPourCeCritere.push(etap2topsisPourCeSousCritere);
        }

        etap2topsisPourCettePermutation.push(etap2topsisPourCeCritere);
        aplusPourCettePermutation.push(aplusPourCeCritere);
        amoinsPourCettePermutation.push(amoinsPourCeCritere);
      }

      // Calcul de dplus et dmoins pour cette permutation
      const dplusPourCettePermutation: number[] = [];
      const dmoinsPourCettePermutation: number[] = [];

      for (let jj = 0; jj < this.numbreAlternative; jj++) {
        let dplus = 0;
        let dmoins = 0;

        for (let i = 0; i < this.numbre; i++) {
          for (let j = 0; j < this.n[i]; j++) {
            dplus += Math.pow(etap2topsisPourCettePermutation[i][j][jj] - aplusPourCettePermutation[i][j], 2);
            dmoins += Math.pow(etap2topsisPourCettePermutation[i][j][jj] - amoinsPourCettePermutation[i][j], 2);
          }
        }

        dplus = Math.sqrt(dplus);
        dmoins = Math.sqrt(dmoins);

        dplusPourCettePermutation.push(dplus);
        dmoinsPourCettePermutation.push(dmoins);
      }

      // Calcul de ci pour cette permutation
      const ciPourCettePermutation: number[] = [];
      for (let jj = 0; jj < this.numbreAlternative; jj++) {
        const b = dplusPourCettePermutation[jj] + dmoinsPourCettePermutation[jj];
        const ciValue = dmoinsPourCettePermutation[jj] / b;
        ciPourCettePermutation.push(ciValue);
      }

      // Calcul des rangs pour cette permutation
      const sorted = ciPourCettePermutation.slice().sort((a, b) => b - a);
      const ranks = ciPourCettePermutation.map(v => sorted.indexOf(v) + 1);
      ranksParPermutation.push(ranks);

      etap2topsisParPermutation.push(etap2topsisPourCettePermutation);
      aplusParPermutation.push(aplusPourCettePermutation);
      amoinsParPermutation.push(amoinsPourCettePermutation);
      dplusParPermutation.push(dplusPourCettePermutation);
      dmoinsParPermutation.push(dmoinsPourCettePermutation);
      ciParPermutation.push(ciPourCettePermutation); // Assignation de ci pour cette permutation
    }

    // Assignation des résultats aux variables de classe
    this.etap2topsisParPermutation = etap2topsisParPermutation;
    this.aplusParPermutation = aplusParPermutation;
    this.amoinsParPermutation = amoinsParPermutation;
    this.dplusParPermutation = dplusParPermutation;
    this.dmoinsParPermutation = dmoinsParPermutation;
    this.ciParPermutation = ciParPermutation; // Assignation de ci par permutation
    this.ranksParPermutation = ranksParPermutation; // Assignation des rangs par permutation

    // Affichage des résultats
    console.log('Alternative Names : ',this.alternativeNames);
    console.log("Etap 2 Topsis recalculé pour toutes les permutations :", this.etap2topsisParPermutation);
    console.log("A+ pour toutes les permutations :", this.aplusParPermutation);
    console.log("A- pour toutes les permutations :", this.amoinsParPermutation);
    console.log("D+ pour toutes les permutations :", this.dplusParPermutation);
    console.log("D- pour toutes les permutations :", this.dmoinsParPermutation);
    console.log("Ci pour toutes les permutations :", this.ciParPermutation); // Affichage de ci par permutation
    console.log("Rangs pour toutes les permutations :", this.ranksParPermutation); // Affichage des rangs par permutation
  }

  getMaxAndMin(arr: number[], choice: string): { max: number, min: number } {
    let aplValue = Infinity;
    let amnValue = -Infinity;

    for (let i = 0; i < arr.length; i++) {
      const factor = arr[i];

      if (choice === "maximiser") {
        // Stocker la plus grande valeur dans aplus et la plus petite dans amoins
        if (factor > amnValue) {
          amnValue = factor;
        }
        if (factor < aplValue) {
          aplValue = factor;
        }
      } else if (choice === "minimiser") {
        // Stocker la plus petite valeur dans aplus et la plus grande dans amoins
        if (factor < aplValue) {
          aplValue = factor;
        }
        if (factor > amnValue) {
          amnValue = factor;
        }
      }
    }

    // Inverser les valeurs pour le cas de la minimisation
    if (choice === "minimiser") {
      const temp = aplValue;
      aplValue = amnValue;
      amnValue = temp;
    }

    return { max: amnValue, min: aplValue };
  }

  ordr() {
    this.ci = [1, 5, 6, 8, 9, 10, 7, 3, 0.4]
    var sorted = this.ci.slice().sort(function (a, b) { return b - a })
    this.ranks = this.ci.map(function (v) { return sorted.indexOf(v) + 1 });
    console.log(this.ranks[3]);
  }
  drawRanksGraph(): void {
    if (this.showEtape12 && this.mySvg) {
        const svg = d3.select(this.mySvg.nativeElement);
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const margin = { top: 80, right: 20, bottom: 50, left: 70 }; // Ajustement de la marge inférieure et gauche pour les légendes
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Initialiser un tableau pour les données transformées
        const transformedData: { alt: number, line: number, color: string, perm: number }[] = [];

        // Initialiser un objet pour suivre les changements de rangs pour chaque alternative
        const rankChanges: { [alt: number]: number[] } = {};
        this.alternativeNames.forEach((_, i) => {
            rankChanges[i] = []; // Initialiser un tableau vide pour chaque alternative
        });

        // Parcourir les rangs et ajouter chaque alternative avec une ligne différente
        this.ranksParPermutation.forEach((rankArray, permutationIndex) => {
            rankArray.forEach((rank, altIndex) => {
                const alt = altIndex;
                const line = rank; // La ligne évolue en fonction du classement de l'alternative
                const color = d3.schemeCategory10[altIndex]; // Couleur différente pour chaque alternative
                transformedData.push({ alt, line, color, perm: permutationIndex });

                // Suivre les changements de rang pour chaque alternative
                if (permutationIndex > 0 && rank !== this.ranksParPermutation[permutationIndex - 1][altIndex]) {
                    rankChanges[alt].push(permutationIndex); // Ajouter l'index de la permutation au changement de rang
                }
            });
        });

        // Calculer le maximum des rangs pour définir le domaine de l'axe y
        const maxRank = this.ranksParPermutation.reduce((acc, rankArray) => {
            const maxInArray = Math.max(...rankArray);
            return maxInArray > acc ? maxInArray : acc;
        }, 0);

        const x = d3.scaleLinear()
            .domain([0, this.ranksParPermutation.length - 1])
            .range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([0, maxRank])
            .range([innerHeight, 0]);

        const line = d3.line<{ alt: number, line: number }>()
            .x((d, i) => x(i))
            .y(d => y(d.line));

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Dessiner les lignes en fonction des données transformées
        g.selectAll('.line')
            .data(this.ranksParPermutation[0]) // Utiliser une seule permutation pour déterminer les lignes
            .enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .attr('d', (_, i) => line(transformedData.filter(item => item.alt === i)))
            .attr('stroke', (_, i) => d3.schemeCategory10[i % d3.schemeCategory10.length]); // Couleur différente pour chaque ligne

        // Ajouter les points pour chaque intersection où la ligne fluctue significativement
        transformedData.forEach((dataPoint, index) => {
            if (rankChanges[dataPoint.alt].includes(dataPoint.perm)) {
                const altIndex = dataPoint.alt;
                const color = d3.schemeCategory10[altIndex % d3.schemeCategory10.length];
                g.append('circle')
                    .attr('cx', x(dataPoint.perm))
                    .attr('cy', y(dataPoint.line))
                    .attr('r', 4)
                    .attr('fill', color);
            }
        });

        // Ajouter la légende en haut du graphique
        const legendWidth = this.alternativeNames.length * 80; // Largeur de la légende
        const legendHeight = 20; // Hauteur de la légende
        const legendX = (width - legendWidth) / 2; // Position x de la légende (centrée horizontalement)
        const legendY = margin.top - legendHeight - 10; // Position y de la légende (au-dessus du graphique)
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX},${legendY})`); // Nouvelles coordonnées de la légende

        // Utiliser le tableau alternativeNames pour créer la légende
        this.alternativeNames.forEach((altName, i) => {
            const rectWidth = 10; // Largeur du rectangle de couleur
            const rectHeight = 10; // Hauteur du rectangle de couleur

            // Ajouter un rectangle de couleur pour chaque alternative
            legend.append('rect')
                .attr('x', i * 80) // Position x du rectangle
                .attr('y', 0) // Position y du rectangle
                .attr('width', rectWidth) // Largeur du rectangle
                .attr('height', rectHeight) // Hauteur du rectangle
                .attr('fill', d3.schemeCategory10[i % d3.schemeCategory10.length]); // Couleur du rectangle

            // Ajouter le texte de l'alternative
            legend.append('text')
                .attr('x', i * 80 + rectWidth + 5) // Position x du texte
                .attr('y', rectHeight / 2) // Position y du texte
                .text(altName) // Texte de l'alternative
                .style('font-size', '12px') // Taille de la police
                .attr('alignment-baseline', 'middle'); // Alignement vertical
        });

        // Ajouter les axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).ticks(this.ranksParPermutation.length));

        g.append('g')
            .call(d3.axisLeft(y).tickValues(d3.range(maxRank + 1))); // Utiliser d3.range pour obtenir un tableau de valeurs de 0 à maxRank

        // Ajouter la légende pour l'axe des x
        svg.append('text')
            .attr('x', margin.left + innerWidth / 2)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .text('Iteration');

        // Ajouter la légende pour l'axe des y
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -margin.top - innerHeight / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .text('Rank');
    }
}


getAlternativeNames(permIndex: number, ranks: number[]): string[] {
  const alternativeNamesWithRanks = ranks.map((rank, index) => ({ name: this.alternativeNames[index], rank }));
  alternativeNamesWithRanks.sort((a, b) => a.rank - b.rank);
  return alternativeNamesWithRanks.map(item => item.name); // Retourner seulement les noms des alternatives
}




  
}
