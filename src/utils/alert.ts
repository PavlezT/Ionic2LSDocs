import { AlertController } from 'ionic-angular';

export class Alert {
  constructor(public alertCtrl: AlertController) {
  }

  showAlert(title:string,subTitle:any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: JSON.stringify(subTitle),
      buttons: ['OK']
    });
    alert.present();
  }
}
