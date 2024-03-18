import { Injectable } from '@nestjs/common';
import { readdir, readdirSync, writeFileSync } from 'fs';
import * as mjml2html from 'mjml';
import path from 'path';

@Injectable()
export class MjmlService {
  compile(template: string): string {
    console.log(mjml2html);
    return mjml2html(template).html;
  }
}
