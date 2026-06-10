export interface Person {
  readonly name: string;
  readonly title: string;
  readonly email: string;
  readonly phone: string;
  readonly linkedin: string;
  readonly github: string;
  readonly location: string;
}

export const PERSON: Person = {
  name: 'Mikheil Mamniashvili',
  title: 'Senior Frontend Engineer',
  email: 'mishikomamniashvili@gmail.com',
  phone: '+995 598 114 304',
  linkedin: 'https://www.linkedin.com/in/mikheil-mamniashvili/',
  github: 'https://github.com/mishkagitaristi',
  location: 'Tbilisi, Georgia',
};
