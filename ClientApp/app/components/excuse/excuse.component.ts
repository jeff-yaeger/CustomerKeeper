import { Component } from '@angular/core'
import { Http } from '@angular/http'
import { ExcuseConst } from './excuseConst'
import { Router } from '@angular/router'
import { Config } from '../app/config.service'

@Component({
    selector: 'excuse',
    templateUrl: './excuse.component.html',
    styleUrls: ['../app/app.component.css']
})
export class ExcuseComponent {
    model = new ExcuseConst('', '');
    isDone: boolean;

    constructor(private http: Http, public router: Router){
    }

    onExcuse(){
        this.http.get(Config.url+"excuse/").subscribe(res => { 
            this.model =  res.json();
        })
    }

    onSend(){
        this.isDone = true
    }
}