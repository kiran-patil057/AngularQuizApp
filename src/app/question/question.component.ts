import { QuestionsService } from './../service/questions.service';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name: string = ""
  public questionList: any = []
  public currentQuestion: number = 0
  public points: number = 0
  counter = 60
  correctAnswer: number = 0
  wrongAnswer: number = 0
  interval$: any
  progress: string = '0'
  isQuizComplete:boolean=false
  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!
    this.getAllQuestions()
    this.startCounter()
  }

  getAllQuestions() {
    this.questionsService.getQuestionJson().subscribe(res => {
      console.log(res)
      this.questionList = res
    })
  }

  nextQuestion() {
    this.currentQuestion++
  }
  previousQuestion() {
    this.currentQuestion--
  }
  answer(currentQno: number, option: any) {

    if(currentQno == this.questionList.length){
      this.isQuizComplete=true;
    }

    if (option.correct) {
      this.points += 10
      this.correctAnswer++

      setTimeout(() => {
        this.currentQuestion++
        this.resetcounter()
        this.getProgressPreseent()
      }, 1000)

    }
    else {
      setTimeout(() => {
        this.currentQuestion++
        this.wrongAnswer++
        this.resetcounter()
        this.getProgressPreseent()
      })
      this.points -= 10

    }
  }
  startCounter() {
    this.interval$ = interval(1000).subscribe(res => {
      this.counter--
      if (this.counter === 0) {
        this.currentQuestion++
        this.counter = 60
        this.points -= 10
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 600000)

  }
  stopCounter() {
    this.interval$.unsubscribe()
    this.counter = 0
  }
  resetcounter() {
    this.stopCounter()
    this.counter = 60
    this.startCounter()
  }

  resetQuiz() {
    this.resetcounter();
    this.getAllQuestions();
    this.points = 0
    this.currentQuestion = 0
    this.progress = '0'
  }
  getProgressPreseent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString()
  }

}
