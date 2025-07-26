/* PesantrianPDF -- require: jquery and jspdf */
;function PesantrianPDF(){
this.outer=true;
this.init=function(){
  return this;
};
this.createPDF=function(id,out='data'){
  out=typeof out==='string'?out:'data';
  var form=document.querySelector(id),
  a4=[595.28,841.89]; /* a4 paper size: width and height */
  form.scrollTo(0,0);
  /* get canvas object */
  let getCanvas=html2canvas(form,{
    imageTimeout:2000,
    removeContainer:true,
    height:form.offsetHeight,
  });
  /* create pdf */
  getCanvas.then(function(canvas){
    var img=canvas.toDataURL("image/png"),
    doc=new jsPDF({
      unit:'px',
      format:'a4',
    });
    doc.addImage(img,'PNG',20,20);
    doc.save(out+'.pdf');
  });
};
return this.init();
};
