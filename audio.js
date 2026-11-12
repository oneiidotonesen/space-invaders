Howler.volume(0.3)
const audio = {
	backgroundMusic: new Howl({
		src: './audio/s3rlbackgroundmusic.mp3',
		loop: true,
		volume: 0.01,
		
	}), 
	bomb: new Howl({
		src: './audio/bomb.wav',
		volume: 0.3
	}),
	powerUpStart: new Howl({
		src: './audio/powerUp.wav',
		volume: 0.5
	}),
	powerUpEnd: new Howl({
		src: './audio/powerupend.wav',
		volume: 0.5
	}),
	invadershoot: new Howl({
		src: './audio/invadershoot.wav',
		volume: 0.3
	}),
	enemydie: new Howl({
		src: './audio/enemydie1.wav',
		volume: 0.1
		
	}),
	gameOver: new Howl({
		src: './audio/NOOB.wav',
		volume: 0.3
		
	}),
	select: new Howl({
		src: './audio/SELECT2.wav',
		volume: 0.3
		
	}),
		SHOOT: new Howl({
		src: './audio/bluejellyshoot2.wav',
		volume: 0.4
		
	})

}
