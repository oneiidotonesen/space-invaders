const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')



canvas.width = 1450
canvas.height = 733




function randomBetween(min, max) {
	return Math.random() * (max - min) + min
    }

let player = new Player()
let projectiles = []
let grids = []
let invaderProjectiles = []
let particles = []
let bombs = []
let powerUps = []

let keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
	over: false,
	active: true
}

let score = 0

function init() {
	 player = new Player()
 projectiles = []
 grids = []
 invaderProjectiles = []
 particles = []
 bombs = []
 powerUps = []
 score = 0
 scoreEl.innerHTML = 0

  keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

 frames = 0
 randomInterval = Math.floor(Math.random() * 500 + 500)
 game = {
	over: false,
	active: true
}

 score = 0

 for (let i = 0; i < 100; i++) {

					particles.push(
						new Particle({
						position: {
							x: Math.random() * canvas.width,
							y: Math.random() * canvas.height
						},
						velocity: {
							x: 0,
							y: 0.3
						},
						radius: Math.random() * 2,
						color: 'white'
					})

					)
	      }
}




function createParticles({object, color, fades}) {
	for (let i = 0; i < 15; i++) {

					particles.push(new Particle({
						position: {
							x: object.position.x + object.width / 2,
							y: object.position.y + object.height / 2
						},
						velocity: {
							x: (Math.random() - 0.5) * 3,
							y: (Math.random() - 0.5) * 1.5
						},
						radius: Math.random() * 3.5,
						color: color || 'green', 
						fades
					})

					)
	}
}
function createScoreLabel({score = 100, object}) {
	const scoreLabel = document.createElement('label')
							scoreLabel.innerHTML = score
							scoreLabel.style.position = 'absolute'
							scoreLabel.style.color = 'white'
							scoreLabel.style.top = object.position.y + 'px'
							scoreLabel.style.left = object.position.x + 'px'
							scoreLabel.style.userSelect = 'none'

							document.querySelector('#parentDiv').appendChild(scoreLabel)

							gsap.to(scoreLabel, {
								opacity: 0,
								y: -33,
								duration: 0.75,
								onComplete: () => {
									document.querySelector('#parentDiv').removeChild(scoreLabel)
								}
							})
}

function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		  rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
		  rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
			rectangle1.position.x <= rectangle2.position.x + rectangle2.width
	)
}

function endGame() {
	
	    audio.gameOver.play()
      //  Makes player disappear
			setTimeout(() => {
				player.opacity = 0
				game.over = true

			}, 0)
      // stops game altogether
			setTimeout(() => {
				game.active = false
				document.querySelector('#restartScreen').style.display = 'flex'
      }, 2000)
			
			
		    createParticles({
				object: player,
				color: 'red',
				fades: true
			})
}

let spawnBuffer = 500
let fps = 60
let fpsInterval = 1000 / fps
let msPrev = window.performance.now()
function animate() {
	if (!game.active) return
	requestAnimationFrame(animate)

  const msNow = window.performance.now()
  const elapsed = msNow - msPrev

  if (elapsed < 16.66) return

  msPrev = msNow - (elapsed % 16.66)

	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)



	for (let i = powerUps.length - 1; i >= 0; i--) {
		const powerUp = powerUps[i]

		if (powerUp.position.x - powerUp.radius >= canvas.width)
			powerUps.splice(i, 1)
		else powerUp.update ()
    }
  // spawn powerups
    if (frames % 600 === 0) {
		powerUps.push( new PowerUp({
	  position: {
	    x: 0,
	    y: Math.random() * 300 + 15
      },
      velocity: {
    	x: 5,
    	y: 0
      }
    })
    )
  }
   

    // spawn bombs
	if (frames % 200 === 0 && bombs.length < 3) {
		bombs.push(
			new Bomb({
	          position: {
		        x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
		        y: randomBetween(Bomb.radius, canvas.height - Bomb.radius)
	  },
	  velocity: {
		x: (Math.random() - 0.5 * 6),
		y: (Math.random() - 0.5 * 6)
	  }
    })
   )
  }

	for (let i = bombs.length - 1; i >= 0; i--) {
		const bomb = bombs[i]

		if (bomb.opacity <= 0) {
			bombs.splice(i,1)
		} else bomb.update()
	}

	player.update()

	for (let i = player.particles.length - 1; i >= 0; i--) {
		const particle = player.particles[i]
		particle.update()

		if (particle.opacity === 0) player.particles[i].splice(i,1)
	}


	particles.forEach((particle, i) => {

		if (particle.position.y - particle.radius >= canvas.height) {
			particle.position.x = Math.random() * canvas.width
			particle.position.y = -particle.radius
		}
		if (particle.opacity <= 0) {
			setTimeout (()=> {
				particles.splice(i, 1)

			}, 0)
			
		} else {
			particle.update()

		}
		
	})


	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (invaderProjectile.position.y + invaderProjectile.
			height >= canvas.height) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)

			}, 0)
		
		} else invaderProjectile.update()

		// projectile hits player

		if (
			rectangularCollision ({
				rectangle1: invaderProjectile,
				rectangle2: player

			})
   ) {
			invaderProjectiles.splice(index, 1)
			endGame()

		}
	})



    for (let i = projectiles.length -1; i >= 0; i--) {
    	const projectile = projectiles[i]

    for (let j = bombs.length - 1; j >= 0; j--) {
    	const bomb = bombs[j]

    	// if projectile touches bomb, remove projectile

    	if (
    		Math.hypot(
    			projectile.position.x - bomb.position.x,
    			projectile.position.y - bomb.position.y
    		) <
    		projectile.radius + bomb.radius && !bomb.active
    	) {
    		projectiles.splice(i, 1)
    		bomb.explode()
    	}
    }

    for (let j = powerUps.length - 1; j >= 0; j--) {
    	const powerUp = powerUps[j]

    	// if projectile touches bomb, remove projectile

    	if (
    		Math.hypot(
    			projectile.position.x - powerUp.position.x,
    			projectile.position.y - powerUp.position.y
    		) <
    		projectile.radius + powerUp.radius
    	) {
    		projectiles.splice(i, 1)
    		powerUps.splice(j, 1)
    		player.powerUp = 'MachineGun'
    		audio.powerUpStart.play()
    		setTimeout(() => {
    			player.powerUp = null
    			audio.powerUpEnd.play()
    		}, 3333)
    	}
    }
		if (projectile.position.y + projectile.radius <= 0) {
				projectiles.splice(i, 1)	
		} else {
			projectile.update()
		}	
    }

	grids.forEach((grid, gridIndex) => {
		grid.update()

		// spawn projectiles
		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
		}

      for (let i = grid.invaders.length - 1; i >= 0; i--) {
        	const invader = grid.invaders[i]
		      invader.update({velocity: grid.velocity})

		      if (!invader.position) continue

			for (let j = bombs.length - 1; j >= 0; j--) {
    	const bomb = bombs[j]

    	const invaderRadius = 15

    	// if bomb touches invader, remove invader

    	if (
    		Math.hypot(
    			invader.position.x - bomb.position.x,
    			invader.position.y - bomb.position.y
    		) <
    		invaderRadius + bomb.radius && bomb.active
    	) {
    		score += 50
    		scoreEl.innerHTML = score

    		grid.invaders.splice(i, 1)
    		createScoreLabel({
			   object: invader,
			   score: 50
			})

			createParticles({
				object: invader,
				fades: true
			})
    		
    	}
    }



            //projectiles hit enemy
			projectiles.forEach((projectile, j) => {
				if (
					projectile.position.y - projectile.radius <=
					invader.position.y + invader.height &&
					projectile.position.x + projectile.radius >=
					invader.position.x &&
					projectile.position.x - projectile.radius <=
					invader.position.x + invader.width &&
					projectile.position.y + projectile.radius >=
					invader.position.y
					) {

					
					setTimeout (() => {
						const invaderFound = grid.invaders.find((invader2
							) =>
								 invader2 === invader
							)
						const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)

						//remove invader and projectile

						if (invaderFound && projectileFound) {
							score += 100
							scoreEl.innerHTML = score

							//dynamic score labels
							createScoreLabel({
								object: invader
							})
							
							createParticles({
								object: invader,
								fades: true
							})
            // singular projectile hits an enemy 
            audio.enemydie.play()
						grid.invaders.splice(i, 1)
						projectiles.splice(j, 1)

						if (grid.invaders.length > 0) {
							const firstInvader = grid.invaders[0]
							const lastInvader = grid.invaders[grid.invaders.length -1]

							grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
							grid.position.x = firstInvader.position.x
						} else {
							grids.splice(gridIndex, 1)
						}
					}

					}, 0)
				}
			})

			// remove player if invader touch it
			if (
			rectangularCollision ({
				rectangle1: invader,
				rectangle2: player
			}) && !game.over
		) 
				endGame() 
    } // end looping over grid.invaders
	})

	if (keys.a.pressed && player.position.x >= 0) {
		player.velocity.x = -13
		player.rotation = -.13
	} else if (keys.d.pressed && player.position.x +player.width <= canvas.width) {
		player.velocity.x = 13
		player.rotation = .13

	}else {
		player.velocity.x = 0
		player.rotation = 0
	}


	// spawning enemies
	if (frames % randomInterval === 0) {
		spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer
		grids.push(new Grid())
		randomInterval = Math.floor(Math.random() * 500 + spawnBuffer)
		frames = 0
		spawnBuffer -= 100
	}

	// spawning powerups

	if (keys.space.pressed && player.powerUp === 'MachineGun' && frames % 2 === 0) {
    if (frames % 6 === 0) audio.SHOOT.play()
	  projectiles.push(
			new Projectile({
	          position: {
		       x: player.position.x + player.width / 2,
		       y: player.position.y
	          },
	          velocity: {
	           	x: 0,
	        	y: -13
              },
              color: 'gold'
      })
    )
}
	 

	frames++

}

  document.querySelector('#startButton').addEventListener('click', () => {
  audio.select.play()
	audio.backgroundMusic.play()
	document.querySelector('#startScreen').style.display = 'none'
	document.querySelector('#scoreContainer').style.display = 'block'
	init()
	animate()
  })

  document.querySelector('#restartButton').addEventListener('click', () => {
  audio.select.play()
	document.querySelector('#restartScreen').style.display = 'none'
	document.querySelector('#scoreContainer').style.display = 'block'
	init()
	animate()
  })


addEventListener('keydown', ({ key }) => {
	if (game.over) return
	switch (key) {
	case 'a':
		
		
		keys.a.pressed = true
		break
	case 'd':
		keys.d.pressed = true
		break
	case ' ':
		 
		 if (!keys.space.pressed) {

		if (player.powerUp !== 'MachineGun') {

      audio.SHOOT.play()
	  	projectiles.push(
			new Projectile({
	          position: {
		       x: player.position.x + player.width / 2,
		       y: player.position.y
	},
	          velocity: {
	           	x: 0,
	        	y: -13
  }
})
)       
}
}
keys.space.pressed = true
		break
	}
})
addEventListener('keyup', ({ key }) => {
	switch (key) {
	case 'a':
		
		
		keys.a.pressed = false
		break
	case 'd':
		
		keys.d.pressed = false
		break
	case ' ':
		
		keys.space.pressed = false
		break
	}
})