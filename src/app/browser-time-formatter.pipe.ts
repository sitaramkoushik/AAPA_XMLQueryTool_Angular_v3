import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from "@angular/common";

@Pipe({
  name: 'browserTimeFormatter'
})
export class BrowserTimeFormatterPipe extends DatePipe implements PipeTransform {

  public transform(value: any, timeFormat?: any): any {
    if (!value) {
      return
    }
    if (timeFormat == 'utcTime') {
      return value
    } else {
      return this.convert(value)
    }
  }

  private convert(a) {
    try {
      a = a + "Z";
      var b = new Date(a);
      var t = new Date().getTimezoneOffset();
      var k = new Date(b.getMinutes() - t);
      // @ts-ignore
      b.setMinutes(k);
      var d = b.toISOString();
      var index = d.indexOf(".");
      return d.substring(0, index);
    } catch (e) {
      return a
    }
  }
}
