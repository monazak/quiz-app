import { allQuestions } from './all-questions.js';

let storedQuestions = JSON.parse(localStorage.getItem('allQuestions'));
if (!storedQuestions) {
  localStorage.setItem('allQuestions', JSON.stringify(allQuestions));
  storedQuestions = allQuestions;
}
let playerData=JSON.parse(localStorage.getItem('playerData')) || [];


const nameInput = document.querySelector('.name-input');
const startBtn = document.querySelector('.start-btn');
const scoreHolder = document.querySelector('.score');
const homeCart = document.querySelector('.home');
const quizCart = document.querySelector('.quiz');
const questionHolder = document.querySelector('.question')
const answers = document.querySelector('.answers');
const nextBtn = document.querySelector('.next-btn');
const leaderBoard = document.querySelector('.leaderBoard')
const leaderBtn = document.querySelector('.leader-btn');
const backBtn = document.querySelector('.back-btn');
const resultList = document.querySelector('.result');
const clearBtn = document.querySelector('.clear-btn');

let quizQuestions=[];
let questionPointer=0;
let questionNum=1;
let score=0;
let player={};


startBtn.addEventListener('click',()=>{

    const name=nameInput.value.trim();
    if(name){
        player.name=name;
        showQuizCart();
    }
    else{ 
        alert('you have to enter name first!');
    }
    
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') 
    startBtn.click();
});

nextBtn.addEventListener('click', nextQuestion);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && nextBtn.style.display === 'block') {
    nextBtn.click();
  }
});            

leaderBtn.addEventListener('click',() => {
    show(leaderBoard);
    hide(homeCart);
    showPlayerResult();
});

backBtn.addEventListener('click',() => {
    show(homeCart);
    hide(leaderBoard);
});
clearBtn.addEventListener('click',clearLeaderBoard);


function showQuizCart(){
    quizQuestions.splice(0,10);
    selectQuizQuestion();
    hide(homeCart);
    show(quizCart);
    hide(nextBtn);
    displayQuizQuestion();
}

function displayQuizQuestion(){
   questionHolder.innerText = `${questionNum}/10. ${quizQuestions[questionPointer].question} ` ;
        
    for(let i=0 ; i<4 ; i++){
        const ansBtn = document.createElement('button');
        ansBtn.innerText = quizQuestions[questionPointer].options[i];
        ansBtn.classList.add('answer-btn');
        
        if(ansBtn.innerText === quizQuestions[questionPointer].answer){
            ansBtn.dataset.correct = 'correct';
        }
            
        ansBtn.addEventListener('click',(e)=>{
                selectAnswer(e.target);
        });

        answers.append(ansBtn);
    }
}

function selectAnswer(selectedBtn){

    if (selectedBtn.dataset.correct === 'correct'){
        selectedBtn.classList.add('correct-answer');
        score++;
    }else{
        selectedBtn.classList.add('false-answer');
    }

    Array.from(answers.children).forEach((btn)=>{
        if(btn.dataset.correct === 'correct'){
            btn.classList.add('correct-answer');
        }
        btn.disabled = true;
    });
            
    show(nextBtn);
}

function nextQuestion(){
    clearOptions();

    if(questionPointer < 9){
        questionPointer++;
        questionNum++;
        hide(nextBtn);
        displayQuizQuestion();
    }else{
       show(homeCart);
       hide(quizCart);
       scoreHolder.innerText = `Your score is ${score}/10`  ;
       player.result=score;
       playerData.push({...player});
       localStorage.setItem("playerData", JSON.stringify(playerData));
       restart();
    }
}

function restart(){
    nameInput.value = '';
    questionPointer = 0;
    questionNum = 1;
    score = 0;
    quizQuestions.splice(0,10);
    player = {};

}


function selectQuizQuestion(){
    while (quizQuestions.length < 10){
        let randomNum = Math.floor(Math.random() * storedQuestions.length);
        if (!quizQuestions.includes(storedQuestions[randomNum])){
            quizQuestions.push(storedQuestions[randomNum]);
        }
    }
}


function showPlayerResult(){
    resultList.innerHTML = '';
    const sortedData = [...playerData].sort((a, b) => b.result - a.result);


    sortedData.forEach(player=>{ 
        const li = document.createElement('li');
        const name = document.createElement('p');
        const result = document.createElement('p');

        name.innerText = player.name;
        name.classList.add('name');

        result.innerText = `${player.result}/10`;
        result.classList.add('result');

        li.appendChild(name);
        li.appendChild(result);
        resultList.appendChild(li);
    });
}

function clearLeaderBoard(){
    localStorage.removeItem('playerData');
    playerData=[];
    resultList.innerHTML='';
}

function show(element) { 
    element.style.display = 'block';
}

function hide(element) {
     element.style.display = 'none';
}

function clearOptions(){
    while(answers.firstChild){
        answers.removeChild(answers.firstChild);
    }
}

