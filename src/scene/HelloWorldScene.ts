import Phaser from 'phaser';

interface PipesChildrenObject extends Phaser.GameObjects.GameObject {
  x?: number;
}

export default class HelloWorldScene extends Phaser.Scene {
  birdGravity: number = 400;
  birdVelocity: number = 200;
  flapVelocity: number = 300;
  initialPosition = { x: 0, y: 0 };
  totalDelta: number = 0;
  bird?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  pipeVerticalDistanceRange: number[] = [150, 250];
  pipeHorizontalDistanceRange: number[] = [300, 450];
  pipeToRender: number = 5;
  pipeHorizontalDistance: number = 0;
  pipes?: Phaser.Physics.Arcade.Group;

  constructor() {
    // Define the scene name.
    super('hello-world');
  }

  preload() {
    // Load resources
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }

  create() {
    // Get width and height from config
    const w = <number>this.game.config.width;
    const h = <number>this.game.config.height;

    // Added sky background into screen and set position origin to 0,0
    this.add.image(0, 0, 'sky').setOrigin(0);

    // Added bird into screen add physics and set position middle and origin position to 0,0. and position bird is 1/10 width.
    this.initialPosition = { x: w * 0.1, y: h / 2 };
    this.bird = this.physics.add
      .sprite(this.initialPosition.x, this.initialPosition.y, 'bird')
      .setOrigin(0);

    // Added gravity to bird
    this.bird.body.gravity.y = this.birdGravity;

    // Crated pipe group
    this.pipes = this.physics.add.group({ name: 'pipes' });

    // Create multiple pipe
    for (let i = 0; i < this.pipeToRender; i++) {
      // Added upper pipe into screen
      const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);

      // Added bottom pipe into screen
      const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0);

      // Set position to upper and lower pipe
      this.placePipe(upperPipe, lowerPipe);
    }

    // Move all pipes in group to left.
    this.pipes.setVelocityX(-200);

    // Added controller.
    this.input.on('pointerdown', this.flap.bind(this));
    this.input.keyboard.on('keydown-SPACE', this.flap.bind(this));
  }

  // Call every frame -> 60fps
  // 60 time per second
  // 60 * 16ms = 1000ms
  update(time: number, delta: number) {
    // t0 = 0px/s
    // t1 = 200px/s
    // t2 = 400px/s
    // this.totalDelta += delta;
    // 1000 = 1 second
    // if (this.totalDelta < 1000) return;
    // console.log(this.bird.body.velocity.y);
    // this.totalDelta = 0;
    // this.birdMove();

    this.resetPlayerPosition();
    this.recyclePipes();
  }

  // Recreate pipes
  recyclePipes() {
    const tempPipes = <Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>[];
    const pipes = <Phaser.Physics.Arcade.Group>this.pipes;
    pipes.getChildren().forEach((pipe: any) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(
            tempPipes[tempPipes.length - 2],
            tempPipes[tempPipes.length - 1]
          );
        }
      }
    });
  }

  birdMove() {
    const player = <Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>this.bird;
    // If bird velocity is same or larger than the width of the canvas go back to the left
    // If bird velocity is smaller or equal to 0 then move back to the right
    if (player.x >= +this.game.config.width - +player.width) {
      player.body.velocity.x = -this.birdVelocity;
    } else if (player.x <= 0) {
      player.body.velocity.x = this.birdVelocity;
    }
  }

  flap() {
    const player = <Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>this.bird;
    player.body.velocity.y = -this.flapVelocity;
  }

  // if bird y position is small than 0 or greater then heigh of the canvas
  // then alert "you have lost"
  resetPlayerPosition() {
    const player = <Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>this.bird;
    if (player.y > +this.game.config.height || player.y < -player.height) {
      player.y = this.initialPosition.y;
      player.x = this.initialPosition.x;
      player.body.velocity.y = 0;
    }
  }

  placePipe(
    upperPipe: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    lowerPipe: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
    const rightMostX = this.getRightMostPipe();

    // Setup pipe vertical distance, Random pipe distance between upper pipe and bottom pipe
    const pipeVerticalDistance = Phaser.Math.Between(
      this.pipeVerticalDistanceRange[0],
      this.pipeVerticalDistanceRange[1]
    );

    // Random position of upper pipe
    const gameConfigHeight = <number>this.game.config.height;
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      gameConfigHeight - 20 - pipeVerticalDistance
    );

    // Setup pipe horizontal distance, Random pipe distance between upper pipe and bottom pipe
    const pipeHorizontalDistance = Phaser.Math.Between(
      this.pipeHorizontalDistanceRange[0],
      this.pipeHorizontalDistanceRange[1]
    );

    // Set position to upper pipe
    upperPipe.x = rightMostX + pipeHorizontalDistance;
    upperPipe.y = pipeVerticalPosition;

    // Set position to lower pipe
    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeVerticalDistance;
  }

  // Get max x of pipe group
  getRightMostPipe() {
    let rightMostX = 0;

    // if (!this.pipes) return rightMostX;
    const pipes = <Phaser.Physics.Arcade.Group>this.pipes;

    // Get x from last object in group and find max value
    pipes.getChildren().forEach((pipe: PipesChildrenObject) => {
      rightMostX = Math.max(pipe.x || 0, rightMostX);
    });

    return rightMostX;
  }
}
