import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjetService } from '../services/projetahp.service';
import { ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-fahp',
  templateUrl: './fahp.component.html',
  styleUrls: ['./fahp.component.css']
})
export class FahpComponent implements OnInit {
  @ViewChild('mySvg') mySvg!: ElementRef<SVGElement>;
  ngAfterViewInit() {
    // Assurez-vous que mySvg est défini avant d'appeler drawRanksGraph
    if (this.mySvg) {
      this.drawRanksGraph();
    }
  }

  cities: number[][];
  numbre!: number;
  constructor(
    private ahpService: ProjetService,
    private userService: UserService,

    private cdr: ChangeDetectorRef
  ) {
    this.facteur = [];
    for (let i = 0; i < this.numbre; i++) {
      this.facteur.push([]);
      for (let j = 0; j < this.numbre; j++) {
        this.facteur[i].push(0); // Initialisez chaque élément de la matrice à 0
      }
    }





    for (let jj = 0; jj < 5; jj++) {
      this.classement[jj] = {
        ci: 0,
        claassment: 0,
      }
    }
    this.cities = [
      [1, 1, 1],
      [2, 3, 4],
      [4, 5, 6],
      [6, 7, 8],
      [9, 9, 9],
      [1, 2, 3],
      [3, 4, 5],
      [5, 6, 7],
      [7, 8, 9]
    ];




    this.altfact = [
      [1, 1, 3],
      [1, 3, 5],
      [3, 5, 7],
      [5, 7, 9],
      [7, 9, 9]

    ];

  }

  
  ngOnInit() {
    console.log("session",JSON.parse(sessionStorage.getItem("USER")));

    if (this.showEtape12 && this.ranksRoa.length > 0) {
      this.drawRanksGraph();
    }
    this.fetchExpertEmails();
    this.calculateAndDisplayAverages();

  }

  classement: any = {

  }
  showmatrice: boolean = true;


  showinputs: boolean = false;
  critersahp: any = {};
  souscritersahp: any = {};
  formAlternative: any = {};
  facteuralternative: any = {};
  aplus: any = {};
  amoins: any = {};
  facteur2alternative: any = {}
  index: number = 0;
  projetahp: any = {};
  n: any = {};

  nom!: string;
  numbreAlternative: number;
  altfact: number[][];
  CR: number = 0;
  showSousCriter: boolean = false;
  numbersS: number[] = [0, 0, 0];
  showSousCriters: boolean[] = [false, false];
  formS: any = {};
  etap1subCR: any = {}
  etap2subCR: any = {}
  landasub: any = {}
  ICsub: number[] = []
  CRsub: number[] = []
  valIAsub: number[] = []
  landa: number = 0;
  IC: number = 0;
  facteurSoucCriter: any = {};
  etap2Poids: any = {};
  etap3Poids: any = {};
  etap3PoidsLocal: any = {};

  etap2PoidsSCR: any = {};
  etap3PoidsSCR: any = {};
  etap2PoidsSCRinverse: any = {};
  etap1Poids: any = {};
  etap1PoidsSCR: any = {};
  leveltwo: any = {};
  alternative: any = {};
  showCR: boolean = true; // Ajoutez cette variable pour gérer l'affichage du CR
  formRelationCriter: any = {};
  showSousmatrice: boolean = false;
  showalterINputsAlternative: boolean = false;
  showtab7: boolean = false;
  showtap10: boolean = false;
  showEtape12: boolean = true;
  numbreExpert: number;
  benefCost: any = {};
  showExpertInputss: boolean;
  form: any = {};
  tableauCriter: string[] = this.form;
  nodes: any = [
    {
      name: '',
      cssClass: 'ngx-org-ceo',

      title: ' ',
      childs: [

      ]

    }];
  matrice: any = {};
  facteur: any = {};
  showarbre: boolean = false;




  arrayOne(n: number): any[] {
    return Array(n);
  }
  showinfo() {
    console.log("Matrice Criters")
    console.log(this.facteur)
    this.arbre();
    console.log(this.matrice)

    this.showmatrice = true

  } updateInverse(i, j, value) {
    const invertedValue = value.split(',').map(Number).map(val => 1 / val);
    console.log(`Inverse of (${value}): (${invertedValue[2]}, ${invertedValue[1]}, ${invertedValue[0]})`);
    this.facteur[j][i] = (`${invertedValue[2]}, ${invertedValue[1]}, ${invertedValue[0]}`);
    console.log(this.facteur[j][i]);
    this.cdr.detectChanges(); // Force la mise à jour de l'interface utilisateur
  }

  saveRelationCriter() {
    const savePromises = [];

    for (let i = 0; i < this.numbre; i++) {
      for (let j = 0; j < this.numbre; j++) {
        if (this.facteur[i][j] !== undefined && this.facteur[i][j] !== 0) {
          const criter1Name = this.tableauCriter[i];
          const criter2Name = this.tableauCriter[j];

          const savePromise = new Promise((resolve, reject) => {
            this.ahpService.getCriterIdByName(criter1Name).subscribe(
              criter1Id => {
                this.ahpService.getCriterIdByName(criter2Name).subscribe(
                  criter2Id => {
                    let relationCriter;

                    // Sinon, calculez les valeurs low, mid et high en fonction de la valeur du facteur
                    const facteurValue = this.facteur[i][j];
                    const facteurValues = facteurValue.split(',').map(Number);

                    relationCriter = {
                      id: {
                        criter1: criter1Id,
                        criter2: criter2Id
                      },
                      facteur: {
                        lowerBound: facteurValues[0],
                        midlbound: facteurValues[1],
                        upperBound: facteurValues[2]
                      }
                    };


                    console.log("relationCriterFahp", relationCriter);
                    this.ahpService.savefahp(relationCriter).subscribe(
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
        } else if (i === j) {
          // Si les indices i et j sont égaux et que la valeur est undefined ou 0, cela signifie que c'est la diagonale
          // Ajoutez la relation de la diagonale à la base de données
          const criterName = this.tableauCriter[i];

          const savePromise = new Promise((resolve, reject) => {
            this.ahpService.getCriterIdByName(criterName).subscribe(
              criterId => {
                const relationCriter = {
                  id: {
                    criter1: criterId,
                    criter2: criterId // Les deux critères sont les mêmes car c'est la diagonale
                  },
                  facteur: {
                    lowerBound: 1,
                    midlbound: 1,
                    upperBound: 1
                  }
                };

                console.log("relationCriterFahp", relationCriter);
                this.ahpService.savefahp(relationCriter).subscribe(
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
          });

          savePromises.push(savePromise);
        }
      }
    }

    // Attendre que toutes les promesses de sauvegarde soient résolues avant de continuer
    return Promise.all(savePromises);
  }

  newVariables: any = {};
  sumOfFactors: any = {};
  finalWeights: any = {};

  arbre() {
    // Étape 1: Calcul des poids basés sur les produits des valeurs
    for (let jj = 0; jj < this.numbre; jj++) {
      const rowValues = this.facteur[jj];
      let lowerProduct = 1, middleProduct = 1, upperProduct = 1;

      for (let j = 0; j < this.numbre; j++) {
        if (j === jj) {
          this.facteur[j][j] = '1,1,1';
          this.etap2PoidsSCR[j][j] = 1;
        }
        if (rowValues[j] !== undefined && rowValues[j] !== 0) {
          const [lowerVal, middleVal, upperVal] = rowValues[j].split(',').map(Number);
          lowerProduct *= lowerVal;
          middleProduct *= middleVal;
          upperProduct *= upperVal;
        }
      }

      const power = 1 / this.numbre;
      const lowerWeight = Math.pow(lowerProduct, power);
      const middleWeight = Math.pow(middleProduct, power);
      const upperWeight = Math.pow(upperProduct, power);

      this.etap1PoidsSCR[jj] = `${lowerWeight.toFixed(3)}, ${middleWeight.toFixed(3)}, ${upperWeight.toFixed(3)}`;
    }

    console.log("---------etape 1-MATRICE---- ");
    console.log(this.etap1PoidsSCR);

    // Étape 2: Calcul des sommes des poids basés sur l'étape 1
    let totalLower = 0, totalMiddle = 0, totalUpper = 0;
    for (let jj = 0; jj < this.numbre; jj++) {
      const [lower, middle, upper] = this.etap1PoidsSCR[jj].split(',').map(Number);
      totalLower += lower;
      totalMiddle += middle;
      totalUpper += upper;
    }

    // Assigner la somme des valeurs à etap2PoidsSCR
    const etap2Value = `${totalLower.toFixed(3)}, ${totalMiddle.toFixed(3)}, ${totalUpper.toFixed(3)}`;
    for (let jj = 0; jj < this.numbre; jj++) {
      for (let j = 0; j < this.numbre; j++) {
        this.etap2PoidsSCR[j][jj] = etap2Value;
      }
    }

    console.log("---------etape 2--MATRICE----- ");
    console.log(this.etap2PoidsSCR);

    // Étape 3: Calcul des poids basés sur l'inverse du triple de l'étape 2
    for (let jj = 0; jj < this.numbre; jj++) {
      const [lower, middle, upper] = this.etap2PoidsSCR[0][jj].split(',').map(Number);
      const inverseLower = 1 / upper;
      const inverseMiddle = 1 / middle;
      const inverseUpper = 1 / lower;

      this.etap2PoidsSCRinverse[jj] = `${inverseLower.toFixed(3)}, ${inverseMiddle.toFixed(3)}, ${inverseUpper.toFixed(3)}`;
    }

    console.log("---------etape 2 -- MATRICE INVERSE----- ");
    console.log(this.etap2PoidsSCRinverse);

    // Étape 4: Calcul des nouvelles variables en multipliant les éléments de etap1PoidsSCR par les éléments correspondants de etap2PoidsSCRinverse
    for (let jj = 0; jj < this.numbre; jj++) {
      const etap1Values = this.etap1PoidsSCR[jj].split(',').map(Number);
      const etap2InverseValues = this.etap2PoidsSCRinverse[jj].split(',').map(Number);

      const newValues = etap1Values.map((val, index) => val * etap2InverseValues[index]);

      // Stocker les nouvelles valeurs dans une variable appropriée
      this.newVariables[jj] = `${newValues[0].toFixed(3)}, ${newValues[1].toFixed(3)}, ${newValues[2].toFixed(3)}`;
    }

    console.log("---------Nouvelles variables calculées----- ");
    console.log(this.newVariables);

    // Étape 4: Calcul de la somme des trois facteurs pour chaque ligne de newVariables
    for (let jj = 0; jj < this.numbre; jj++) {
      const [lower, middle, upper] = this.newVariables[jj].split(',').map(Number);
      const sum = lower + middle + upper;
      const average = sum / 3; // Diviser par le nombre de critères

      this.sumOfFactors[jj] = average.toFixed(3); // Stocker la somme dans un tableau
    }

    console.log("---------etape 4 -- SOMME DES FACTEURS----- ");
    console.log(this.sumOfFactors);

    ///////////////////////////////////////////////////////////////////////////////////////////::
    // Étape 5: Calcul de la somme totale des facteurs
    let totalSumOfFactors = 0;
    for (let jj = 0; jj < this.numbre; jj++) {
      totalSumOfFactors += parseFloat(this.sumOfFactors[jj]);
    }

    console.log("---------Somme totale des facteurs----- ");
    console.log(totalSumOfFactors.toFixed(3)); // Afficher la somme totale avec une précision de 3 décimales
    //////////////////////////////////////////////////////////////////////////////////////////
    // Étape 6: Calcul des poids finaux pour chaque critère
    for (let jj = 0; jj < this.numbre; jj++) {
      const weight = parseFloat(this.sumOfFactors[jj]) / totalSumOfFactors; // Calcul du poids en divisant chaque valeur de sumOfFactors par totalSumOfFactors
      this.finalWeights[jj] = weight.toFixed(3); // Stockage du poids final dans un tableau
    }

    console.log("---------Étape 6 -- Poids finaux des critères----- ");
    console.log(this.finalWeights);

  }
  ///////////////////////////////////////////////////////////////////////////////////
  addcriters() {
    for (let jj = 0; jj < this.numbre; jj++) {
      this.critersahp[jj].name = this.form[jj];
      this.critersahp[jj].numbresousCriters = this.n[jj];
      this.critersahp[jj].poids = this.finalWeights[jj];
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
  currentCriterionIndex: number = 0;

  /////////////////////////////////////////////////////////SOUS CRITERE/////////////////////
  updateInverseSous(rowIndex: number, colIndex: number, newValue: any, critereIndex: number) {
    // Mettre à jour la valeur de la matrice avec la nouvelle valeur sélectionnée
    this.facteurSoucCriter[critereIndex][rowIndex][colIndex] = newValue;
    const invertedValue = newValue.split(',').map(Number).map(val => 1 / val);
    console.log(`Inverse of (${newValue}): (${invertedValue[2]}, ${invertedValue[1]}, ${invertedValue[0]})`);
    this.facteurSoucCriter[critereIndex][colIndex][rowIndex] = (`${invertedValue[2]}, ${invertedValue[1]}, ${invertedValue[0]}`);
    console.log(this.facteurSoucCriter[critereIndex][colIndex][rowIndex]);
    this.cdr.detectChanges();
  }


  executeAllFunctions() {

    for (let i = 0; i < this.numbre; i++) {
      for (let jj = 0; jj < this.n[i]; jj++) {
        for (let j = 0; j < this.n[i]; j++) {
          if (jj === j) {
            this.facteurSoucCriter[i][jj][j] = '1,1,1';
          }

        }

      }
    }
    // Ajoutez des journaux pour vérifier les valeurs des facteurs avant l'enregistrement
    console.log('Facteurs avant l\'enregistrement :', this.facteurSoucCriter);


    //this.showMatriceSous();


    // Enregistrez les relations entre sous-critères
    this.saveRelationSCriter().then(() => {
      // Une fois que les relations sont enregistrées, vous pouvez calculer les poids
      this.calculateSubCriteriaWeights();
      this.setSCR();

      console.log('Après l\'enregistrement, facteurs soumis :', this.facteurSoucCriter);
    }).catch(error => {
      console.error('Error saving relations:', error);
    });



  }

  sommecolumn: any = {};
  subCriteriaTotalWeight: any = {};
  subCriteriaWeights: any = {};

  calculateSubCriteriaWeights() {
    // Initialiser un objet pour stocker les poids des sous-critères
    for (let i = 0; i < this.numbre; i++) {
      this.subCriteriaWeights[i] = {};

      for (let jj = 0; jj < this.n[i]; jj++) {
        const rowValues = this.facteurSoucCriter[i][jj];
        let lowerProduct = 1, middleProduct = 1, upperProduct = 1;

        for (let j = 0; j < this.n[i]; j++) {
          if (rowValues[j] !== undefined && rowValues[j] !== 0) {
            const [lowerVal, middleVal, upperVal] = rowValues[j].split(',').map(Number);
            lowerProduct *= lowerVal;
            middleProduct *= middleVal;
            upperProduct *= upperVal;
          }
        }

        const power = 1 / this.n[i];
        const lowerWeight = Math.pow(lowerProduct, power);
        const middleWeight = Math.pow(middleProduct, power);
        const upperWeight = Math.pow(upperProduct, power);

        this.subCriteriaWeights[i][jj] = `${lowerWeight.toFixed(3)}, ${middleWeight.toFixed(3)}, ${upperWeight.toFixed(3)}`;
      }
    }
    this.showSousmatrice = true;

    console.log("---------Etape1----Poids des sous-critères----- ");
    console.log(this.subCriteriaWeights);

    // Calculer la somme des valeurs low, middle et high de toutes les lignes pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      let lowerSum = 0, middleSum = 0, upperSum = 0;

      for (let jj = 0; jj < this.n[i]; jj++) {
        const [lowerVal, middleVal, upperVal] = this.subCriteriaWeights[i][jj].split(',').map(Number);
        lowerSum += lowerVal;
        middleSum += middleVal;
        upperSum += upperVal;
      }

      // Modifier le format de sortie pour chaque matrice
      this.sommecolumn[i] = `${lowerSum.toFixed(3)}, ${middleSum.toFixed(3)}, ${upperSum.toFixed(3)}`;
    }

    console.log("---------Somme des valeurs Low, Middle et High de toutes les lignes pour chaque matrice---------");
    console.log(this.sommecolumn);
    /////////////////////////////////////////////////////

    // Initialiser un objet pour stocker les sommes inverses des valeurs low, middle et high
    const inverseColumnSums = {};

    // Calculer les sommes des valeurs low, middle et high de toutes les lignes pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      let lowerSum = 0, middleSum = 0, upperSum = 0;

      for (let jj = 0; jj < this.n[i]; jj++) {
        const [lowerVal, middleVal, upperVal] = this.subCriteriaWeights[i][jj].split(',').map(Number);
        lowerSum += lowerVal;
        middleSum += middleVal;
        upperSum += upperVal;
      }

      // Calculer les inverses des sommes de colonnes
      const inverseLowerSum = 1 / lowerSum;
      const inverseMiddleSum = 1 / middleSum;
      const inverseUpperSum = 1 / upperSum;

      // Inverser l'ordre des valeurs dans chaque triplet
      const invertedTriplet = `${inverseUpperSum.toFixed(3)}, ${inverseMiddleSum.toFixed(3)}, ${inverseLowerSum.toFixed(3)}`;

      // Stocker les inverses des sommes dans l'objet
      inverseColumnSums[i] = invertedTriplet;
    }

    // Afficher les résultats
    console.log("---------Sommes inverses des valeurs Low, Middle et High de toutes les lignes pour chaque matrice (avec ordre inversé)---------");
    console.log(inverseColumnSums);

    ///////////////////////////////////////////////////////////////////
    // Initialiser un objet pour stocker les triplets calculés
    const triplets: any = {};

    // Pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      triplets[i] = {};

      // Pour chaque ligne de la matrice
      for (let jj = 0; jj < this.n[i]; jj++) {
        const [lowerVal, middleVal, upperVal] = this.subCriteriaWeights[i][jj].split(',').map(Number);
        const [inverseLowerSum, inverseMiddleSum, inverseUpperSum] = inverseColumnSums[i].split(',').map(Number);

        // Calculer les produits respectifs
        const newLowerVal = lowerVal * inverseLowerSum;
        const newMiddleVal = middleVal * inverseMiddleSum;
        const newUpperVal = upperVal * inverseUpperSum;

        // Stocker le triplet calculé
        triplets[i][jj] = `${newLowerVal.toFixed(3)}, ${newMiddleVal.toFixed(3)}, ${newUpperVal.toFixed(3)}`;
      }
    }

    // Afficher les triplets calculés
    console.log("---------Triplets calculés pour chaque ligne de la matrice---------");
    console.log(triplets);

    ////////////////////////////////////////////////////////////////////////

    // Calculer la somme des triplets pour chaque ligne de la matrice et diviser par trois
    const tripletSums: any = {};

    // Pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      tripletSums[i] = {};

      // Pour chaque ligne de la matrice
      for (let jj = 0; jj < this.n[i]; jj++) {
        const [lowerVal, middleVal, upperVal] = triplets[i][jj].split(',').map(Number);
        const sum = lowerVal + middleVal + upperVal;
        const average = sum / 3;
        tripletSums[i][jj] = average.toFixed(3);
      }
    }

    // Afficher les sommes des triplets pour chaque ligne de la matrice
    console.log("---------Sommes des triplets pour chaque ligne de la matrice---------");
    console.log(tripletSums);
    //////////////////////////////////////////////////////////////////////////////////

    // Initialiser un objet pour stocker la somme des tripletsSums des lignes de chaque matrice
    const matrixSum: any = {};

    // Pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      let matrixSumTotal = 0;

      // Pour chaque ligne de la matrice
      for (let jj = 0; jj < this.n[i]; jj++) {
        const sum = parseFloat(tripletSums[i][jj]);
        matrixSumTotal += sum;
      }

      // Stocker la somme totale pour la matrice
      matrixSum[i] = matrixSumTotal.toFixed(3);
    }

    // Afficher la somme des tripletsSums des lignes de chaque matrice
    console.log("---------Somme des tripletsSums des lignes de chaque matrice---------");
    console.log(matrixSum);

    //////////////////////////////////////////////////////////////////////////////////
    // Initialiser un objet pour stocker les tripletSums normalisés

    // Pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      this.etap3PoidsLocal[i] = {}; // Initialiser l'objet pour chaque matrice

      // Pour chaque ligne de la matrice
      for (let jj = 0; jj < this.n[i]; jj++) {
        // Diviser chaque valeur de tripletSums par la somme correspondante dans matrixSum
        this.etap3PoidsLocal[i][jj] = (parseFloat(tripletSums[i][jj]) / parseFloat(matrixSum[i])).toFixed(3);
      }
    }

    // Afficher les tripletSums normalisés
    console.log("---------POIDS LOCAUX---------");
    console.log(this.etap3PoidsLocal);

    ///////////////////////////////////////////////////
    // Pour chaque matrice
    for (let i = 0; i < this.numbre; i++) {
      this.etap3Poids[i] = {}; // Initialiser l'objet pour chaque matrice

      // Pour chaque ligne de la matrice
      for (let jj = 0; jj < this.n[i]; jj++) {
        if (jj === 0) {
          // Si c'est le premier sous-critère, multipliez son poids local par le poids global du critère lui-même
          this.etap3Poids[i][jj] = this.etap3PoidsLocal[i][jj] * parseFloat(this.finalWeights[i]);
        } else {
          // Sinon, multipliez le poids local par le poids global du critère précédent
          this.etap3Poids[i][jj] = this.etap3PoidsLocal[i][jj] * this.etap3Poids[i][jj - 1];
        }
      }
    }

    // Afficher les poids globaux etap3Poids
    console.log("---------Poids globaux des sous-critères---------");
    console.log(this.etap3Poids);

  }


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
                      const facteurValues = value.split(',').map(Number);
                      const relationSousCriterFahp = {
                        id: {
                          sousCriter1: sousCriter1Id,
                          sousCriter2: sousCriter2Id
                        },
                        facteur: {
                          lowerBound: facteurValues[0],
                          midlbound: facteurValues[1],
                          upperBound: facteurValues[2]
                        }
                      };

                      console.log('Relation à enregistrer:', relationSousCriterFahp);

                      this.ahpService.saveSfahp(relationSousCriterFahp).subscribe(
                        response => {
                          console.log('Successfully saved relationSousCriterFahp:', response);
                          resolve(response);
                        },
                        error => {
                          console.error('Failed to save relationSousCriterFahp:', error);
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

  showstep11(etap3Poids: any): void {
    this.showTable = true;
    this.openNext();
    this.generatePermutations(etap3Poids); // Générer les permutations une seule fois
  }

  showTable: boolean = false;
  permutations: any[][] = [];

  ////////////////////////////////////////////////////////////////
  showIntermediateStep: boolean = false;


  generatePermutations(etap3Poids: any): void {
    const values: any[] = Object.values(etap3Poids);
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

    // Update showIntermediateStep to show the new tabPanel
    this.showIntermediateStep = true;

    this.reclaculetapftopsis();



  }
  alternativeNames: string[] = [];
// Déclarez CPlus en tant que propriété de classe
CPlus: any[][] = [];
ranksRoa: any[] = [];
  reclaculetapftopsis(): void {
    // Tableau pour stocker les weighted normalized decision matrices de chaque itération
    const weightedNormalizedDecisionMatrices: any[] = [];
    // Tableau pour stocker les valeurs de A* pour chaque permutation
    const AStar: any[] = [];
    // Tableau pour stocker les valeurs de A- pour chaque permutation
    const AMinus: any[] = [];
    // Tableau pour stocker les valeurs de D+ pour chaque permutation et chaque alternative
    const DPlus: any[] = [];
    // Tableau pour stocker les valeurs de D- pour chaque permutation et chaque alternative
    const DMinus: any[] = [];
    // Tableau pour stocker les valeurs de C+ pour chaque permutation et chaque alternative
    //const CPlus: any[] = [];
    // Tableau pour stocker les valeurs de C- pour chaque permutation et chaque alternative
    const CMinus: any[] = [];
    // Tableau pour stocker les rangs de chaque alternative dans chaque permutation
    //const ranks: any[] = [];

    // Boucle pour parcourir toutes les permutations
    for (let p = 0; p < this.permutations.length; p++) {
      // Matrice pour stocker la weighted normalized decision matrix de l'itération actuelle
      const weightedNormalizedDecisionMatrixIteration: any = {};
      // Objet pour stocker les valeurs de A* pour cette permutation
      const AStarPermutation: any = {};
      // Objet pour stocker les valeurs de A- pour cette permutation
      const AMinusPermutation: any = {};
      // Objet pour stocker les valeurs de D+ pour cette permutation
      const DPlusPermutation: any = {};
      // Objet pour stocker les valeurs de D- pour cette permutation
      const DMinusPermutation: any = {};
      // Objet pour stocker les valeurs de C+ pour cette permutation
      const CPlusPermutation: any = {};
      // Objet pour stocker les valeurs de C- pour cette permutation

      // For each criterion
      for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
        weightedNormalizedDecisionMatrixIteration[critereIndex.toString()] = {};

        // For each sub-criterion
        for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
          weightedNormalizedDecisionMatrixIteration[critereIndex.toString()][sousCritereIndex.toString()] = {};

          // For each alternative
          let AStarSubCriterion = 0; // Initialise A* pour ce sous-critère à zéro
          let AMinusSubCriterion = Infinity; // Initialise A- pour ce sous-critère à l'infini

          for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
            ///////////////////////////////////////////
            const altName = this.alternative[alternativeIndex];
            // Vérifier si l'alternative n'est pas déjà dans le tableau alternativeNames
            if (!this.alternativeNames.includes(altName)) {
              this.alternativeNames.push(altName);
              console.log('ROOOOAAAAA :', this.alternativeNames);
            }
            //////////////////////////////////////////
            weightedNormalizedDecisionMatrixIteration[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()] = {
              lower: 0,
              mid: 0,
              upper: 0
            };

            // Retrieve c* and a-
            const cStar = this.cStar[critereIndex.toString()][sousCritereIndex.toString()];
            const aMinus = this.aMinus[critereIndex.toString()][sousCritereIndex.toString()];

            // Retrieve factor values of the alternative
            const factorValues = this.facteuralternative[critereIndex][sousCritereIndex][alternativeIndex].split(',').map(Number);

            // Retrieve weights of all sub-criteria from permutations
            const weights = this.permutations[p];

            // Retrieve weight of the sub-criterion for this alternative
            const weight = parseFloat(weights[(critereIndex * this.n[critereIndex]) + sousCritereIndex]);

            // Calculate weighted normalized values based on the type of criterion
            let weightedNormalizedValue: [number, number, number];
            if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'beneficial') {
              weightedNormalizedValue = [
                (factorValues[0] / cStar) * weight,
                (factorValues[1] / cStar) * weight,
                (factorValues[2] / cStar) * weight
              ];
            } else if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'cost') {
              weightedNormalizedValue = [
                (aMinus / factorValues[2]) * weight,
                (aMinus / factorValues[1]) * weight,
                (aMinus / factorValues[0]) * weight
              ];
            }

            // Assign the weighted normalized value to the matrix
            weightedNormalizedDecisionMatrixIteration[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()] = {
              lower: weightedNormalizedValue[0],
              mid: weightedNormalizedValue[1],
              upper: weightedNormalizedValue[2]
            };

            // Update A* for this sub-criterion with the maximum upper value
            AStarSubCriterion = Math.max(AStarSubCriterion, weightedNormalizedValue[2]);

            // Update A- for this sub-criterion with the minimum lower value
            AMinusSubCriterion = Math.min(AMinusSubCriterion, weightedNormalizedValue[0]);
          }

          // Store the maximum upper value (A*) for this sub-criterion
          AStarPermutation[critereIndex.toString()] = AStarPermutation[critereIndex.toString()] || {};
          AStarPermutation[critereIndex.toString()][sousCritereIndex.toString()] = AStarSubCriterion;

          // Store the minimum lower value (A-) for this sub-criterion
          AMinusPermutation[critereIndex.toString()] = AMinusPermutation[critereIndex.toString()] || {};
          AMinusPermutation[critereIndex.toString()][sousCritereIndex.toString()] = AMinusSubCriterion;
        }
      }

      // Store A* for this permutation
      AStar.push(AStarPermutation);

      // Store A- for this permutation
      AMinus.push(AMinusPermutation);

      // Calculate D+ and D- for each alternative in this permutation
      const DPlusIteration: any = {};
      const DMinusIteration: any = {};
      for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
        let sumOfSquaresPlus = 0;
        let sumOfSquaresMinus = 0;
        for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
          for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
            const aStar = AStarPermutation[critereIndex.toString()][sousCritereIndex.toString()];
            const aMinus = AMinusPermutation[critereIndex.toString()][sousCritereIndex.toString()];
            const weightedNormalizedValue = weightedNormalizedDecisionMatrixIteration[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()];

            sumOfSquaresPlus += (Math.pow(weightedNormalizedValue.lower - aStar, 2)
              + Math.pow(weightedNormalizedValue.mid - aStar, 2)
              + Math.pow(weightedNormalizedValue.upper - aStar, 2)) / 3;

            sumOfSquaresMinus += (Math.pow(weightedNormalizedValue.lower - aMinus, 2)
              + Math.pow(weightedNormalizedValue.mid - aMinus, 2)
              + Math.pow(weightedNormalizedValue.upper - aMinus, 2)) / 3;
          }
        }
        DPlusIteration[alternativeIndex.toString()] = Math.sqrt(sumOfSquaresPlus);
        DMinusIteration[alternativeIndex.toString()] = Math.sqrt(sumOfSquaresMinus);

        // Calculate C+ and C- for this alternative
        const CPlusValue = DMinusIteration[alternativeIndex.toString()] / (DPlusIteration[alternativeIndex.toString()] + DMinusIteration[alternativeIndex.toString()]);

        // Store C+ and C- values
        CPlusPermutation[alternativeIndex.toString()] = CPlusValue;
      }
      DPlus.push(DPlusIteration);
      DMinus.push(DMinusIteration);
      //this.CPlus.push(CPlusPermutation);
      this.CPlus.push(Object.values(CPlusPermutation).map(Number));



      // Calculate ranks for this permutation based on C+ values
      const permutationRanks: number[] = [];
      const sortedIndices = Object.keys(CPlusPermutation).sort((a, b) => CPlusPermutation[b] - CPlusPermutation[a]);
      for (let i = 0; i < sortedIndices.length; i++) {
        permutationRanks.push(parseInt(sortedIndices[i]) + 1);
      }
      this.ranksRoa.push(permutationRanks);

      // Ajouter la weighted normalized decision matrix de cette itération au tableau
      weightedNormalizedDecisionMatrices.push(weightedNormalizedDecisionMatrixIteration);
    }

    // Affichage du tableau contenant les weighted normalized decision matrices pour chaque itération
    console.log("Weighted Normalized Decision Matrices:");
    console.log(weightedNormalizedDecisionMatrices);

    console.log('Alternative Names : ', this.alternativeNames);


    // Affichage des valeurs de A* pour chaque permutation
    console.log("A* values for each permutation:", AStar);

    // Affichage des valeurs de A- pour chaque permutation
    console.log("A- values for each permutation:", AMinus);

    // Affichage des valeurs de D+ pour chaque permutation et chaque alternative
    console.log("D+ values for each permutation and each alternative:", DPlus);

    // Affichage des valeurs de D- pour chaque permutation et chaque alternative
    console.log("D- values for each permutation and each alternative:", DMinus);

    // Affichage des valeurs de C+ pour chaque permutation et chaque alternative
    console.log("C+ values for each permutation and each alternative:", this.CPlus);

    // Affichage des rangs de chaque alternative dans chaque permutation
    console.log("Ranks for each alternative in each permutation:", this.ranksRoa);

    // Affichage des valeurs de C- pour chaque permutation et chaque alternative
  }


  getAlternativeNames(permIndex: number, ranksRoa: number[]): string[] {
    const alternativeNamesWithRanks = ranksRoa.map((rank, index) => ({ name: this.alternativeNames[index], rank }));
    alternativeNamesWithRanks.sort((a, b) => a.rank - b.rank);
    return alternativeNamesWithRanks.map(item => item.name); // Retourner seulement les noms des alternatives
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
        this.ranksRoa.forEach((rankArray, permutationIndex) => {
            rankArray.forEach((rank, altIndex) => {
                const alt = altIndex;
                const line = rank; // La ligne évolue en fonction du classement de l'alternative
                const color = d3.schemeCategory10[altIndex]; // Couleur différente pour chaque alternative
                transformedData.push({ alt, line, color, perm: permutationIndex });

                // Suivre les changements de rang pour chaque alternative
                if (permutationIndex > 0 && rank !== this.ranksRoa[permutationIndex - 1][altIndex]) {
                    rankChanges[alt].push(permutationIndex); // Ajouter l'index de la permutation au changement de rang
                }
            });
        });

        // Calculer le maximum des rangs pour définir le domaine de l'axe y
        const maxRank = this.ranksRoa.reduce((acc, rankArray) => {
            const maxInArray = Math.max(...rankArray);
            return maxInArray > acc ? maxInArray : acc;
        }, 0);

        const x = d3.scaleLinear()
            .domain([0, this.ranksRoa.length - 1])
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
            .data(this.ranksRoa[0]) // Utiliser une seule permutation pour déterminer les lignes
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
            .call(d3.axisBottom(x).ticks(this.ranksRoa.length));

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
  //////////////////////////////////////////////////////////////////////////////////////////


  showALternatives() {
    this.showalterINputsAlternative = true;


  }

  showetap10() {
    this.openNext();
    this.showtap10 = true;
   

  }

  showetap7() {
    this.showtab7 = true;
    console.log("ALternatives : ----")
    console.log(this.alternative)

    this.addAlternatives()
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


  xx(deviceValue: any, i: number, ii: number, j: number) {

    console.log(deviceValue.value);

    this.facteuralternative[i][ii][j] = deviceValue.value;
console.log('CHHHHHHHHHHGGGGGRRRRRRRR : ',this.facteuralternative[i][ii][j] );

  }
  settrue(j: number, i: number): void {
    if (!this.benefCost[j]) {
      this.benefCost[j] = {};
    }
    this.benefCost[j][i] = 'beneficial';
  }

  setfalse(j: number, i: number): void {
    if (!this.benefCost[j]) {
      this.benefCost[j] = {};
    }
    this.benefCost[j][i] = 'cost';
  }

  showbenfits() {
    console.log(this.benefCost);
  }

  show() {
    console.log(this.facteuralternative);
    this.benefCost = {};
    for (let j = 0; j < this.numbre; j++) {
      this.benefCost[j] = {};
      for (let i = 0; i < this.n[j]; i++) {
        this.benefCost[j][i] = 'cost';
      }
    }
  }

  cStar: { [key: string]: { [key: string]: number } } = {};
  aMinus: { [key: string]: { [key: string]: number } } = {};
  // Fonction pour calculer c* et a-
  calculateCStarAndAMinus() {
    for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
      this.cStar[critereIndex.toString()] = {};
      this.aMinus[critereIndex.toString()] = {};

      for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
        this.cStar[critereIndex.toString()][sousCritereIndex.toString()] = -Infinity;
        this.aMinus[critereIndex.toString()][sousCritereIndex.toString()] = Infinity;

        if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'beneficial') {
          let maxUpperBound = -Infinity;
          for (let k = 0; k < this.numbreAlternative; k++) {
            let factorValues = this.facteuralternative[critereIndex][sousCritereIndex][k].split(',').map(Number);
            maxUpperBound = Math.max(maxUpperBound, factorValues[2]);
          }
          this.cStar[critereIndex.toString()][sousCritereIndex.toString()] = maxUpperBound;
        } else if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'cost') {
          let minLowerBound = Infinity;
          for (let k = 0; k < this.numbreAlternative; k++) {
            let factorValues = this.facteuralternative[critereIndex][sousCritereIndex][k].split(',').map(Number);
            minLowerBound = Math.min(minLowerBound, factorValues[0]);
          }
          this.aMinus[critereIndex.toString()][sousCritereIndex.toString()] = minLowerBound;
        }
      }
    }

    console.log("c*:", this.cStar);
    console.log("a-:", this.aMinus);
  }

  calculateDecisionMatrix() {
    // Initialiser la matrice de décision normalisée
    let decisionMatrix: { [key: string]: { [key: string]: { [key: string]: { lower: number, mid: number, upper: number } } } } = {};

    // Parcourir chaque critère
    for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
      decisionMatrix[critereIndex.toString()] = {};

      // Parcourir chaque sous-critère
      for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
        decisionMatrix[critereIndex.toString()][sousCritereIndex.toString()] = {};

        // Récupérer c* et a-
        const cStar = this.cStar[critereIndex.toString()][sousCritereIndex.toString()];
        const aMinus = this.aMinus[critereIndex.toString()][sousCritereIndex.toString()];

        // Parcourir chaque alternative
        for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
          // Récupérer les valeurs de facteur de l'alternative
          const factorValues = this.facteuralternative[critereIndex][sousCritereIndex][alternativeIndex].split(',').map(Number);

          // Calculer la valeur normalisée en fonction du type de critère
          let normalizedValue: [number, number, number];
          if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'beneficial') {
            normalizedValue = [
              factorValues[0] / cStar,
              factorValues[1] / cStar,
              factorValues[2] / cStar
            ];
          } else if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'cost') {
            normalizedValue = [
              aMinus / factorValues[2],
              aMinus / factorValues[1],
              aMinus / factorValues[0]
            ];
          }

          // Assigner la valeur normalisée à la matrice de décision
          decisionMatrix[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()] = {
            lower: normalizedValue[0],
            mid: normalizedValue[1],
            upper: normalizedValue[2]
          };
        }
      }
    }

    // Afficher la matrice de décision normalisée
    console.log("Decision Matrix:", decisionMatrix);
    // Appel de la fonction calculateWeightedNormalizedMatrix en passant decisionMatrix comme argument
    this.calculateWeightedNormalizedDecisionMatrix();

  }
  weightedNormalizedDecisionMatrix: { [key: string]: { [key: string]: { [key: string]: { lower: number, mid: number, upper: number } } } } = {};

  calculateWeightedNormalizedDecisionMatrix() {
    // Initialize the matrix to store the weighted normalized decision matrix
    this.weightedNormalizedDecisionMatrix = {};

    // For each criterion
    for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
      this.weightedNormalizedDecisionMatrix[critereIndex.toString()] = {};

      // For each sub-criterion
      for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
        this.weightedNormalizedDecisionMatrix[critereIndex.toString()][sousCritereIndex.toString()] = {};

        // For each alternative
        for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
          this.weightedNormalizedDecisionMatrix[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()] = {
            lower: 0,
            mid: 0,
            upper: 0
          };

          // Retrieve c* and a-
          const cStar = this.cStar[critereIndex.toString()][sousCritereIndex.toString()];
          const aMinus = this.aMinus[critereIndex.toString()][sousCritereIndex.toString()];

          // Retrieve factor values of the alternative
          const factorValues = this.facteuralternative[critereIndex][sousCritereIndex][alternativeIndex].split(',').map(Number);

          // Retrieve weight of the sub-criterion
          const weight = parseFloat(this.etap3Poids[critereIndex.toString()][sousCritereIndex.toString()]);

          // Calculate weighted normalized values based on the type of criterion
          let weightedNormalizedValue: [number, number, number];
          if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'beneficial') {
            weightedNormalizedValue = [
              (factorValues[0] / cStar) * weight,
              (factorValues[1] / cStar) * weight,
              (factorValues[2] / cStar) * weight
            ];
          } else if (this.benefCost[critereIndex] && this.benefCost[critereIndex][sousCritereIndex] === 'cost') {
            weightedNormalizedValue = [
              (aMinus / factorValues[2]) * weight,
              (aMinus / factorValues[1]) * weight,
              (aMinus / factorValues[0]) * weight
            ];
          }

          // Assign the weighted normalized value to the matrix
          this.weightedNormalizedDecisionMatrix[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()] = {
            lower: weightedNormalizedValue[0],
            mid: weightedNormalizedValue[1],
            upper: weightedNormalizedValue[2]
          };
        }
      }
    }

    // Display the weighted normalized decision matrix
    console.log("Weighted Normalized Decision Matrix:", this.weightedNormalizedDecisionMatrix);
  }
  // Déclaration globale
  AStar: { [key: string]: { [key: string]: number } } = {};
  AMinus: { [key: string]: { [key: string]: number } } = {};

  calculateAStarAndAMinus() {
    // Réinitialisation des valeurs
    this.AStar = {};
    this.AMinus = {};

    // For each criterion
    for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
      this.AStar[critereIndex.toString()] = {};
      this.AMinus[critereIndex.toString()] = {};

      // For each sub-criterion
      for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
        this.AStar[critereIndex.toString()][sousCritereIndex.toString()] = -Infinity;
        this.AMinus[critereIndex.toString()][sousCritereIndex.toString()] = Infinity;

        // For each alternative
        for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
          // Get the weighted normalized value for the alternative
          const weightedNormalizedValue = this.weightedNormalizedDecisionMatrix[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()];

          // Update A* and A- values
          this.AStar[critereIndex.toString()][sousCritereIndex.toString()] = Math.max(this.AStar[critereIndex.toString()][sousCritereIndex.toString()], weightedNormalizedValue.upper);
          this.AMinus[critereIndex.toString()][sousCritereIndex.toString()] = Math.min(this.AMinus[critereIndex.toString()][sousCritereIndex.toString()], weightedNormalizedValue.lower);
        }
      }
    }

    // Display A* and A- values
    console.log("A*:", this.AStar);
    console.log("A-:", this.AMinus);
    // Calculate D+ and D- values
    this.calculateDPlusAndDMinus();
  }
  dMinus: number[] = [];
  dPlus: number[] = [];
  calculateDPlusAndDMinus() {
    // Initialize arrays to store D+ and D- values for each alternative
    this.dPlus = [];
    this.dMinus = [];

    // Loop through each alternative
    for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
      // Initialize variables to store the sum of squares for each alternative
      let sumOfSquaresPlus = 0;
      let sumOfSquaresMinus = 0;

      // Loop through each criterion and sub-criterion
      for (let critereIndex = 0; critereIndex < this.numbre; critereIndex++) {
        for (let sousCritereIndex = 0; sousCritereIndex < this.n[critereIndex]; sousCritereIndex++) {
          // Retrieve A* and A- values
          const aStar = this.AStar[critereIndex.toString()][sousCritereIndex.toString()];
          const aMinus = this.AMinus[critereIndex.toString()][sousCritereIndex.toString()];

          // Retrieve weighted normalized value for the current alternative
          const weightedNormalizedValue = this.weightedNormalizedDecisionMatrix[critereIndex.toString()][sousCritereIndex.toString()][alternativeIndex.toString()];

          // Calculate ((lower - A*)^2 + (mid - A*)^2 + (upper - A*)^2) / 3 for D+
          sumOfSquaresPlus += (Math.pow(weightedNormalizedValue.lower - aStar, 2)
            + Math.pow(weightedNormalizedValue.mid - aStar, 2)
            + Math.pow(weightedNormalizedValue.upper - aStar, 2)) / 3;

          // Calculate ((lower - A-)^2 + (mid - A-)^2 + (upper - A-)^2) / 3 for D-
          sumOfSquaresMinus += (Math.pow(weightedNormalizedValue.lower - aMinus, 2)
            + Math.pow(weightedNormalizedValue.mid - aMinus, 2)
            + Math.pow(weightedNormalizedValue.upper - aMinus, 2)) / 3;
        }
      }

      // Calculate square root of the sum of squares for each alternative and push to the arrays
      const dPlusValue = Math.pow(sumOfSquaresPlus, 0.5);
      const dMinusValue = Math.pow(sumOfSquaresMinus, 0.5);
      this.dPlus.push(dPlusValue);
      this.dMinus.push(dMinusValue);
    }

    // Display D+ and D- values
    console.log("D+ values:", this.dPlus);
    console.log("D- values:", this.dMinus);
    this.calculateCValues();
  }

  cValues: number[] = [];
  // Déclarez ranks comme une variable membre publique
  ranks: number[] = [];

  calculateCValues() {
    // Initialize arrays to store Ci values and ranks for each alternative
    let cValues: number[] = [];

    // Loop through each alternative
    for (let alternativeIndex = 0; alternativeIndex < this.numbreAlternative; alternativeIndex++) {
      // Calculate Ci for the current alternative
      const cValue = this.dMinus[alternativeIndex] / (this.dPlus[alternativeIndex] + this.dMinus[alternativeIndex]);

      // Push Ci value to the array
      cValues.push(cValue);
    }

    // Sort the array of Ci values in descending order and assign ranks
    let sortedIndices = cValues.map((v, i) => i).sort((a, b) => cValues[b] - cValues[a]);
    for (let i = 0; i < sortedIndices.length; i++) {
      this.ranks[sortedIndices[i]] = i + 1;
    }

    // Store Ci values and ranks in the component variables
    this.cValues = cValues;

    // Display Ci values and ranks
    console.log("Ci values:", this.cValues);
    console.log("Ranks:", this.ranks);
    this.setAlternativesCiRank();

  }



/////////////////////////////MOYENNE///////////////////////////////////////
calculateAndDisplayAverages(): void {
    if (!this.projetahp || !this.projetahp.id) {
      console.error('ID de projet invalide.');
      return;
  }

  this.ahpService.calculateAverageBounds().subscribe(
      (data: any[]) => {
          if (data && data.length > 0) {
              const facteurAlternatifExpert = {};

              const averagesMap = new Map<string, {
                  lowerBoundSum: number,
                  middleBoundSum: number,
                  upperBoundSum: number,
                  count: number
              }>();

              data.forEach((item) => {
                  if (item.alternative.projetAhp.id === this.projetahp.id && item.sousCriter.criter.projetAhp.id === this.projetahp.id) {
                      const key = item.sousCriter.id + '-' + item.alternative.id;
                      if (!averagesMap.has(key)) {
                          averagesMap.set(key, {
                              lowerBoundSum: item.facteur.lowerBound,
                              middleBoundSum: item.facteur.midlbound, // Utilisation de "midlbound" au lieu de "middleBound"
                              upperBoundSum: item.facteur.upperBound,
                              count: 1
                          });
                      } else {
                          const averageValues = averagesMap.get(key);
                          averageValues.lowerBoundSum += item.facteur.lowerBound;
                          averageValues.middleBoundSum += item.facteur.midlbound; // Utilisation de "midlbound" au lieu de "middleBound"
                          averageValues.upperBoundSum += item.facteur.upperBound;
                          averageValues.count++;
                      }

                      const critereIndex = item.sousCriter.criter.id.toString();
                      if (!facteurAlternatifExpert[critereIndex]) {
                          facteurAlternatifExpert[critereIndex] = {};
                      }

                      const sousCritereIndex = item.sousCriter.id.toString();
                      if (!facteurAlternatifExpert[critereIndex][sousCritereIndex]) {
                          facteurAlternatifExpert[critereIndex][sousCritereIndex] = {};
                      }

                      const alternativeIndex = item.alternative.id.toString();
                      const averageLowerBound = averagesMap.get(key).lowerBoundSum / averagesMap.get(key).count;
                      const averageMiddleBound = averagesMap.get(key).middleBoundSum / averagesMap.get(key).count;
                      const averageUpperBound = averagesMap.get(key).upperBoundSum / averagesMap.get(key).count;
                      facteurAlternatifExpert[critereIndex][sousCritereIndex][alternativeIndex] = `${averageLowerBound},${averageMiddleBound},${averageUpperBound}`;
                  }
              });

              console.log(facteurAlternatifExpert);

              let critereIndex = 0;
              for (const critereKey in facteurAlternatifExpert) {
                  if (facteurAlternatifExpert.hasOwnProperty(critereKey)) {
                      const critere = facteurAlternatifExpert[critereKey];
                      this.facteuralternative[critereIndex] = {};
              
                      let sousCritereIndex = 0;
                      for (const sousCritereKey in critere) {
                          if (critere.hasOwnProperty(sousCritereKey)) {
                              const sousCritere = critere[sousCritereKey];
                              this.facteuralternative[critereIndex][sousCritereIndex] = {};
              
                              let alternativeIndex = 0;
                              for (const alternativeKey in sousCritere) {
                                  if (sousCritere.hasOwnProperty(alternativeKey)) {
                                      this.facteuralternative[critereIndex][sousCritereIndex][alternativeIndex] = sousCritere[alternativeKey];
                                      alternativeIndex++;
                                  }
                              }
                              sousCritereIndex++;
                          }
                      }
                      critereIndex++;
                  }
              }
              averagesMap.forEach((value, key) => {
                  const [sousCriterId, alternativeId] = key.split('-');
                  const averageLowerBound = value.lowerBoundSum / value.count;
                  const averageMiddleBound = value.middleBoundSum / value.count;
                  const averageUpperBound = value.upperBoundSum / value.count;

                  console.log('Moyenne des lowerBound pour le sous-critère', sousCriterId, 'et l\'alternative', alternativeId, ':', averageLowerBound);
                  console.log('Moyenne des middleBound pour le sous-critère', sousCriterId, 'et l\'alternative', alternativeId, ':', averageMiddleBound);
                  console.log('Moyenne des upperBound pour le sous-critère', sousCriterId, 'et l\'alternative', alternativeId, ':', averageUpperBound);
              });

              console.log('HHHAAHHOOWWWAAAA',this.facteuralternative);


          } else {
              console.log('Aucune donnée disponible.');
          }
      },
      (error) => {
          console.error('Erreur lors de la récupération des données:', error);
      }
    );
}





///////////////////////////////////////////////////////////////////////////
  setAlternativesCiRank() {
    let promises = [];
    for (let jj = 0; jj < this.numbreAlternative; jj++) {
      const alternativeName = this.alternative[jj]; // Correction ici
      promises.push(
        new Promise((resolve, reject) => {
          this.ahpService.getAlternativeByName(alternativeName).subscribe(
            (alternative: any) => {
              if (alternative) {
                alternative.rank = this.ranks[jj];
                alternative.ci = this.cValues[jj];
                // Mettre à jour la valeur de ci
                this.ahpService.updateAlternativeRankCi(alternative.id, alternative).subscribe(
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


  //////////////////////////////////////////EXPERT////////////////////////////////////////////////////
  
  ExpertEmails: string[] = [];
  selectedExpertEmails: string[] = [];

fetchExpertEmails() {
  this.userService.getexpertEmails().subscribe(emails => {
    this.ExpertEmails = emails;
    // Initialiser le tableau selectedExpertEmails avec des valeurs par défaut
    this.selectedExpertEmails = new Array(this.numbreExpert).fill('');
  });
}

showExperts() {
  this.showExpertInputss = true;
}

showexpertsemails() {
  console.log("emails of experts : ", this.selectedExpertEmails);
}

updateExpert() {
  const projectId =  this.projetahp.id; // Remplacez ceci par l'id de votre projet actuel
  console.log("id du projet est :",this.projetahp.id);

  // Parcourir la liste des experts
  for (let expertEmail of this.selectedExpertEmails) {
      // Trouver l'expert par son email
      this.userService.findExpertByEmail(expertEmail).subscribe(expert => {
          if (expert) {
              // Mettre à jour le projet_id de l'expert avec l'id du projet actuel
              this.userService.updateProjectId(expert.id, projectId).subscribe(data => {
                  if (data) {
                      console.log('Expert with email ${expertEmail} updated successfully');
                  } else {
                      console.log('Failed to update expert with email ${expertEmail}');
                  }
              });
          } else {
              console.log('Expert with email ${expertEmail} not found');
          }
      });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////


  isLastMatrix(): boolean {
    return this.currentCriterionIndex === this.numbre - 1;
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



  addprojet() {
    this.projetahp.user = JSON.parse(sessionStorage.getItem("USER"))
    this.projetahp.name = this.nom;
    this.projetahp.methode = "fahpftopsis";

    this.projetahp.numbreCriters = this.numbre;
    this.projetahp.cr = this.CR.toFixed(3);
    this.projetahp.numbreAlternatives = this.numbreAlternative
    console.log(this.projetahp)

    this.ahpService.add(this.projetahp).subscribe(data => {
      this.projetahp = data
      console.log(this.projetahp)

    })
  }

  openNext() {
    this.index = (this.index === 14) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 14 : this.index - 1;
  }


  showsous() {
    this.showSousCriter = true;

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


  /////////////////////////////////////////////////////////////////////////

  sendInvitation() {
    if (this.selectedExpertEmails.length > 0) {
      // Récupérer le nom du projet actuel
      const projectName = this.nom; // Assurez-vous que this.nom contient le nom du projet
  
      // Personnaliser le message d'invitation avec le nom du projet
      const message = ` \n\nEn tant qu'expert (e) dans votre domaine, votre expertise est précieuse pour nous. Nous vous invitons cordialement à rejoindre notre plateforme d'aide à la décision FAHP/FTOPSIS. Votre contribution nous aidera à évaluer et à sélectionner les meilleures options pour notre projet en cours, intitulé "${projectName}". Votre participation nous permettra de prendre des décisions éclairées et d'atteindre nos objectifs de manière efficace. Nous sommes impatients de vous accueillir sur notre plateforme et de bénéficier de vos précieuses idées et conseils.`;
  
      // Envoyer l'e-mail à chaque expert sélectionné
      this.selectedExpertEmails.forEach(expertEmail => {
        // Récupérer le nom d'utilisateur de l'expert à partir de son e-mail
        this.ahpService.getExpertUsernameByEmail(expertEmail).subscribe(
          expertUsername => {
            // Personnaliser le message d'invitation avec le nom d'utilisateur de l'expert
            const personalizedMessage = `Cher(e) ${expertUsername}, \n\n${message}`;
  
            // Envoyer l'e-mail
            this.ahpService.sendEmail([expertEmail], 'Invitation à la plateforme FAHP/FTOPSIS', personalizedMessage).subscribe(
              () => console.log(`Invitation envoyée à ${expertEmail}`),
              error => console.error(`Erreur lors de l envoi de l invitation à ${expertEmail} :`, error)
            );
          },
          error => console.error(`Erreur lors de la récupération du nom d utilisateur pour ${expertEmail} :`, error)
        );
      });
    } else {
      console.error('Aucun e-mail sélectionné.');
    }
  }

}
