import { Component } from '@angular/core'
import { Http } from '@angular/http'
import { CustformConstructor } from '../custform/custFormConst'
import { Router } from '@angular/router'
import { Config } from '../app/config.service'

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    public appoint: Appointments[];
    fileSelected: File;

    model = new CustformConstructor(0, '', '', '', '', '', '', '', '', '', '','', '', '', '', '',);
   
    constructor(private http: Http, public router: Router) {
        this.http.get(Config.url + 'appoint/').subscribe(res => { console.log(res.json());
           this.appoint = res.json().dataList as Appointments[];
        }, error => console.error(error));
    }

    edit(data:any){
        this.router.navigate(['/custform', data.id]);
    }

    pastAppoint(){
        this.http.get(Config.url + 'appoint/past').subscribe(res => { console.log(res.json());
            this.appoint = res.json().dataList as Appointments[];
         });
    }

    upcomAppoint(){
        this.http.get(Config.url + 'appoint/').subscribe(res => { console.log(res.json());
            this.appoint = res.json().dataList as Appointments[];
         });
    }

    onFileSelected(event: any){
        console.log(event);
        this.fileSelected = <File>event.target.files[0];
        const fd = new FormData();
        fd.append('image', this.fileSelected, this.fileSelected.name);
        this.http.post('', fd).subscribe(res => {console.log(res.json())
       

        });
    }
}

interface Appointments {
    id: number;
    userId: string;
    custFName: string;
    custName: string;
    street: string;
    city: string;
    state: string;
    zip: number;
    email: string;
    phone: string;
    appoint: string;
    modifiedBy: string;
}
