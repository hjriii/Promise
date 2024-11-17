import { core } from '@angular/compiler';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Promise';
  ARRAYS_NUM = 5;

  async onClick() {
    this.test(4, 20);
    this.test(2, 4);
  }

  async test(start: number, end: number): Promise<void> {
    console.log('start : ' + start + 'end : ' + end);
    // 処理対象
    const pages = this.createRangeArray(start, end);
    // スレッド数を決定
    const threads = pages.length < this.ARRAYS_NUM ? pages.length : this.ARRAYS_NUM;
    // スレッド毎に処理対象を振り分け
    const arrays: number[][] = Array.from({ length: threads }, () => []);
    for (let i = start; i <= end; i++) {
      const index = i % threads;
      arrays[index].push(i);
    }
    console.log(arrays);

    // 処理実行
    let p: Promise<void>[] = [];
    for (let i = 0; i < threads; i++) {
      p.push(this.runProcess(arrays[i]));
    }
    // すべて終わるまで待つ
    await Promise.all(p);
  }
  createRangeArray(start: number, end: number): number[] {
    const array: number[] = [];
    for (let i = start; i <= end; i++) { array.push(i); }
    return array;
  }

  async runProcess(arrays: number[]): Promise<void> {
    for (const item of arrays) {
      console.log(item);
      await this.sleep(1000);
      console.log('finish! : ' + item);
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
