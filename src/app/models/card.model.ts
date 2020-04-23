export class Card {
  name;
  edition;
  avatar;
  quantity = 0;
  type;
  manaCost;
  png;


  constructor(name: string, edition: string, avatar: string, quantity: number, type: string, manaCost: string, png:string) {
    this.name = name;
    this.edition = edition;
    this.avatar = avatar;
    this.quantity = quantity;
    this.type = type;
    this.manaCost = manaCost;
    this.png = png;
    this.convertManaCost(this.manaCost);
  }

  convertManaCost(manaCost){
    this.manaCost = this.manaCost.split('{R}').join('<i class="mi mi-r mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{G}').join('<i class="mi mi-g mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{B}').join('<i class="mi mi-b mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{W}').join('<i class="mi mi-w mi-mana mi-shadow"></i>');

    this.manaCost = this.manaCost.split('{0}').join('<i class="mi mi-0 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{1}').join('<i class="mi mi-1 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{2}').join('<i class="mi mi-2 mi-mana mi-shadow"></i>');
    this.manaCost = this.manaCost.split('{3}').join('<i class="mi mi-3 mi-mana mi-shadow"></i>');
  }
}
