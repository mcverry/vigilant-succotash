
export class CatSpriteManager {
	private CAT_SPRITES = {
		"brown": {
			"cat_head": "brown-head.png",
			"cat_belly": "brown-belly.png",
			"cat_chest": "brown-chest.png",
			"cat_butt": "brown-butt.png",
			"cat_tail_0": "brown-tail-medium.png",
			"cat_tail_1": "brown-tail-medium.png",
			"cat_tail_2": "brown-tail-large.png",
			"cat_tail_3": "brown-tail-large.png",
			"cat_tail_4": "brown-tail-medium.png",
			"cat_tail_5": "brown-tail-medium.png",
			"cat_tail_6": "brown-tail-small.png",
			"cat_tail_7": "brown-tail-end.png",
			"cat_left_back_foot": "brown-left-back-foot.png",
			"cat_left_back_shin": "brown-left-back-shin.png",
			"cat_left_back_thigh": "brown-left-back-thigh.png",
			"cat_left_back_toe": "brown-left-back-toe.png",
			"cat_right_back_foot": "brown-right-back-foot.png",
			"cat_right_back_shin": "brown-right-back-shin.png",
			"cat_right_back_thigh": "brown-right-back-thigh.png",
			"cat_right_back_toe": "brown-right-back-toe.png",
			"cat_left_front_shin": "brown-left-front-shin.png",
			"cat_left_front_thigh": "brown-left-front-thigh.png",
			"cat_left_front_toe": "brown-left-front-toe.png",
			"cat_right_front_shin": "brown-right-front-shin.png",
			"cat_right_front_thigh": "brown-right-front-thigh.png",
			"cat_right_front_toe": "brown-right-front-toe.png"
		},
		"orange" : {
			"cat_head": "orange-head.png",
			"cat_belly": "orange-belly.png",
			"cat_chest": "orange-chest.png",
			"cat_butt": "orange-butt.png",
			"cat_tail_0": "orange-tail-medium-dark.png",
			"cat_tail_1": "orange-tail-medium-light.png",
			"cat_tail_2": "orange-tail-large-dark.png",
			"cat_tail_3": "orange-tail-large-light.png",
			"cat_tail_4": "orange-tail-medium-dark.png",
			"cat_tail_5": "orange-tail-medium-light.png",
			"cat_tail_6": "orange-tail-medium-dark.png",
			"cat_tail_7": "orange-tail-end.png",
			"cat_left_back_foot": "orange-left-back-foot.png",
			"cat_left_back_shin": "orange-left-back-shin.png",
			"cat_left_back_thigh": "orange-left-back-thigh.png",
			"cat_left_back_toe": "orange-back-toe.png",
			"cat_right_back_foot": "orange-right-back-foot.png",
			"cat_right_back_shin": "orange-right-back-shin.png",
			"cat_right_back_thigh": "orange-right-back-thigh.png",
			"cat_right_back_toe": "orange-back-toe.png",
			"cat_left_front_shin": "orange-left-front-shin.png",
			"cat_left_front_thigh": "orange-left-front-thigh.png",
			"cat_left_front_toe": "orange-front-toe.png",
			"cat_right_front_shin": "orange-right-front-shin.png",
			"cat_right_front_thigh": "orange-right-front-thigh.png",
			"cat_right_front_toe": "orange-front-toe.png"
		}
	};

	private game: Phaser.Game;

	public constructor(game: Phaser.Game) {
		this.game = game;
	}

	public loadSpritesForCat(catname:string): void {
		let cat = this.CAT_SPRITES[catname];
		for (let key in cat) {
			if (cat.hasOwnProperty(key)) {
				this.game.load.image(key, "cat-parts/" + cat[key]);
			}
		}
	}
}
