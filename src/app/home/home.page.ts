import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController,
    private afs: AngularFirestore
  ) { }

  public async login() {
    const result = await this.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
    if (!result) {
      return;
    }

    console.log('users/' + result.user.uid);
    const userInfo =
      await this.afs
        .doc('users/' + result.user.uid)
        .get().toPromise();

    if (!userInfo.exists) {
      const typedInfo = await this.askForUserInfo();
      await this.afs
        .doc('users/' + result.user.uid)
        .set(typedInfo);
    }

    this.router.navigateByUrl('/feed');
  }

  private async askForUserInfo() {
    const alert = await this.alertController.create({
      header: 'Seja bem vindo!',
      message: 'Primeiro precisamos de algumas informações sobre você',
      inputs: [
        { placeholder: 'Nome', name: 'name' },
        { placeholder: 'Usuário', name: 'user' }
      ],
      buttons: [
        'Salvar'
      ]
    });
    alert.present();
    const r = await alert.onDidDismiss()
    return r.data.values as { user: string, name: string };
  }

}
