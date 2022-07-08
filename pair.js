(() => {
    const gameBoard = document.getElementById('game-board');
    const playingCards = [];
    const cardTable = createCardField();
    const timer = createTimer();
    const repeatButton = createRepeatButton();
    const startForm = createStartForm();
  
    let fieldSize;
    let cardSizeFactor;
    let deckOfCards = [];
    let intervalTimer;
    let countTime;
  
    gameBoard.append(cardTable);
    cardTable.append(startForm);

    //Создать инпут
    function createInput(type='text', descrValue, placeholder='', inputValue = '') {
      const label = document.createElement('label');
      const descr = document.createElement('span');
      const input = document.createElement('input');

      label.append(descr);
      label.append(input);

      label.classList.add('label');
      descr.classList.add('input-descr');
      input.classList.add('input-area');

      descr.textContent = descrValue;
      input.placeholder = placeholder;
      input.value = inputValue;
      input.type = type;

      return {
        label,
        input,
      }
    }
  
    //создать карточное поле
    function createCardField() {
      const cardField = document.createElement('ul');
      cardField.classList.add('cards-container');
      return cardField;
    }
  
    //создаем элемент карты
    function createCard() {
      const cardEl = document.createElement('li');
      cardEl.classList.add('card');
      cardEl.classList.add('card-revert');
  
      cardEl.style.width = cardSizeFactor + 'px';
      cardEl.style.height = 1.3 * cardSizeFactor + 'px';
  
      cardEl.addEventListener('click', function () {
        if (playingCards.length >= 2) return;
        if (!this.classList.contains('card-top')) {
          this.classList.add('card-top');
          this.classList.remove('card-revert');
          this.style.fontSize = cardSizeFactor + 'px';
          playingCards.push(cardEl);
  
          checkCard(playingCards);
  
          checkhWin();
        } else return;
      });
      return cardEl;
    }
  
    //Cоздание кнопки repeat
    function createRepeatButton() {
      const repeatButton = document.createElement('button');
      repeatButton.classList.add('repeat-button');
      repeatButton.textContent = 'Начать игру заново';
      repeatButton.addEventListener('click', () => {
        destructGame();
        cardTable.append(startForm);
      });
      return repeatButton;
    }
  
    //создаем форму для запуска игры
    function createStartForm() {
      const inputForm = document.createElement('form');
      const cardAmount = createInput('number', 'Введите количество строк/столбцов:', '2, 4, 6, 8, 10');
      const timerInput = createInput('number', 'Введите значение таймера (0 - без таймера)', '', 0);

      const submitBtn = document.createElement('input');
  
      inputForm.append(cardAmount.label);
      inputForm.append(timerInput.label);
      inputForm.append(submitBtn);
  
      inputForm.classList.add('form');
      submitBtn.classList.add('submit-btn');
      submitBtn.type = 'submit';
      submitBtn.value = 'Начать';
  
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();

        fieldSize = cardAmount.input.value < 2 || cardAmount.input.value > 10 || cardAmount.input.value % 2 !== 0
          ? 4 : Number(cardAmount.input.value); 
        countTime = Number(timerInput.input.value);
        cardSizeFactor = 420 / fieldSize - 42 / ((fieldSize * 5) / 4);

        inputForm.remove();
        createGame();
      });
  
      return inputForm;
    }
  
    //создать игру
    function createGame() {
      //создаем колоду
      const numberOfCard = fieldSize * fieldSize;
  
      for (let i = 0; i < numberOfCard; ++i) {
        let cardOut = createCard();
        cardOut.textContent = i < numberOfCard / 2
          ? i + 1
          : i % (numberOfCard / 2) + 1;
        deckOfCards.push(cardOut);
      }
      //тасуем колоду
      const shuffleDeck = shuffle(deckOfCards);
      //раздать карты на стол
      for (const card of shuffleDeck) {
        cardTable.append(card);
      }
      //запуск таймера
      startTimer(countTime);
    }
  
    //перетасовать карты по алгоритму Фишера-Йетса
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    //проверить совпадение
    function checkCard(playingDeck) {
      if (playingDeck.length === 2) {
        setTimeout(() => {
          if (playingDeck[0].textContent !== playingDeck[1].textContent) {
            playingDeck.forEach((card) => {
              card.classList.remove('card-top');
              card.classList.add('card-revert');
              card.style.fontSize = '0px';
            });
          }
          playingDeck.length = 0;
        }, 300);
      }
    }
  
    //проверка открытия всех карт
    function checkhWin() {
      if (cardTable.querySelectorAll('.card-revert').length === 0) {
        cardTable.append(repeatButton);
        timer.timerContainer.remove();
      }
    }
  
    //сбросить текущую игру
    function destructGame() {
      for (const card of deckOfCards) {
        card.remove();
      }
      deckOfCards = [];
      repeatButton.remove();
    }
  
    //создание таймера
    function createTimer() {
      const timerContainer = document.createElement('div'),
        timerBox = document.createElement('span');
  
      timerContainer.classList.add('timer-container');
      timerBox.classList.add('timer-box');
      timerContainer.append(timerBox);
  
      return {
        timerContainer,
        timerBox,
      };
    }
    //отсчет таймера
    function calcSubstractOne() {
      const timer = document.querySelector('.timer-box');
      if (!timer) return;
      if (timer.textContent > 0) {
        timer.textContent--;
      } else {
        clearInterval(intervalTimer);
        for (const card of deckOfCards) {
          card.classList.add('card-top');
          card.classList.remove('card-revert');
          card.style.fontSize = cardSizeFactor + 'px';
        }
        checkhWin();
      }
    }
    //Запуск таймера
    function startTimer(time = 60) {
      if (!time) return;
      cardTable.append(timer.timerContainer);
      timer.timerBox.textContent = time;
      clearInterval(intervalTimer);
      intervalTimer = setInterval(calcSubstractOne, 1000);
    }
  })();
  