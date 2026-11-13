// Google Apps Script deployed as a Web App, executing as the workbook owner.
// Script property SHEET_ID identifies the private response spreadsheet.
// GET exposes only health; no endpoint returns survey responses.
function doGet() { return ContentService.createTextOutput(JSON.stringify({ok:true,service:'Exeter Terrain',version:1})).setMimeType(ContentService.MimeType.JSON); }
function doPost(e) {
 const out=x=>ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);
 const lock=LockService.getScriptLock();
 try {
  if(!e.postData||e.postData.contents.length>60000)return out({ok:false,error:'Payload size'});
  const d=JSON.parse(e.postData.contents),a=d.answers;
  if(!/^[a-f0-9-]{36}$/i.test(d.id)||!a||!['Vendeur','Consommateur'].includes(a.role)||!a.market||!a.ba||!/^\d{4}-\d{2}-\d{2}$/.test(a.date))return out({ok:false,error:'Invalid record'});
  if(a.role==='Vendeur'&&(!a.outlet||!['Oui','Non'].includes(a.vendorKnows)||(a.vendorKnows==='Oui'&&!['Oui','Non','Vendait auparavant'].includes(a.sells))||!a.trade||!['Oui','Non'].includes(a.contactConsent)||!['Oui','Non'].includes(a.willing)))return out({ok:false,error:'Incomplete vendor'});
  if(a.role==='Consommateur'&&(!['Oui','Non'].includes(a.knows)||!a.animation))return out({ok:false,error:'Incomplete consumer'});
  if(a.contactConsent!=='Oui')delete a.contact;
  if(a.contact&&!/^(?:\+?243|0)? ?\d{3}[ -]?\d{3}[ -]?\d{3,4}$/.test(a.contact))return out({ok:false,error:'Invalid phone'});
  if(a.role!=='Vendeur'||a.vendorKnows!=='Oui'||a.sells!=='Oui')delete a.products;
  if(a.products&&(!Array.isArray(a.products)||a.products.length>20||a.products.some(p=>!p.reference||!p.format)))return out({ok:false,error:'Invalid products'});
  const keys=['date','market','ba','role','outlet','trade','tradeOther','observed','contactConsent','contact','sells','duration','vendorKnows','notSelling','listing','listingOther','products','source','salesReason','stockout','stockoutDays','stockoutReason','supplier','supplyFrequency','supplyOther','leadTime','competitors','customerFeedback','demand','promotion','promotionType','promotionPeriod','promotionEffect','help','helpOther','willing','commitQty','commitFormat','commitOther','knows','discovery','discoveryOther','bought','usualProduct','usualFormat','usualFormatOther','frequency','units','trend','trendReason','lastPrice','currency','currencyOther','lastFormat','lastFormatOther','priceOpinion','likes','improvements','availability','alternative','animation','animationOther','marketOther','competitorsOther','competitorReasons','competitorDetails'];
  const labels=['Date entretien','Marché','Enquêteur / BA','Profil','Point de vente','Type commerce','Autre commerce','Produit observé','Accord contact','Contact vendeur','Commercialisation Exeter','Ancienneté Exeter','Connaissance vendeur','Pourquoi absent','Incitations référencement','Autre incitation','Détail par référence (JSON)','Source chiffres','Raisons évolution ventes','Rupture stock','Durée rupture (jours)','Raison rupture','Fournisseur','Fréquence approvisionnement','Autre fréquence','Délai livraison','Concurrents / prix / avantages','Avis clients','Demande client','Promotion passée','Type promotion','Période promotion','Effet promotion','Aides souhaitées','Autre aide','Participation activation','Quantité envisageable','Formats envisagés','Autre format envisagé','Connaissance consommateur','Découverte','Autre découverte','Achat 30 jours','Produit habituel','Format habituel','Autre format habituel','Fréquence achats','Unités par achat','Évolution achats','Raisons évolution achats','Dernier prix','Devise','Autre devise','Dernier format','Autre dernier format','Avis prix','Points appréciés','Améliorations','Disponibilité','Produit alternatif','Animation préférée','Autre animation','Autre marché','Autre concurrent','Avantages concurrents','Précisions concurrents'];
  const safe=v=>{if(v===undefined||v===null)return '';const s=typeof v==='object'?JSON.stringify(v):String(v);if(s.length>20000)throw Error('Cell too long');return /^[=+@\-\t\r]/.test(s)?"'"+s:s;};
  lock.waitLock(25000);
  const ss=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  let sheet=ss.getSheetByName('Réponses PWA');
  if(!sheet){sheet=ss.insertSheet('Réponses PWA');sheet.getRange(1,1,1,keys.length+3).setValues([['ID entretien','Horodatage réception','Horodatage appareil'].concat(labels)]).setBackground('#a80f28').setFontColor('#ffffff').setFontWeight('bold');sheet.setFrozenRows(1);}
  if(sheet.getMaxColumns()<keys.length+3)sheet.insertColumnsAfter(sheet.getMaxColumns(),keys.length+3-sheet.getMaxColumns());
  sheet.getRange(1,1,1,keys.length+3).setValues([['ID entretien','Horodatage réception','Horodatage appareil'].concat(labels)]).setBackground('#a80f28').setFontColor('#ffffff').setFontWeight('bold');
  if(sheet.getLastRow()>1&&sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(d.id).matchEntireCell(true).findNext())return out({ok:true,id:d.id,duplicate:true});
  sheet.appendRow([d.id,new Date(),safe(d.createdAt)].concat(keys.map(k=>safe(a[k]))));SpreadsheetApp.flush();
  return out({ok:true,id:d.id});
 }catch(err){return out({ok:false,error:'Enregistrement non confirmé'});}finally{if(lock.hasLock())lock.releaseLock();}
}
