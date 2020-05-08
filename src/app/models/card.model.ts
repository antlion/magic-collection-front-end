export class Card {
  name;
  edition;
  avatar;
  quantity = 0;
  type;
  manaCost;
  png;
  inCollection:boolean = false
  quantityCollection: number = 0
  inWishList: boolean;
  quantityCollectionWishList: number = 0;


  constructor(name: string, edition: string, avatar: string, quantity: number, type: string, manaCost: string, png:string,
              inCollection = false, quantityCollection = 0) {
    this.name = name;
    this.edition = edition;
    this.avatar = avatar;
    this.quantity = quantity;
    this.type = type;
    this.manaCost = manaCost;
    this.png = png;
    this.inCollection = inCollection
    this.quantityCollection = quantityCollection

    this.convertManaCost(this.manaCost);
  }

  convertManaCost(manaCost){
    this.manaCost = this.manaCost.split('{R}').join('<i class="mi mi-r mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{G}').join('<i class="mi mi-g mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{B}').join('<i class="mi mi-b mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{W}').join('<i class="mi mi-w mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{U}').join('<i class="mi mi-u mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{W/B}').
    join('<span class="mi-split mi-shadow"><i class="mi mi-w"></i><i class="mi mi-b"></i></span>\n');
    this.manaCost = this.manaCost.split('{W/U}').
    join('<span class="mi-split mi-shadow"><i class="mi mi-w"></i><i class="mi mi-u"></i></span>\n');

    this.manaCost = this.manaCost.split('{0}').join('<i class="mi mi-0 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{1}').join('<i class="mi mi-1 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{2}').join('<i class="mi mi-2 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{3}').join('<i class="mi mi-3 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{4}').join('<i class="mi mi-4 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{5}').join('<i class="mi mi-5 mi-mana mi-shadow"></i>');


  }
}
