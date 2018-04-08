import { Component } from '@angular/core'
import { Http } from '@angular/http'
import { ProfileConst } from '../profile/profileConst'
import { Router } from '@angular/router'
import { Config } from '../app/config.service'

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../app/app.component.css']
})
export class ProfileComponent {
    isEdit: boolean;
    isUpt: boolean;
    coffee: boolean;    

    model = new ProfileConst(0, '', '', '', '', '', '', '', '', '', '', '');
 
    constructor(private http: Http, public router: Router){
        this.http.get(Config.url + "profile/").subscribe(res => { console.log(res.json());
            res.json().dataList.length > 0 ? this.isUpt = true : this.isUpt = false;
            if(res.json().dataList.length > 0){ this.model = res.json().dataList[0];}
        })
    }

    editProf(){
        this.isEdit = !this.isEdit;
    }

    onSubmit(){
        this.http.post(Config.url + "profile/", this.model).subscribe(res => {console.log(res)
            this.isEdit = false;
            this.isUpt = true;
        })
    }

    onEdit(){
        this.http.put(Config.url + "profile/" + this.model.id, this.model).subscribe(res => {console.log(res)
            this.isEdit = false;
        })
    }

    onDelete(){
        this.http.delete(Config.url + "profile/" + this.model.id).subscribe(res => {console.log(res)
            this.isEdit = false;
            this.isUpt = false;
            this.model = new ProfileConst(0, '', '', '', '', '', '', '', '', '', '', '');
        })
    }

    onCoffee(){
        this.coffee = !this.coffee
    }
}

