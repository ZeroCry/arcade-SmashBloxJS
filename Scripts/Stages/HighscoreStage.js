﻿//! require "BaseStage.js"

HighscoreEntry = function(rank, highscore)
{
	this.rank = rank;
	this.highscore = highscore;

	this.rankText = null;
	this.nameText = null;
	this.scoreText = null;

	this.getSwatch = function()
	{
		return this.rankText.swatch;
	}

	this.setSwatch = function(swatch)
	{
		this.rankText.swatch = swatch;
		this.nameText.swatch = swatch;
		this.scoreText.swatch = swatch;
	}
}

HighscoreEntry.prototype.onLoadGraphics = function()
{
	var font = graphics.getImage("font");
	var swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

	var width = graphics.width * 0.6;

	this.localBounds = new RectF(0, 0, width, font.height / 16);

	this.rankText = new Text(font, swatch);
	this.rankText.value = this.rank;

	this.add(this.rankText, Vector2i.UNIT_X.mul(3 * this.rankText.charSize.x - this.rankText.width).div(2));

	this.nameText = this.add(new Text(font, swatch), Vector2i.UNIT_X.mul(5 * this.rankText.charSize.x));
	this.nameText.value = this.highscore.initials;

	this.scoreText = new Text(font, swatch);
	this.scoreText.value = this.highscore.score;

	this.add(this.scoreText, Vector2i.UNIT_X.mul(Math.floor(width - this.scoreText.width)));
}

HighscoreStage = function(demo, highscore)
{
	this.highscore = highscore;

	this.titleSprite = null;

	this.entries = [];
	this.newEntry = null;

	this.nextSwatchTime = 0;

	this.onSwatchChanged = function(swatch)
	{
		this.title.swatch = swatch;

		if (this.newEntry)
		{
			this.newEntry.swatch = swatch;
		}
	}

	this.flashSwatches = function()
	{
		if (game.time - this.nextSwatchTime > 1.0 / 16.0)
		{
			this.nextSwatch();
			this.nextSwatchTime = game.time;
		}
	}

	this.findNewEntry = function()
	{
		for (var i = 0; i < this.entries.length; ++i)
		{
			if (this.entries[i].highscore.Equals(this.highscore))
			{
				this.newEntry = this.entries[i];

				break;
			}
		}
	}
}

HighscoreStage.prototype = new BaseStage();

HighscoreStage.prototype.onEnter = function()
{
	graphics.setClearColor(13);

	var titleImage = graphics.getImage("highscores");

	this.title = this.add(new Sprite(titleImage, this.getCurrentSwatch()), 0);
	this.title.x = (graphics.width - titleImage.width) / 2;
	this.title.y = graphics.height - titleImage.height - 4;

	var scoreCount = 10;

	for (var i = 0; i < scoreCount; ++i)
	{
		if (i >= game.highscoreCount) break;

		var highscoreEntry = this.add(new HighscoreEntry(i + 1, game.getHighscore(i)));
		highscoreEntry.position = new Vector2f(graphics.width * 0.2, graphics.height - 20 - (i + 1) * 12);

		this.entries.push(highscoreEntry);
	}

	if (this.highscore)
	{
		this.findNewEntry();
	}
}

HighscoreStage.prototype.onUpdate = function()
{
	this.flashSwatches();

	if (controls.a.justPressed || controls.start.justPressed)
	{
		game.reset();
	}
}