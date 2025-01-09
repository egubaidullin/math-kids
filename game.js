import Phaser from 'phaser';

    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
        this.currentProblem = null;
        this.score = 0;
        this.difficulty = 'easy';
      }

      preload() {
        console.log('Preload started');
        // Load assets from CDN
        this.load.image('sad', 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f61e.png');
        this.load.image('star', 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2b50.png');
        this.load.image('heart', 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png');
        console.log('Preload finished');
      }

      create() {
        console.log('Create started');
        // White background
        this.cameras.main.setBackgroundColor('#ffffff');

        // Check if assets are loaded
        if (!this.textures.exists('sad')) {
          console.error('Asset "sad" not loaded!');
        }
        if (!this.textures.exists('star')) {
          console.error('Asset "star" not loaded!');
        }
        if (!this.textures.exists('heart')) {
            console.error('Asset "heart" not loaded!');
        }

        // Difficulty buttons
        this.createDifficultyButtons();

        // Score display
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
          fontSize: '32px',
          fill: '#333',
          fontFamily: 'Comic Sans MS'
        });

        // Problem display
        this.problemText = this.add.text(400, 200, '', {
          fontSize: '64px',
          fill: '#333',
          fontFamily: 'Comic Sans MS'
        }).setOrigin(0.5);

        // Answer buttons
        this.answerButtons = [];
        const buttonPositions = [
          { x: 200, y: 400 },
          { x: 400, y: 400 },
          { x: 600, y: 400 }
        ];

        buttonPositions.forEach((pos, index) => {
          const button = this.add.circle(pos.x, pos.y, 50, 0x00bcd4)
            .setInteractive()
            .on('pointerover', () => this.buttonHover(button))
            .on('pointerout', () => this.buttonOut(button))
            .on('pointerdown', () => this.checkAnswer(index));
          
          const buttonText = this.add.text(pos.x, pos.y, '', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Comic Sans MS'
          }).setOrigin(0.5);

          this.answerButtons.push({ button, text: buttonText });
        });

        // Start first problem
        this.generateProblem();
        console.log('Create finished');
      }

      createDifficultyButtons() {
        const difficulties = [
          { text: 'Easy', value: 'easy', color: 0x00ff00 },
          { text: 'Medium', value: 'medium', color: 0xffa500 },
          { text: 'Hard', value: 'hard', color: 0xff0000 }
        ];

        const buttonSize = 80;
        const padding = 10;
        const startX = 800 - (buttonSize + padding) * difficulties.length;

        difficulties.forEach((diff, index) => {
          const button = this.add.rectangle(
            startX + (buttonSize + padding) * index, 
            40, 
            buttonSize, 
            buttonSize, 
            diff.color
          )
            .setInteractive()
            .on('pointerover', () => this.buttonHover(button))
            .on('pointerout', () => this.buttonOut(button))
            .on('pointerdown', () => {
              this.difficulty = diff.value;
              this.generateProblem();
            });
          
          this.add.text(button.x, button.y, diff.text[0], {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Comic Sans MS'
          }).setOrigin(0.5);
        });
      }

      buttonHover(button) {
        this.tweens.add({
          targets: button,
          scale: 1.1,
          duration: 100,
          ease: 'Power2'
        });
      }

      buttonOut(button) {
        this.tweens.add({
          targets: button,
          scale: 1,
          duration: 100,
          ease: 'Power2'
        });
      }

      generateProblem() {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2;

        switch(operation) {
          case '+':
            num1 = Phaser.Math.Between(1, 10);
            num2 = Phaser.Math.Between(1, 10);
            break;
          case '-':
            num1 = Phaser.Math.Between(5, 15);
            num2 = Phaser.Math.Between(1, num1);
            break;
          case '×':
            num1 = Phaser.Math.Between(1, 5);
            num2 = Phaser.Math.Between(1, 5);
            break;
        }

        if (this.difficulty === 'medium') {
          num1 = Phaser.Math.Between(10, 20);
          num2 = Phaser.Math.Between(1, 10);
        } else if (this.difficulty === 'hard') {
          num1 = Phaser.Math.Between(20, 50);
          num2 = Phaser.Math.Between(1, 20);
        }

        this.currentProblem = {
          num1,
          num2,
          operation,
          correctAnswer: this.calculateAnswer(num1, num2, operation)
        };

        this.problemText.setText(`${num1} ${operation} ${num2} = ?`);

        const answers = this.generateAnswers(this.currentProblem.correctAnswer);
        this.answerButtons.forEach((button, index) => {
          button.text.setText(answers[index]);
        });
      }

      calculateAnswer(num1, num2, operation) {
        switch(operation) {
          case '+': return num1 + num2;
          case '-': return num1 - num2;
          case '×': return num1 * num2;
        }
      }

      generateAnswers(correctAnswer) {
        const answers = [correctAnswer];
        while(answers.length < 3) {
          const randomAnswer = correctAnswer + Phaser.Math.Between(-3, 3);
          if(!answers.includes(randomAnswer) && randomAnswer > 0) {
            answers.push(randomAnswer);
          }
        }
        return Phaser.Utils.Array.Shuffle(answers);
      }

      checkAnswer(buttonIndex) {
        const selectedAnswer = parseInt(this.answerButtons[buttonIndex].text.text);
        if(selectedAnswer === this.currentProblem.correctAnswer) {
          this.score += 10;
          this.scoreText.setText(`Score: ${this.score}`);
          this.createHeartAnimation();
          this.time.delayedCall(1000, () => this.generateProblem());
        } else {
          this.score = Math.max(0, this.score - 5);
          this.scoreText.setText(`Score: ${this.score}`);
          this.showSadFace();
        }
      }

      createHeartAnimation() {
        const heart = this.add.image(400, 300, 'heart')
          .setScale(0)
          .setAlpha(1);
        
        this.tweens.add({
          targets: heart,
          scale: 1,
          alpha: 0,
          duration: 800,
          ease: 'Power2',
          onComplete: () => heart.destroy()
        });
      }

      showSadFace() {
        const sad = this.add.image(400, 300, 'sad')
          .setScale(0)
          .setAlpha(0);
        
        this.tweens.add({
          targets: sad,
          scale: 1,
          alpha: 1,
          duration: 200,
          yoyo: true,
          ease: 'Power2',
          onComplete: () => sad.destroy()
        });

        // Add shake effect to wrong answer
        this.cameras.main.shake(200, 0.01);
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      scene: [MainScene],
      backgroundColor: '#ffffff'
    };

    const game = new Phaser.Game(config);
