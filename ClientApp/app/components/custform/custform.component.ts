import { Component, OnInit } from '@angular/core'
import { Http } from '@angular/http'
import { CustformConstructor } from '../custform/custFormConst'
import { Router, ActivatedRoute } from '@angular/router'
import { Config } from '../app/config.service'

@Component({
    selector: 'custform',
    templateUrl: './custform.component.html',
    styleUrls: ['../app/app.component.css']
})
export class CustformComponent {
  id : number;
  isEdit: boolean;
  showGuide: boolean;

  constructor(private http: Http, public router: Router, private activeRoute:ActivatedRoute,){
  }

  model = new CustformConstructor(0, '', '', '', '', '', '', '', '', '', '','', '', '', '', '',);

  ngOnInit(): void {
      this.id = this.activeRoute.snapshot.params['id'];
      if (this.id > 0){this.http.get(Config.url+"appoint/byid/"+this.id).subscribe(res => {console.log(res.json()); 
          this.isEdit = true;
          this.model = res.json().data;
          let result = this.model.appoint.split("T");
          this.model.appointDate = result[0];
          this.model.appointTime = result[1];
      })
      } else {
        this.http.get(Config.url + "profile/").subscribe(res => { console.log(res.json());
          let comp = res.json().dataList[0];
          if (res.json().dataList.length > 0){
            this.model.compName = comp.compName;
            this.model.compEmail = comp.email;
          } else {
            this.showGuide = true;
          }
        })
      }
  }

    onSubmit(){
      this.model.state = this.model.state.toUpperCase();
      this.model.appoint = this.model.appointDate+"T"+this.model.appointTime;
      this.http.post(Config.url+"appoint/", this.model).subscribe(res => {
        this.router.navigate(['/home'])
      })
    }
    
    onEdit(){
      this.model.state = this.model.state.toUpperCase();
      this.model.appoint = this.model.appointDate+"T"+this.model.appointTime;
      this.http.put(Config.url+"appoint/"+this.model.id, this.model).subscribe(res => {
        this.router.navigate(['/home'])})
    }

    onDelete(){
      this.http.delete(Config.url+"appoint/"+this.model.id).subscribe(res => {
        this.router.navigate(['/home'])})
    }
}
