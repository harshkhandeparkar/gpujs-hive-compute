import help from './helper';
import { question } from 'readline-sync';

const url = question('What is the URL?: ');
help(url);