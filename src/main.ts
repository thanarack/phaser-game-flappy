import Phaser from 'phaser';
import HelloWorldScene from './scene/HelloWorldScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL js api
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: [HelloWorldScene],
};

export default new Phaser.Game(config);
