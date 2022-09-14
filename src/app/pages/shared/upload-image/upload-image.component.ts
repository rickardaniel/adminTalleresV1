import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  public previewUrl : any;
  public imgperfil  : any;
  public images     : any;

  @Output() imgs = new EventEmitter<string>();
  @Output() mensaje = new EventEmitter<string>();


  constructor() { }

  ngOnInit(): void {
  }

  processFile(file: any) {
    console.log(file);
    
    if (file.target.files) {
      this.previewUrl = null;
      this.imgperfil  = file.target.files;
      this.imgs.emit(this.imgperfil[0]);
      this.preview();
    }
    this.mensaje.emit("Hey te estoy enviando un msj");
  }

    preview() {
      if (this.imgperfil[0].type) {
        var mimeType = this.imgperfil[0].type;
        if (mimeType.match(/image\/*/) == null) {
        return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(this.imgperfil[0]);
        reader.onload = (_event) => {
          this.previewUrl = reader.result;
          console.log('procesamiento',reader);
        };
    
        
      }
    }


}
