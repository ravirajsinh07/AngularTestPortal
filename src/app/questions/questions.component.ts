import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../service/questions.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public marks: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isTestCompleted: boolean = false;
  constructor(private questionService: QuestionsService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions() {
    this.questionService.getQuestionJson().subscribe((res) => {
      this.questionList = res.questions;
    });
  }
  nextQuestion() {
    this.currentQuestion++;
  }
  previousQuestion() {
    this.currentQuestion--;
  }
  answer(currentQno: number, option: any) {
    if (currentQno === this.questionList.length) {
      this.isTestCompleted = true;
      this.stopCounter();
    }
    if (option.correct) {
      this.marks += 5;
      // this.marks= this.marks + 5;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercentage();
      }, 1000);
    } else {
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.incorrectAnswer++;
        this.getProgressPercentage();
        
      }, 1000);
      this.marks -= 5;
    }
  }
  startCounter() {
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if (this.counter === 0) {
        this.currentQuestion++;
        this.counter = 60;
        this.marks -= 5;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 1200000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }
  resetTest() {
    this.resetCounter();
    this.getAllQuestions();
    this.marks = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = '0';
  }
  getProgressPercentage() {
    this.progress = (
      (this.currentQuestion / this.questionList.length) *
      100
    ).toString();
    return this.progress;
  }
}
